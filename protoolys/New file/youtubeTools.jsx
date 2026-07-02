import React, { useState } from 'react';
import { Input, Button, Label, Textarea, Icons, CopyBtn } from './_common';
import { api } from '../lib/api';

function ytIdFromUrl(url) {
  const m = url.match(/(?:v=|youtu\.be\/|\/embed\/|\/shorts\/)([\w-]{11})/);
  return m ? m[1] : null;
}

function YTBox({ render }) {
  const [url, setUrl] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const run = async () => {
    setLoading(true); setErr(''); setData(null);
    try { const r = await api.post('/yt/info', { url }); setData(r.data); }
    catch (e) { setErr(e.response?.data?.detail || 'Could not fetch video info'); }
    setLoading(false);
  };
  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="flex-1 font-mono" />
        <Button onClick={run} disabled={loading || !url} className="bg-indigo-600 hover:bg-indigo-700 text-white">{loading ? <Icons.Loader2 className="w-4 h-4 animate-spin" /> : <><Icons.Play className="w-4 h-4 mr-1" /> Fetch</>}</Button>
      </div>
      {err && <div className="mt-3 p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded text-sm">{err}</div>}
      {data && <div className="mt-5">{render(data)}</div>}
    </div>
  );
}

const StatLine = ({ k, v, mono }) => (<div className="p-3 bg-slate-50 border border-slate-200 rounded-lg"><div className="text-xs text-slate-500">{k}</div><div className={`text-base font-bold text-slate-900 ${mono ? 'font-mono' : ''}`}>{v}</div></div>);

export const YTThumbnailDownloader = () => (
  <YTBox render={(d) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {Object.entries(d.thumbnails).map(([k, src]) => (
        <div key={k} className="border border-slate-200 rounded-xl overflow-hidden">
          <img src={src} alt={k} className="w-full" onError={(e) => e.target.style.display = 'none'} />
          <div className="p-3 flex items-center justify-between">
            <span className="text-sm font-semibold capitalize">{k}</span>
            <a href={src} download={`${d.videoId}-${k}.jpg`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs"><Icons.Download className="w-3.5 h-3.5" /> Download</a>
          </div>
        </div>
      ))}
    </div>
  )} />
);

export const YTTitleExtractor = () => (
  <YTBox render={(d) => (
    <div>
      <Label>Title</Label>
      <div className="mt-1.5 flex items-center gap-2"><Input readOnly value={d.title} className="font-medium bg-slate-50" /><CopyBtn value={d.title} /></div>
    </div>
  )} />
);

export const YTDescriptionExtractor = () => (
  <YTBox render={(d) => (
    <div>
      <Label>Channel</Label><Input readOnly value={d.author} className="mt-1.5 bg-slate-50" />
      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">YouTube\u2019s public oEmbed API only exposes title and author. Full description requires authenticated YouTube Data API access.</div>
    </div>
  )} />
);

export const YTChannelLogoDownloader = () => (
  <YTBox render={(d) => (
    <div>
      <Label>Channel</Label><Input readOnly value={d.author} className="mt-1.5 bg-slate-50" />
      <div className="mt-3"><Label>Channel URL</Label><Input readOnly value={d.channelUrl} className="mt-1.5 font-mono text-xs bg-slate-50" /></div>
      <a target="_blank" rel="noopener noreferrer" href={d.channelUrl} className="mt-4 inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm"><Icons.ExternalLink className="w-4 h-4" /> Open channel to get logo</a>
    </div>
  )} />
);

export const YTChannelIDFinder = () => {
  const [url, setUrl] = useState('');
  const m = url.match(/(?:channel\/)([A-Za-z0-9_-]+)/);
  const handle = url.match(/(?:@)([A-Za-z0-9_-]+)/);
  return (
    <div>
      <Label>Channel URL or handle (@name)</Label>
      <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://www.youtube.com/@username or /channel/UCxxxxx" className="mt-1.5 font-mono" />
      {(m || handle) && <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-lg"><div className="text-xs font-semibold text-indigo-700 uppercase">Detected</div><div className="font-mono text-lg font-bold text-slate-900 mt-1 break-all">{m ? m[1] : '@' + handle[1]}</div></div>}
    </div>
  );
};

export const YTRegionRestriction = () => (
  <YTBox render={(d) => (
    <div className="space-y-3">
      <StatLine k="Video ID" v={d.videoId} mono />
      <a target="_blank" rel="noopener noreferrer" href={`https://www.youtube.com/watch?v=${d.videoId}`} className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm"><Icons.ExternalLink className="w-4 h-4" /> Open on YouTube</a>
      <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">Region restriction data requires YouTube Data API v3 with API key. Click "Open on YouTube" \u2014 a "Video unavailable" message indicates regional blocking.</div>
    </div>
  )} />
);

export const YTVideoStatistics = () => (
  <YTBox render={(d) => (
    <div className="space-y-3">
      <StatLine k="Title" v={d.title} />
      <StatLine k="Author" v={d.author} />
      <StatLine k="Video ID" v={d.videoId} mono />
      <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">View, like, and comment counts require YouTube Data API v3 with an API key.</div>
    </div>
  )} />
);

export const YTChannelStatistics = () => {
  const [url, setUrl] = useState('');
  return (
    <div>
      <Label>Channel URL or @handle</Label>
      <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://www.youtube.com/@username" className="mt-1.5 font-mono" />
      {url && (
        <div className="mt-5 space-y-2">
          <a target="_blank" rel="noopener noreferrer" href={`https://socialblade.com/youtube/c/${encodeURIComponent(url)}`} className="block p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-indigo-300"><div className="font-semibold text-slate-900">Open in Social Blade <Icons.ExternalLink className="w-3.5 h-3.5 inline" /></div><div className="text-xs text-slate-500">Subscriber count, views, estimated earnings</div></a>
        </div>
      )}
    </div>
  );
};

export const YTChannelFinder = () => {
  const [q, setQ] = useState('');
  return (
    <div>
      <Label>Keyword or niche</Label>
      <Input value={q} onChange={e => setQ(e.target.value)} placeholder="e.g. cooking, gaming, fitness" className="mt-1.5" />
      {q && <a target="_blank" rel="noopener noreferrer" href={`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}&sp=EgIQAg%253D%253D`} className="mt-4 inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm"><Icons.ExternalLink className="w-4 h-4" /> Search channels on YouTube</a>}
    </div>
  );
};

export const YTBannerDownloader = () => (
  <YTBox render={(d) => (
    <div>
      <Label>Channel URL</Label>
      <Input readOnly value={d.channelUrl} className="mt-1.5 font-mono text-xs bg-slate-50" />
      <a target="_blank" rel="noopener noreferrer" href={d.channelUrl} className="mt-4 inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm"><Icons.ExternalLink className="w-4 h-4" /> Open channel</a>
      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">Banner images can be downloaded from the channel\u2019s About page (right-click on the banner).</div>
    </div>
  )} />
);

// Tag/Hashtag/Title/Description generators (rule-based + AI fallback)
const generateTagsFromKeyword = (kw) => {
  const base = kw.split(/[\s,]+/).filter(Boolean);
  const variants = [];
  for (const b of base) {
    variants.push(b, `best ${b}`, `${b} 2025`, `${b} tutorial`, `how to ${b}`, `${b} tips`, `${b} guide`, `${b} for beginners`, `top ${b}`, `${b} review`);
  }
  return [...new Set(variants)];
};

export const YTTagGenerator = () => {
  const [kw, setKw] = useState('');
  const tags = generateTagsFromKeyword(kw);
  return (
    <div>
      <Label>Topic / seed keyword</Label>
      <Input value={kw} onChange={e => setKw(e.target.value)} placeholder="e.g. fitness, javascript tutorial" className="mt-1.5" />
      {tags.length > 0 && kw && (
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2"><Label>Suggested tags</Label><CopyBtn value={tags.join(', ')} /></div>
          <div className="flex flex-wrap gap-2">{tags.map(t => <span key={t} className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">{t}</span>)}</div>
        </div>
      )}
    </div>
  );
};
export const YTHashtagGenerator = () => {
  const [kw, setKw] = useState('');
  const hashes = generateTagsFromKeyword(kw).map(t => '#' + t.replace(/\s+/g, ''));
  return (
    <div>
      <Label>Topic / seed keyword</Label>
      <Input value={kw} onChange={e => setKw(e.target.value)} placeholder="e.g. travel, food" className="mt-1.5" />
      {hashes.length > 0 && kw && (
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2"><Label>Hashtags</Label><CopyBtn value={hashes.join(' ')} /></div>
          <div className="flex flex-wrap gap-2">{hashes.map(h => <span key={h} className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-mono font-medium">{h}</span>)}</div>
        </div>
      )}
    </div>
  );
};
export const YTTagExtractor = () => {
  const [text, setText] = useState('');
  const tags = [...new Set((text.match(/#[\w]+/g) || []).concat(text.split(/[,;]/).map(s => s.trim()).filter(s => s && s.length < 40)))];
  return (
    <div>
      <Label>Paste video title + description</Label>
      <Textarea value={text} onChange={e => setText(e.target.value)} className="mt-1.5 min-h-[180px]" />
      {tags.length > 0 && <div className="mt-5"><div className="flex items-center justify-between mb-2"><Label>Extracted tags ({tags.length})</Label><CopyBtn value={tags.join(', ')} /></div><div className="flex flex-wrap gap-2">{tags.map(t => <span key={t} className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs">{t}</span>)}</div></div>}
    </div>
  );
};
export const YTHashtagExtractor = () => {
  const [text, setText] = useState('');
  const tags = [...new Set(text.match(/#[\w]+/g) || [])];
  return (
    <div>
      <Label>Paste description or text</Label>
      <Textarea value={text} onChange={e => setText(e.target.value)} className="mt-1.5 min-h-[180px]" />
      {tags.length > 0 && <div className="mt-5"><div className="flex items-center justify-between mb-2"><Label>Hashtags ({tags.length})</Label><CopyBtn value={tags.join(' ')} /></div><div className="flex flex-wrap gap-2">{tags.map(t => <span key={t} className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-mono">{t}</span>)}</div></div>}
    </div>
  );
};
export const YTTitleGenerator = () => {
  const [kw, setKw] = useState('');
  const titles = kw ? [
    `${kw} - The Complete Guide for 2025`,
    `10 Things You DIDN\u2019T Know About ${kw}`,
    `Why ${kw} Is Changing Everything`,
    `${kw}: A Beginner\u2019s Tutorial`,
    `How To Master ${kw} in 7 Days`,
    `Top 5 ${kw} Mistakes To Avoid`,
    `${kw} Explained Simply (with examples)`,
    `I Tried ${kw} For 30 Days \u2014 Here\u2019s What Happened`,
  ] : [];
  return (
    <div>
      <Label>Topic</Label>
      <Input value={kw} onChange={e => setKw(e.target.value)} className="mt-1.5" />
      {titles.length > 0 && <div className="mt-5 space-y-2">{titles.map(t => <div key={t} className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg"><span className="flex-1 text-sm font-medium text-slate-800">{t}</span><CopyBtn value={t} /></div>)}</div>}
    </div>
  );
};
export const YTDescriptionGenerator = () => {
  const [kw, setKw] = useState(''); const [links, setLinks] = useState('');
  const out = kw ? `\ud83d\udd25 Welcome to this video about ${kw}!\n\nIn this video, you\u2019ll learn everything you need to know about ${kw}, including practical tips, examples, and step-by-step guidance.\n\n\u23f1\ufe0f TIMESTAMPS:\n00:00 Intro\n01:30 What is ${kw}\n05:00 Step-by-step\n12:00 Common mistakes\n15:00 Conclusion\n\n\ud83d\udd17 USEFUL LINKS:\n${links || '- Add your links here'}\n\n\ud83d\udc4d If this video helped, smash that like button and SUBSCRIBE for more!\n\n#${kw.replace(/\s+/g, '')} #tutorial #2025` : '';
  return (
    <div>
      <Label>Topic</Label><Input value={kw} onChange={e => setKw(e.target.value)} className="mt-1.5" />
      <div className="mt-3"><Label>Useful links (optional)</Label><Textarea value={links} onChange={e => setLinks(e.target.value)} className="mt-1.5 min-h-[80px]" /></div>
      {out && <div className="mt-5"><div className="flex items-center justify-between mb-2"><Label>Description</Label><CopyBtn value={out} /></div><Textarea readOnly value={out} className="min-h-[260px] font-mono text-sm bg-slate-50" /></div>}
    </div>
  );
};

export const YTTrendsChecker = () => {
  const [c, setC] = useState('US');
  const countries = [['US','United States'],['GB','United Kingdom'],['CA','Canada'],['AU','Australia'],['DE','Germany'],['FR','France'],['ES','Spain'],['IT','Italy'],['BR','Brazil'],['IN','India'],['JP','Japan'],['KR','South Korea'],['SA','Saudi Arabia'],['EG','Egypt'],['AE','UAE']];
  return (
    <div>
      <Label>Country</Label>
      <select value={c} onChange={e => setC(e.target.value)} className="mt-1.5 h-10 w-full sm:w-64 border border-slate-200 rounded-md px-3 text-sm bg-white">{countries.map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select>
      <div className="mt-5 space-y-2">
        <a target="_blank" rel="noopener noreferrer" href={`https://www.youtube.com/feed/trending?gl=${c}`} className="block p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-indigo-300"><div className="font-semibold text-slate-900">View YouTube Trends in {countries.find(x => x[0] === c)[1]} <Icons.ExternalLink className="w-4 h-4 inline" /></div></a>
        <a target="_blank" rel="noopener noreferrer" href={`https://trends.google.com/trends/explore?geo=${c}&q=youtube`} className="block p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-indigo-300"><div className="font-semibold text-slate-900">Google Trends for YouTube <Icons.ExternalLink className="w-4 h-4 inline" /></div></a>
      </div>
    </div>
  );
};
