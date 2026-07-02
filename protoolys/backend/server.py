from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import time
import logging
from pathlib import Path
from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime
import httpx
import dns.resolver
import re
from urllib.parse import urlparse
import google.generativeai as genai

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI(title="Protooly API")
api = APIRouter(prefix="/api")

# ----------------- Models -----------------
class TrackIn(BaseModel):
    slug: str
    sessionId: Optional[str] = None

class FavoriteIn(BaseModel):
    slug: str

class ContactIn(BaseModel):
    name: str
    email: str
    message: str

class URLIn(BaseModel):
    url: str

class DomainIn(BaseModel):
    domain: str


# ----------------- Tools metadata -----------------
CATEGORIES = [
    {"id":"pdf","name":"PDF Tools"},{"id":"ai","name":"AI Writing Tools"},
    {"id":"video","name":"Video Downloaders"},{"id":"youtube","name":"YouTube Tools"},
    {"id":"text","name":"Text Tools"},{"id":"seo","name":"SEO Tools"},
    {"id":"web","name":"Domain & Web Tools"},{"id":"code","name":"Code Tools"},
    {"id":"json","name":"JSON & Data"},{"id":"image","name":"Image Tools"},
    {"id":"calc","name":"Calculators"},{"id":"units","name":"Unit Converters"},
    {"id":"numbers","name":"Number Systems"},{"id":"misc","name":"Other Utilities"},
]


@api.get("/")
async def root():
    return {"service": "Protooly API", "version": "1.0.0"}


@api.get("/categories")
async def get_categories():
    return CATEGORIES


# ----------------- Analytics -----------------
@api.post("/track")
async def track_tool(payload: TrackIn):
    slug = payload.slug.strip().lower()
    if not slug:
        raise HTTPException(400, "slug required")
    await db.tool_usage.update_one(
        {"slug": slug},
        {"$inc": {"count": 1}, "$set": {"updatedAt": datetime.utcnow()}},
        upsert=True,
    )
    return {"ok": True}


@api.get("/popular")
async def popular(limit: int = 12):
    items = await db.tool_usage.find().sort("count", -1).limit(limit).to_list(limit)
    return [{"slug": i["slug"], "count": i.get("count", 0)} for i in items]


# ----------------- Favorites -----------------
@api.get("/favorites/{session_id}")
async def get_favs(session_id: str):
    items = await db.favorites.find({"sessionId": session_id}).to_list(500)
    return [i["slug"] for i in items]


@api.post("/favorites/{session_id}")
async def toggle_fav(session_id: str, payload: FavoriteIn):
    existing = await db.favorites.find_one({"sessionId": session_id, "slug": payload.slug})
    if existing:
        await db.favorites.delete_one({"_id": existing["_id"]})
        return {"slug": payload.slug, "favorited": False}
    await db.favorites.insert_one({
        "id": str(uuid.uuid4()),
        "sessionId": session_id,
        "slug": payload.slug,
        "createdAt": datetime.utcnow(),
    })
    return {"slug": payload.slug, "favorited": True}


@api.delete("/favorites/{session_id}/{slug}")
async def delete_fav(session_id: str, slug: str):
    res = await db.favorites.delete_one({"sessionId": session_id, "slug": slug})
    return {"deleted": res.deleted_count}


# ----------------- Server-side tools -----------------
def _normalize_url(u: str) -> str:
    if not u:
        raise HTTPException(400, "url required")
    u = u.strip()
    if not u.startswith(("http://", "https://")):
        u = "https://" + u
    return u


@api.post("/net/http-status")
async def http_status(payload: URLIn):
    url = _normalize_url(payload.url)
    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=15.0) as cx:
            r = await cx.get(url, headers={"User-Agent": "ProtoolyBot/1.0"})
        return {
            "url": url,
            "status": r.status_code,
            "statusText": r.reason_phrase,
            "finalUrl": str(r.url),
            "redirects": len(r.history),
            "history": [{"status": h.status_code, "url": str(h.url)} for h in r.history],
        }
    except Exception as e:
        raise HTTPException(502, f"Request failed: {e}")


@api.post("/net/headers")
async def get_headers(payload: URLIn):
    url = _normalize_url(payload.url)
    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=15.0) as cx:
            r = await cx.get(url, headers={"User-Agent": "ProtoolyBot/1.0"})
        return {"url": url, "status": r.status_code, "headers": dict(r.headers)}
    except Exception as e:
        raise HTTPException(502, f"Request failed: {e}")


@api.post("/net/page-size")
async def page_size(payload: URLIn):
    url = _normalize_url(payload.url)
    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=20.0) as cx:
            r = await cx.get(url, headers={"User-Agent": "ProtoolyBot/1.0"})
        size = len(r.content)
        return {
            "url": url,
            "bytes": size,
            "kb": round(size / 1024, 2),
            "mb": round(size / (1024 * 1024), 3),
            "contentType": r.headers.get("content-type", ""),
            "status": r.status_code,
        }
    except Exception as e:
        raise HTTPException(502, f"Request failed: {e}")


@api.post("/net/domain-to-ip")
async def domain_to_ip(payload: DomainIn):
    domain = payload.domain.strip().lower()
    if domain.startswith(("http://", "https://")):
        domain = urlparse(domain).hostname or domain
    if not domain:
        raise HTTPException(400, "domain required")
    try:
        ips: List[str] = []
        try:
            for r in dns.resolver.resolve(domain, "A"):
                ips.append(r.to_text())
        except Exception:
            pass
        ipv6: List[str] = []
        try:
            for r in dns.resolver.resolve(domain, "AAAA"):
                ipv6.append(r.to_text())
        except Exception:
            pass
        return {"domain": domain, "ipv4": ips, "ipv6": ipv6}
    except Exception as e:
        raise HTTPException(502, f"DNS failed: {e}")


@api.post("/net/dns-records")
async def dns_records(payload: DomainIn):
    domain = payload.domain.strip().lower()
    if domain.startswith(("http://", "https://")):
        domain = urlparse(domain).hostname or domain
    result: Dict[str, List[str]] = {}
    for rec in ["A", "AAAA", "MX", "NS", "TXT", "CNAME"]:
        try:
            answers = dns.resolver.resolve(domain, rec)
            result[rec] = [a.to_text() for a in answers]
        except Exception:
            result[rec] = []
    return {"domain": domain, "records": result}


@api.post("/net/server-status")
async def server_status(payload: URLIn):
    url = _normalize_url(payload.url)
    t0 = time.time()
    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=10.0) as cx:
            r = await cx.get(url, headers={"User-Agent": "ProtoolyBot/1.0"})
        return {
            "url": url,
            "up": 200 <= r.status_code < 400,
            "status": r.status_code,
            "latencyMs": int((time.time() - t0) * 1000),
        }
    except Exception as e:
        return {"url": url, "up": False, "status": 0, "error": str(e),
                "latencyMs": int((time.time() - t0) * 1000)}


@api.post("/net/redirect-chain")
async def redirect_chain(payload: URLIn):
    url = _normalize_url(payload.url)
    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=15.0) as cx:
            r = await cx.get(url, headers={"User-Agent": "ProtoolyBot/1.0"})
        chain = [{"url": str(h.url), "status": h.status_code} for h in r.history]
        chain.append({"url": str(r.url), "status": r.status_code})
        return {"start": url, "chain": chain, "hops": len(chain) - 1}
    except Exception as e:
        raise HTTPException(502, f"Request failed: {e}")


# ----------------- Contact -----------------
@api.post("/contact")
async def contact(payload: ContactIn):
    doc = {
        "id": str(uuid.uuid4()),
        "name": payload.name,
        "email": payload.email,
        "message": payload.message,
        "createdAt": datetime.utcnow(),
    }
    await db.contacts.insert_one(doc)
    return {"id": doc["id"], "ok": True}


# ----------------- AI Tools (Gemini) -----------------
class AIIn(BaseModel):
    text: str
    extra: Optional[str] = None

async def _ai_run(system: str, prompt: str) -> str:
    if not GEMINI_API_KEY:
        raise HTTPException(503, "AI service not configured")
    try:
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=system
        )
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        raise HTTPException(502, f"AI error: {e}")


@api.post("/ai/summarize")
async def ai_summarize(p: AIIn):
    text = await _ai_run(
        "You are an expert summarizer. Output concise bullet-point summaries with key insights.",
        f"Summarize the following content in 5-7 bullet points:\n\n{p.text}"
    )
    return {"result": text}


@api.post("/ai/paraphrase")
async def ai_paraphrase(p: AIIn):
    style = p.extra or "natural"
    text = await _ai_run(
        f"You are an expert {style} paraphraser. Rewrite text preserving meaning. Output only the paraphrased version.",
        f"Paraphrase the following text in a {style} style:\n\n{p.text}"
    )
    return {"result": text}


@api.post("/ai/translate")
async def ai_translate(p: AIIn):
    target = p.extra or "Spanish"
    text = await _ai_run(
        f"You are a professional translator. Translate accurately to {target}. Output only the translation.",
        f"Translate the following to {target}:\n\n{p.text}"
    )
    return {"result": text}


@api.post("/ai/generate")
async def ai_generate(p: AIIn):
    text = await _ai_run(
        "You are a helpful writing assistant. Produce high-quality original text on the requested topic.",
        f"Write content about: {p.text}\n\nStyle/details: {p.extra or 'professional, informative'}"
    )
    return {"result": text}


@api.post("/ai/grammar")
async def ai_grammar(p: AIIn):
    text = await _ai_run(
        "You are a careful grammar and style editor. Return the corrected text only, preserving meaning.",
        f"Fix grammar, spelling, punctuation and style in the following text. Return only the corrected version:\n\n{p.text}"
    )
    return {"result": text}


@api.post("/ai/humanize")
async def ai_humanize(p: AIIn):
    text = await _ai_run(
        "You are a human-tone editor. Rewrite AI-generated text to sound natural and human, varied sentence lengths, casual phrasing where appropriate.",
        f"Rewrite the following to sound naturally human-written:\n\n{p.text}"
    )
    return {"result": text}


@api.post("/ai/rewrite")
async def ai_rewrite(p: AIIn):
    text = await _ai_run(
        "You are an article rewriter. Rewrite the text in fresh wording, preserving meaning and structure. Avoid plagiarism.",
        f"Rewrite this article uniquely:\n\n{p.text}"
    )
    return {"result": text}


@api.post("/ai/citation")
async def ai_citation(p: AIIn):
    style = p.extra or "APA"
    text = await _ai_run(
        f"You are a citation expert. Produce accurate citations in {style} style.",
        f"Generate a {style} citation for the following source (book, article or URL):\n\n{p.text}\n\nReturn only the citation."
    )
    return {"result": text}


@api.post("/ai/detect")
async def ai_detect(p: AIIn):
    text = await _ai_run(
        "You are an AI-text classifier. Estimate the probability the text was AI-generated. Respond with JSON: {\"ai_probability\": 0-100, \"verdict\": \"likely human|mixed|likely ai\", \"reasoning\": \"...\"}.",
        f"Analyze and classify:\n\n{p.text}"
    )
    return {"result": text}


# ----------------- YouTube data tools -----------------
def _yt_id(url: str) -> Optional[str]:
    m = re.search(r'(?:v=|youtu\.be/|/embed/|/shorts/)([\w-]{11})', url)
    return m.group(1) if m else None

class YTIn(BaseModel):
    url: str

@api.post("/yt/info")
async def yt_info(p: YTIn):
    vid = _yt_id(p.url)
    if not vid:
        raise HTTPException(400, "Invalid YouTube URL")
    try:
        async with httpx.AsyncClient(timeout=10.0) as cx:
            r = await cx.get(f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid}&format=json")
        data = r.json() if r.status_code == 200 else {}
        return {
            "videoId": vid,
            "title": data.get("title", ""),
            "author": data.get("author_name", ""),
            "channelUrl": data.get("author_url", ""),
            "thumbnails": {
                "default": f"https://i.ytimg.com/vi/{vid}/default.jpg",
                "medium": f"https://i.ytimg.com/vi/{vid}/mqdefault.jpg",
                "high": f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg",
                "standard": f"https://i.ytimg.com/vi/{vid}/sddefault.jpg",
                "maxres": f"https://i.ytimg.com/vi/{vid}/maxresdefault.jpg",
            },
            "embed": f'<iframe width="560" height="315" src="https://www.youtube.com/embed/{vid}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
        }
    except Exception as e:
        raise HTTPException(502, f"YouTube error: {e}")


# Mount router
app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
