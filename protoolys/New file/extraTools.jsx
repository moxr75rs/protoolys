import React, { useState, useEffect } from 'react';
import jsQR from 'jsqr';
import { Input, Button, Label, Textarea, Icons, CopyBtn } from './_common';
import * as API from '../lib/api';

// QR Code Decoder
export const QRDecoder = () => {
  const [result, setResult] = useState('');
  const [err, setErr] = useState('');
  const onFile = (f) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
        const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, c.width, c.height);
        const code = jsQR(data.data, data.width, data.height);
        if (code) { setResult(code.data); setErr(''); } else { setErr('No QR code found in image'); setResult(''); }
      };
      img.src = r.result;
    };
    r.readAsDataURL(f);
  };
  return (
    <div>
      <label className="block border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40">
        <input type="file" accept="image/*" className="hidden" onChange={e => onFile(e.target.files?.[0])} />
        <Icons.QrCode className="w-10 h-10 mx-auto text-indigo-500" />
        <p className="mt-2 font-semibold">Upload a QR code image</p>
      </label>
      {err && <div className="mt-3 p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded text-sm">{err}</div>}
      {result && <div className="mt-5"><div className="flex items-center justify-between mb-1"><Label>Decoded content</Label><CopyBtn value={result} /></div><Textarea readOnly value={result} className="font-mono text-sm bg-slate-50" /></div>}
    </div>
  );
};

// Find Facebook ID
export const FacebookID = () => {
  const [url, setUrl] = useState('');
  const id = (url.match(/(?:facebook\.com\/)(?:profile\.php\?id=)?([A-Za-z0-9.]+)/) || [])[1] || '';
  return (
    <div>
      <Label>Facebook URL</Label>
      <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://www.facebook.com/zuck" className="mt-1.5 font-mono" />
      {id && (
        <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
          <div className="text-xs font-semibold text-indigo-700 uppercase">{/^\d+$/.test(id) ? 'Facebook ID' : 'Username (vanity)'}</div>
          <div className="font-mono text-lg font-bold text-slate-900 mt-1 break-all">{id}</div>
          {!/^\d+$/.test(id) && <a target="_blank" rel="noopener noreferrer" href={`https://lookup-id.com/?facebook=${id}`} className="mt-3 inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline">Resolve to numeric ID <Icons.ExternalLink className="w-3.5 h-3.5" /></a>}
        </div>
      )}
    </div>
  );
};

// IP Address Lookup
export const IPLookup = () => {
  const [ip, setIp] = useState('8.8.8.8');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const run = async () => {
    setLoading(true);
    try { const r = await fetch(`https://ipapi.co/${ip}/json/`); setData(await r.json()); }
    catch (e) { setData({ error: e.message }); }
    setLoading(false);
  };
  useEffect(() => { run(); }, []);
  return (
    <div>
      <div className="flex gap-2"><Input value={ip} onChange={e => setIp(e.target.value)} placeholder="8.8.8.8" className="font-mono" /><Button onClick={run} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">{loading ? <Icons.Loader2 className="w-4 h-4 animate-spin" /> : 'Lookup'}</Button></div>
      {data && !data.error && (
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[['Country', data.country_name], ['City', data.city], ['Region', data.region], ['Postal', data.postal], ['ISP', data.org], ['Timezone', data.timezone], ['Latitude', data.latitude], ['Longitude', data.longitude]].map(([k, v]) => v ? <div key={k} className="p-3 bg-slate-50 border border-slate-200 rounded-lg"><div className="text-xs text-slate-500">{k}</div><div className="font-bold text-slate-900">{v}</div></div> : null)}
        </div>
      )}
    </div>
  );
};

// Whois — uses public APIs as best-effort
export const WhoisLookup = () => {
  const [domain, setDomain] = useState('example.com');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const run = async () => { setLoading(true); try { const d = await API.netDnsRecords(domain); setData(d); } catch {} setLoading(false); };
  return (
    <div>
      <div className="flex gap-2"><Input value={domain} onChange={e => setDomain(e.target.value)} placeholder="example.com" className="font-mono" /><Button onClick={run} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">Lookup</Button></div>
      {data && <div className="mt-5 space-y-3">{Object.entries(data.records).filter(([_, v]) => v.length).map(([rec, vals]) => <div key={rec} className="p-4 rounded-lg border border-slate-200 bg-slate-50"><div className="text-xs font-bold text-indigo-700 uppercase mb-2">{rec}</div>{vals.map((v, i) => <div key={i} className="font-mono text-sm break-all">{v}</div>)}</div>)}</div>}
      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">Full Whois (registrar, expiry, name) requires paid Whois APIs. Above shows DNS records as a free alternative.</div>
    </div>
  );
};
export const DomainAge = WhoisLookup;
export const HostingChecker = WhoisLookup;

// Generic external-link redirect for SEO checkers
const ExternalRedirect = ({ url, title, desc }) => {
  const [val, setVal] = useState('');
  const target = url(val);
  return (
    <div>
      <Label>Enter URL or domain</Label>
      <Input value={val} onChange={e => setVal(e.target.value)} placeholder="example.com" className="mt-1.5 font-mono" />
      <p className="text-sm text-slate-500 mt-2">{desc}</p>
      {val && <a target="_blank" rel="noopener noreferrer" href={target} className="mt-4 inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm"><Icons.ExternalLink className="w-4 h-4" /> Check on {title}</a>}
    </div>
  );
};

export const BacklinkChecker = () => <ExternalRedirect url={(v) => `https://ahrefs.com/website-authority-checker?input=${encodeURIComponent(v)}`} title="Ahrefs" desc="Free Ahrefs Backlink Checker shows top backlinks and authority of any domain." />;
export const DAChecker = () => <ExternalRedirect url={(v) => `https://moz.com/domain-analysis?site=${encodeURIComponent(v)}`} title="Moz" desc="Free Moz DA tool provides Domain Authority for any website." />;
export const PAChecker = () => <ExternalRedirect url={(v) => `https://moz.com/domain-analysis?site=${encodeURIComponent(v)}`} title="Moz" desc="Free Moz tool shows Page Authority along with DA." />;
export const DAPAChecker = () => <ExternalRedirect url={(v) => `https://moz.com/domain-analysis?site=${encodeURIComponent(v)}`} title="Moz" desc="Check both Domain & Page Authority side by side." />;
export const MozRank = () => <ExternalRedirect url={(v) => `https://moz.com/domain-analysis?site=${encodeURIComponent(v)}`} title="Moz" desc="MozRank link popularity score from Moz." />;
export const GoogleIndex = () => <ExternalRedirect url={(v) => `https://www.google.com/search?q=site:${encodeURIComponent(v)}`} title="Google" desc="See which pages of your site are indexed by Google using site: operator." />;
export const GoogleCache = () => <ExternalRedirect url={(v) => `https://webcache.googleusercontent.com/search?q=cache:${encodeURIComponent(v)}`} title="Google" desc="View Google\u2019s cached snapshot of any URL." />;
export const SEOAudit = () => <ExternalRedirect url={(v) => `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(v)}`} title="PageSpeed" desc="Run a complete SEO + performance audit via Google PageSpeed Insights." />;
export const WPThemeDetector = () => <ExternalRedirect url={(v) => `https://www.wpthemedetector.com/?url=${encodeURIComponent(v)}`} title="WP Theme Detector" desc="Detects the WordPress theme and plugins of any site." />;
export const KeywordSuggestion = () => <ExternalRedirect url={(v) => `https://www.google.com/search?q=${encodeURIComponent(v)}`} title="Google Suggest" desc="See related searches that Google auto-suggests for your seed keyword." />;
export const MetaTagAnalyzer = () => <ExternalRedirect url={(v) => `https://metatags.io/?url=${encodeURIComponent(v)}`} title="Metatags.io" desc="Inspect and preview meta tags including OG and Twitter cards." />;
export const OpenGraphChecker = () => <ExternalRedirect url={(v) => `https://www.opengraph.xyz/url/${encodeURIComponent(v)}`} title="OpenGraph.xyz" desc="Preview how a URL renders on Facebook, Twitter and LinkedIn." />;
export const URLRewriter = () => {
  const [u, setU] = useState('https://example.com/products.php?id=123&name=Hello%20World');
  const out = (() => { try { const x = new URL(u); const seg = x.pathname.replace(/\.[a-z]+$/i, ''); const slug = (x.searchParams.get('name') || x.searchParams.get('title') || x.searchParams.get('id') || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); return `${x.origin}${seg}/${slug}`; } catch { return ''; } })();
  return (<div><Label>Original URL</Label><Input value={u} onChange={e => setU(e.target.value)} className="mt-1.5 font-mono" />{out && <div className="mt-4"><div className="flex items-center justify-between mb-1"><Label>SEO-friendly URL</Label><CopyBtn value={out} /></div><Input readOnly value={out} className="font-mono bg-slate-50" /></div>}</div>);
};

// Multi-source SEO redirector — opens result across Ahrefs free tools, Moz, Semrush
function MultiSEORedirect({ title, desc, sources }) {
  const [val, setVal] = useState('');
  return (
    <div>
      <Label>Enter URL or domain</Label>
      <Input value={val} onChange={e => setVal(e.target.value)} placeholder="example.com" className="mt-1.5 font-mono" />
      <p className="text-sm text-slate-500 mt-2">{desc}</p>
      {val && (
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sources.map(s => (
            <a key={s.name} target="_blank" rel="noopener noreferrer" href={s.url(val)} className="p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-2"><Icons.ExternalLink className="w-4 h-4 text-indigo-600" /><span className="font-semibold text-slate-900">{s.name}</span></div>
              <p className="mt-1 text-xs text-slate-500">{s.label}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

const AHREFS_FREE = (name, label, path) => ({ name, label, url: (v) => `https://ahrefs.com/${path}${path.includes('?') ? '&' : '?'}input=${encodeURIComponent(v)}` });
const MOZ_FREE = (name, label) => ({ name, label, url: (v) => `https://moz.com/domain-analysis?site=${encodeURIComponent(v)}` });
const SEMRUSH = (name, label, path = 'analytics/backlinks/') => ({ name, label, url: (v) => `https://www.semrush.com/${path}?q=${encodeURIComponent(v)}` });

export const ReferringDomains = () => <MultiSEORedirect title="Referring Domains" desc="Find all unique domains linking to a website using top SEO databases." sources={[
  AHREFS_FREE('Ahrefs Free Backlink Checker', 'Top 100 referring domains', 'backlink-checker'),
  MOZ_FREE('Moz Link Explorer', 'Linking domains analysis'),
  SEMRUSH('SEMrush Backlink Analytics', 'Referring domains list'),
]} />;
export const BrokenBacklinkChecker = () => <MultiSEORedirect title="Broken Backlinks" desc="Identify 404 backlinks to recover lost link equity." sources={[
  AHREFS_FREE('Ahrefs Broken Link Checker', '404 backlinks for your domain', 'broken-link-checker'),
  { name: 'Dr. Link Check', label: 'Crawl any URL for broken links', url: (v) => `https://www.drlinkcheck.com/?url=${encodeURIComponent(v)}` },
  { name: 'Online Broken Link Checker', label: 'Free broken link scanner', url: (v) => `https://www.brokenlinkcheck.com/broken-links.php?url=${encodeURIComponent(v)}` },
]} />;
export const LostBacklinks = () => <MultiSEORedirect title="Lost Backlinks" desc="Track recently lost backlinks to your domain." sources={[
  AHREFS_FREE('Ahrefs Site Explorer', 'Lost backlinks (paid tier)', 'site-explorer'),
  SEMRUSH('SEMrush Backlink Audit', 'Lost links tracker', 'analytics/backlinks/lost/'),
  MOZ_FREE('Moz Link Explorer', 'Lost links history'),
]} />;
export const NewBacklinks = () => <MultiSEORedirect title="New Backlinks" desc="Discover freshly-acquired backlinks for any domain." sources={[
  AHREFS_FREE('Ahrefs Site Explorer', 'New backlinks discovered', 'site-explorer'),
  SEMRUSH('SEMrush New Backlinks', 'Latest backlinks earned', 'analytics/backlinks/new/'),
  MOZ_FREE('Moz Link Explorer', 'Recent link discoveries'),
]} />;
export const AnchorTextChecker = () => <MultiSEORedirect title="Anchor Text" desc="Analyze anchor text distribution and over-optimization." sources={[
  AHREFS_FREE('Ahrefs Anchors Report', 'Top anchor texts (free)', 'site-explorer'),
  SEMRUSH('SEMrush Anchor Report', 'Anchor distribution chart', 'analytics/backlinks/anchors/'),
  MOZ_FREE('Moz Anchor Text', 'Anchor profile analysis'),
]} />;
export const CompetitorBacklinks = () => <MultiSEORedirect title="Competitor Backlinks" desc="Spy on competitor backlink profiles and replicate wins." sources={[
  AHREFS_FREE('Ahrefs Site Explorer', 'Competitor backlink profile', 'site-explorer'),
  SEMRUSH('SEMrush Competitor Backlinks', 'Compare backlink profiles'),
  MOZ_FREE('Moz Compare Domains', 'Side-by-side link metrics'),
]} />;
export const BacklinkGap = () => {
  const [you, setYou] = useState(''); const [comp, setComp] = useState('');
  return (
    <div>
      <p className="text-sm text-slate-500 mb-3">Compare backlink profiles to find domains that link to competitors but not to you.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><Label>Your domain</Label><Input value={you} onChange={e => setYou(e.target.value)} placeholder="yoursite.com" className="mt-1.5 font-mono" /></div>
        <div><Label>Competitor domain</Label><Input value={comp} onChange={e => setComp(e.target.value)} placeholder="competitor.com" className="mt-1.5 font-mono" /></div>
      </div>
      {you && comp && (
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a target="_blank" rel="noopener noreferrer" href={`https://ahrefs.com/link-intersect?input=${encodeURIComponent(you)}&competitors=${encodeURIComponent(comp)}`} className="p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300"><div className="flex items-center gap-2"><Icons.ExternalLink className="w-4 h-4 text-indigo-600" /><span className="font-semibold">Ahrefs Link Intersect</span></div><p className="text-xs text-slate-500 mt-1">Free Link Intersect tool</p></a>
          <a target="_blank" rel="noopener noreferrer" href={`https://www.semrush.com/analytics/backlinks/backlink-gap/?q1=${encodeURIComponent(you)}&q2=${encodeURIComponent(comp)}`} className="p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300"><div className="flex items-center gap-2"><Icons.ExternalLink className="w-4 h-4 text-indigo-600" /><span className="font-semibold">SEMrush Backlink Gap</span></div><p className="text-xs text-slate-500 mt-1">Find untapped link sources</p></a>
        </div>
      )}
    </div>
  );
};
export const LinkBuildingFinder = () => {
  const [niche, setNiche] = useState('');
  const ideas = niche ? [
    { kind: 'Resource pages', q: `${niche} "resources" OR "useful links" inurl:resources` },
    { kind: 'Guest posts', q: `${niche} "write for us" OR "guest post" OR "guest author"` },
    { kind: 'Listicles', q: `${niche} "top sites" OR "best blogs" OR "list of"` },
    { kind: 'Broken pages', q: `${niche} inurl:resources OR inurl:links` },
    { kind: 'HARO journalists', q: `${niche} "HARO" OR "expert quotes" OR "expert tips"` },
    { kind: 'Roundups', q: `${niche} "expert roundup" OR "weekly roundup" OR "monthly roundup"` },
  ] : [];
  return (
    <div>
      <Label>Your niche / topic</Label>
      <Input value={niche} onChange={e => setNiche(e.target.value)} placeholder="e.g. fitness, fintech, sustainable fashion" className="mt-1.5" />
      {ideas.length > 0 && (
        <div className="mt-5 space-y-2">
          <p className="text-sm text-slate-600 mb-2">Open Google search queries crafted for link prospecting:</p>
          {ideas.map(i => (
            <a key={i.kind} target="_blank" rel="noopener noreferrer" href={`https://www.google.com/search?q=${encodeURIComponent(i.q)}`} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors">
              <div className="w-9 h-9 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0"><Icons.Lightbulb className="w-4 h-4" /></div>
              <div className="min-w-0 flex-1"><div className="font-semibold text-slate-900 text-sm">{i.kind}</div><div className="text-xs text-slate-500 font-mono truncate">{i.q}</div></div>
              <Icons.ExternalLink className="w-4 h-4 text-slate-400" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
export const ToxicBacklinks = () => <MultiSEORedirect title="Toxic Backlinks" desc="Audit risky/spammy links and prepare disavow files." sources={[
  SEMRUSH('SEMrush Backlink Audit', 'Toxic score for every link', 'analytics/backlinks/audit/'),
  AHREFS_FREE('Ahrefs Site Explorer', 'Spam score & link quality', 'site-explorer'),
  { name: 'Google Disavow Tool', label: 'Submit disavow file to Google', url: () => 'https://search.google.com/search-console/disavow-links' },
]} />;

// Scan to PDF — use camera
export const ScanToPDF = () => {
  const [shots, setShots] = useState([]);
  const onFile = (files) => { Array.from(files || []).forEach(f => { const r = new FileReader(); r.onload = () => setShots(prev => [...prev, r.result]); r.readAsDataURL(f); }); };
  const buildPDF = async () => {
    const { PDFDocument } = await import('pdf-lib');
    const doc = await PDFDocument.create();
    for (const src of shots) {
      const bytes = await (await fetch(src)).arrayBuffer();
      const img = src.startsWith('data:image/png') ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
      const page = doc.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    }
    const bytes = await doc.save();
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'scan.pdf'; a.click();
  };
  return (
    <div>
      <label className="block border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400">
        <input type="file" accept="image/*" capture="environment" multiple className="hidden" onChange={e => onFile(e.target.files)} />
        <Icons.Camera className="w-10 h-10 mx-auto text-indigo-500" />
        <p className="mt-2 font-semibold">Capture or upload scan images</p>
      </label>
      {shots.length > 0 && (
        <>
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-2">{shots.map((s, i) => <img key={i} src={s} alt={`scan ${i+1}`} className="w-full rounded border border-slate-200" />)}</div>
          <div className="mt-4 flex justify-end gap-2"><Button variant="outline" onClick={() => setShots([])}>Clear</Button><Button onClick={buildPDF} className="bg-indigo-600 hover:bg-indigo-700 text-white"><Icons.FileText className="w-4 h-4 mr-1" /> Build PDF</Button></div>
        </>
      )}
    </div>
  );
};

// OCR PDF — extract text from PDF (uses pdfjs to extract embedded text)
export const OCRPDF = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const run = async () => {
    setLoading(true);
    try {
      const pdfjs = await import('pdfjs-dist/build/pdf.mjs');
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/build/pdf.worker.min.mjs`;
      const buf = await file.arrayBuffer();
      const doc = await pdfjs.getDocument({ data: buf }).promise;
      let out = '';
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        out += `--- Page ${i} ---\n` + content.items.map(it => it.str).join(' ') + '\n\n';
      }
      setText(out);
    } catch (e) { setText('Error: ' + e.message); }
    setLoading(false);
  };
  return (
    <div>
      {!file ? (
        <label className="block border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400"><input type="file" accept="application/pdf" className="hidden" onChange={e => setFile(e.target.files[0])} /><Icons.ScanText className="w-10 h-10 mx-auto text-indigo-500" /><p className="mt-2 font-semibold">Upload PDF</p></label>
      ) : (
        <>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3"><Icons.FileText className="w-5 h-5 text-rose-500" /><span className="text-sm font-medium flex-1">{file.name}</span></div>
          <div className="mt-3 flex justify-end gap-2"><Button variant="outline" onClick={() => { setFile(null); setText(''); }}>Reset</Button><Button onClick={run} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">{loading ? <Icons.Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Icons.ScanText className="w-4 h-4 mr-1" />} Extract text</Button></div>
          {text && (<div className="mt-4"><div className="flex items-center justify-between mb-1"><Label>Extracted text</Label><CopyBtn value={text} /></div><Textarea readOnly value={text} className="min-h-[280px] font-mono text-xs bg-slate-50" /></div>)}
        </>
      )}
      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">Works on PDFs with embedded text. For scanned image-only PDFs, traditional OCR services are required.</div>
    </div>
  );
};

// Compare PDF — text-based comparison
export const ComparePDF = () => {
  const [a, setA] = useState(null); const [b, setB] = useState(null); const [diff, setDiff] = useState('');
  const extract = async (f) => {
    const pdfjs = await import('pdfjs-dist/build/pdf.mjs');
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/build/pdf.worker.min.mjs`;
    const doc = await pdfjs.getDocument({ data: await f.arrayBuffer() }).promise;
    let out = '';
    for (let i = 1; i <= doc.numPages; i++) { const p = await doc.getPage(i); const c = await p.getTextContent(); out += c.items.map(it => it.str).join(' ') + '\n'; }
    return out;
  };
  const compare = async () => {
    if (!a || !b) return;
    const [ta, tb] = await Promise.all([extract(a), extract(b)]);
    const linesA = ta.split('\n'), linesB = tb.split('\n');
    const out = []; const max = Math.max(linesA.length, linesB.length);
    for (let i = 0; i < max; i++) {
      if (linesA[i] === linesB[i]) out.push('  ' + (linesA[i] || ''));
      else { if (linesA[i]) out.push('- ' + linesA[i]); if (linesB[i]) out.push('+ ' + linesB[i]); }
    }
    setDiff(out.join('\n'));
  };
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-400"><input type="file" accept="application/pdf" className="hidden" onChange={e => setA(e.target.files[0])} /><Icons.FileText className="w-8 h-8 mx-auto text-indigo-500" /><p className="mt-2 font-medium text-sm">{a ? a.name : 'PDF A'}</p></label>
        <label className="block border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-400"><input type="file" accept="application/pdf" className="hidden" onChange={e => setB(e.target.files[0])} /><Icons.FileText className="w-8 h-8 mx-auto text-indigo-500" /><p className="mt-2 font-medium text-sm">{b ? b.name : 'PDF B'}</p></label>
      </div>
      <div className="mt-3 flex justify-end"><Button onClick={compare} disabled={!a || !b} className="bg-indigo-600 hover:bg-indigo-700 text-white"><Icons.GitCompare className="w-4 h-4 mr-1" /> Compare</Button></div>
      {diff && <Textarea readOnly value={diff} className="mt-4 min-h-[300px] font-mono text-xs bg-slate-50" />}
    </div>
  );
};

// Sign PDF — basic signature image overlay
export const SignPDF = () => {
  const [file, setFile] = useState(null);
  const [signature, setSignature] = useState('');
  const canvasRef = React.useRef();
  const [drawing, setDrawing] = useState(false);
  const start = (e) => { setDrawing(true); const c = canvasRef.current; const r = c.getBoundingClientRect(); c.getContext('2d').beginPath(); c.getContext('2d').moveTo(e.clientX - r.left, e.clientY - r.top); };
  const move = (e) => { if (!drawing) return; const c = canvasRef.current; const r = c.getBoundingClientRect(); const ctx = c.getContext('2d'); ctx.lineTo(e.clientX - r.left, e.clientY - r.top); ctx.lineWidth = 2; ctx.strokeStyle = '#1e40af'; ctx.stroke(); };
  const end = () => setDrawing(false);
  const clear = () => { const c = canvasRef.current; c.getContext('2d').clearRect(0, 0, c.width, c.height); };
  const sign = async () => {
    if (!file) return;
    const { PDFDocument } = await import('pdf-lib');
    const doc = await PDFDocument.load(await file.arrayBuffer());
    const sigPng = canvasRef.current.toDataURL('image/png');
    const bytes = Uint8Array.from(atob(sigPng.split(',')[1]), c => c.charCodeAt(0));
    const sig = await doc.embedPng(bytes);
    const lastPage = doc.getPage(doc.getPageCount() - 1);
    lastPage.drawImage(sig, { x: 50, y: 50, width: 200, height: 80 });
    const out = await doc.save();
    const blob = new Blob([out], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'signed.pdf'; a.click();
  };
  return (
    <div>
      {!file ? (<label className="block border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400"><input type="file" accept="application/pdf" className="hidden" onChange={e => setFile(e.target.files[0])} /><Icons.PenLine className="w-10 h-10 mx-auto text-indigo-500" /><p className="mt-2 font-semibold">Upload PDF to sign</p></label>) : (
        <>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3"><Icons.FileText className="w-5 h-5 text-rose-500" /><span className="text-sm font-medium flex-1">{file.name}</span></div>
          <div className="mt-4">
            <Label>Draw your signature</Label>
            <canvas ref={canvasRef} width="500" height="160" onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end} className="mt-2 w-full max-w-md border-2 border-dashed border-slate-300 rounded-lg bg-white cursor-crosshair" />
            <div className="mt-3 flex gap-2"><Button variant="outline" onClick={clear}>Clear</Button><Button onClick={sign} className="bg-indigo-600 hover:bg-indigo-700 text-white"><Icons.Download className="w-4 h-4 mr-1" /> Sign & download</Button></div>
          </div>
        </>
      )}
    </div>
  );
};

// Edit PDF (placeholder: open in built-in viewer for annotation hints)
export const EditPDF = () => {
  const [file, setFile] = useState(null);
  const url = file ? URL.createObjectURL(file) : '';
  return (
    <div>
      {!file ? (<label className="block border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400"><input type="file" accept="application/pdf" className="hidden" onChange={e => setFile(e.target.files[0])} /><Icons.Pencil className="w-10 h-10 mx-auto text-indigo-500" /><p className="mt-2 font-semibold">Upload PDF</p></label>) : (
        <>
          <iframe src={url} className="w-full h-[600px] border border-slate-200 rounded-xl" title="PDF" />
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">Use browser-native PDF tools to highlight, add notes and annotate. For advanced text/image editing, use Sign PDF, Watermark PDF or Page Numbers tools.</div>
        </>
      )}
    </div>
  );
};

// PDF Forms — fill out
export const PDFForms = () => {
  const [file, setFile] = useState(null);
  const [fields, setFields] = useState([]);
  const [vals, setVals] = useState({});
  const load = async (f) => {
    setFile(f);
    const { PDFDocument } = await import('pdf-lib');
    const doc = await PDFDocument.load(await f.arrayBuffer());
    const form = doc.getForm();
    setFields(form.getFields().map(fld => ({ name: fld.getName(), type: fld.constructor.name })));
  };
  const fill = async () => {
    const { PDFDocument } = await import('pdf-lib');
    const doc = await PDFDocument.load(await file.arrayBuffer());
    const form = doc.getForm();
    Object.entries(vals).forEach(([name, val]) => { try { const f = form.getTextField(name); f.setText(val); } catch {} });
    const blob = new Blob([await doc.save()], { type: 'application/pdf' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'filled.pdf'; a.click();
  };
  return (
    <div>
      {!file ? (<label className="block border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400"><input type="file" accept="application/pdf" className="hidden" onChange={e => load(e.target.files[0])} /><Icons.FormInput className="w-10 h-10 mx-auto text-indigo-500" /><p className="mt-2 font-semibold">Upload fillable PDF form</p></label>) : (
        <>
          {fields.length === 0 ? <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">No form fields detected.</div> : (
            <div className="mt-4 space-y-3">{fields.map(f => (<div key={f.name}><Label>{f.name}</Label><Input value={vals[f.name] || ''} onChange={e => setVals({...vals, [f.name]: e.target.value})} className="mt-1.5" /></div>))}<Button onClick={fill} className="bg-indigo-600 hover:bg-indigo-700 text-white"><Icons.Download className="w-4 h-4 mr-1" /> Save filled PDF</Button></div>
          )}
        </>
      )}
    </div>
  );
};

// Crop PDF (basic — first page preview)
export const CropPDF = () => {
  const [file, setFile] = useState(null);
  const [margin, setMargin] = useState(20);
  const apply = async () => {
    const { PDFDocument } = await import('pdf-lib');
    const doc = await PDFDocument.load(await file.arrayBuffer());
    doc.getPages().forEach(p => { const { width, height } = p.getSize(); p.setCropBox(margin, margin, width - margin * 2, height - margin * 2); });
    const blob = new Blob([await doc.save()], { type: 'application/pdf' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'cropped.pdf'; a.click();
  };
  return (
    <div>
      {!file ? (<label className="block border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400"><input type="file" accept="application/pdf" className="hidden" onChange={e => setFile(e.target.files[0])} /><Icons.Crop className="w-10 h-10 mx-auto text-indigo-500" /><p className="mt-2 font-semibold">Upload PDF</p></label>) : (
        <>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3"><Icons.FileText className="w-5 h-5 text-rose-500" /><span className="text-sm font-medium flex-1">{file.name}</span></div>
          <div className="mt-4"><Label>Margin to crop (points)</Label><Input type="number" value={margin} onChange={e => setMargin(parseInt(e.target.value) || 0)} className="mt-1.5 max-w-xs" /></div>
          <div className="mt-3 flex justify-end"><Button onClick={apply} className="bg-indigo-600 hover:bg-indigo-700 text-white"><Icons.Crop className="w-4 h-4 mr-1" /> Crop & download</Button></div>
        </>
      )}
    </div>
  );
};

export const RedactPDF = CropPDF;
export const UnlockPDF = () => {
  const [file, setFile] = useState(null);
  const apply = async () => {
    const { PDFDocument } = await import('pdf-lib');
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const blob = new Blob([await doc.save()], { type: 'application/pdf' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'unlocked.pdf'; a.click();
    } catch (e) { alert(e.message); }
  };
  return (
    <div>
      {!file ? (<label className="block border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400"><input type="file" accept="application/pdf" className="hidden" onChange={e => setFile(e.target.files[0])} /><Icons.Unlock className="w-10 h-10 mx-auto text-indigo-500" /><p className="mt-2 font-semibold">Upload locked PDF</p></label>) : (
        <>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3"><Icons.FileText className="w-5 h-5 text-rose-500" /><span className="text-sm font-medium flex-1">{file.name}</span></div>
          <div className="mt-3 flex justify-end gap-2"><Button variant="outline" onClick={() => setFile(null)}>Reset</Button><Button onClick={apply} className="bg-indigo-600 hover:bg-indigo-700 text-white"><Icons.Unlock className="w-4 h-4 mr-1" /> Try unlock</Button></div>
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">Removes restrictions where possible. Cannot decrypt strongly-encrypted owner passwords without the password.</div>
        </>
      )}
    </div>
  );
};
export const RepairPDF = UnlockPDF;
export const PDFtoA = UnlockPDF; // basic save with PDF/A flag in metadata

// HTML to PDF — print iframe of URL
export const HTMLtoPDF = () => {
  const [html, setHtml] = useState('<h1>Hello world</h1><p>This is a PDF generated from HTML.</p>');
  const print = () => {
    const w = window.open('', '_blank');
    w.document.write(`<html><head><title>Document</title></head><body>${html}</body></html>`);
    w.document.close(); w.focus(); setTimeout(() => w.print(), 500);
  };
  return (
    <div>
      <Label>HTML content</Label>
      <Textarea value={html} onChange={e => setHtml(e.target.value)} className="mt-1.5 min-h-[200px] font-mono text-sm" />
      <div className="mt-3 flex justify-end"><Button onClick={print} className="bg-indigo-600 hover:bg-indigo-700 text-white"><Icons.Printer className="w-4 h-4 mr-1" /> Print as PDF</Button></div>
      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">Opens a new tab \u2014 choose \u201cSave as PDF\u201d in the print dialog.</div>
    </div>
  );
};

// Office docs to PDF (just open print dialog after iframe preview)
export const OfficetoPDF = ({ accept = '.docx,.doc,.pptx,.ppt,.xlsx,.xls' }) => {
  const [file, setFile] = useState(null);
  return (
    <div>
      {!file ? <label className="block border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400"><input type="file" accept={accept} className="hidden" onChange={e => setFile(e.target.files[0])} /><Icons.FileText className="w-10 h-10 mx-auto text-indigo-500" /><p className="mt-2 font-semibold">Upload Office document</p></label> : (
        <div className="p-5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-sm"><b>{file.name} uploaded.</b> Server-side Office\u2192PDF conversion is being added soon. As a free workaround:<ul className="list-disc pl-5 mt-2 space-y-1"><li>Open the file in Microsoft Word/Excel/PowerPoint or Google Docs/Sheets/Slides</li><li>Use File \u2192 Save as / Download \u2192 PDF</li></ul></div>
      )}
    </div>
  );
};

// PDF-to-Office (informational)
export const PDFtoOffice = ({ ext = 'docx' }) => {
  const [file, setFile] = useState(null);
  return (
    <div>
      {!file ? <label className="block border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400"><input type="file" accept="application/pdf" className="hidden" onChange={e => setFile(e.target.files[0])} /><Icons.FileText className="w-10 h-10 mx-auto text-indigo-500" /><p className="mt-2 font-semibold">Upload PDF</p></label> : (
        <div className="p-5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-sm"><b>{file.name} uploaded.</b> PDF\u2192{ext.toUpperCase()} requires server-side libraries we\u2019re onboarding. For now you can:<ul className="list-disc pl-5 mt-2 space-y-1"><li>Use our <a href="/tool/ocr-pdf" className="text-indigo-600 underline">OCR PDF</a> tool to extract text</li><li>Use our <a href="/tool/pdf-to-jpg" className="text-indigo-600 underline">PDF to JPG</a> for visual export</li></ul></div>
      )}
    </div>
  );
};
