import React, { useState } from 'react';
import { TwoPaneText, Input, Button, Label, Textarea, Icons, CopyBtn } from './_common';

// JSON tools
export const JSONFormatterTool = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [err, setErr] = useState('');
  const fmt = (indent) => { try { setOutput(JSON.stringify(JSON.parse(input), null, indent)); setErr(''); } catch(e){ setErr(e.message); setOutput(''); } };
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label>JSON input</Label><Textarea value={input} onChange={e=>setInput(e.target.value)} placeholder='{"key":"value"}' className="mt-1.5 min-h-[260px] font-mono text-sm" /></div>
        <div><div className="flex items-center justify-between"><Label>Formatted</Label><CopyBtn value={output} /></div><Textarea value={output} readOnly className="mt-1.5 min-h-[260px] font-mono text-sm bg-slate-50" /></div>
      </div>
      {err && <div className="mt-3 p-3 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-sm">{err}</div>}
      <div className="mt-4 flex gap-2 flex-wrap"><Button onClick={()=>fmt(2)} className="bg-indigo-600 hover:bg-indigo-700">Format (2 spaces)</Button><Button variant="outline" onClick={()=>fmt(4)}>Format (4 spaces)</Button><Button variant="outline" onClick={()=>fmt(0)}>Minify</Button></div>
    </div>
  );
};
export const JSONMinifyTool = () => {
  const [input, setInput] = useState(''); const [output, setOutput] = useState(''); const [err, setErr] = useState('');
  const go = () => { try { setOutput(JSON.stringify(JSON.parse(input))); setErr(''); } catch(e){ setErr(e.message); }};
  return <div>{err && <div className="mb-3 p-3 rounded bg-rose-50 text-rose-700 text-sm">{err}</div>}<TwoPaneText input={input} setInput={setInput} output={output} outputLabel="Minified" actions={<Button onClick={go} className="bg-indigo-600 hover:bg-indigo-700">Minify</Button>} /></div>;
};
export const JSONValidatorTool = () => {
  const [input, setInput] = useState(''); const [res, setRes] = useState(null);
  React.useEffect(()=>{ if(!input.trim()){ setRes(null); return; } try{ JSON.parse(input); setRes({ok:true}); } catch(e){ setRes({ok:false, err:e.message}); }}, [input]);
  return <div><Label>JSON</Label><Textarea value={input} onChange={e=>setInput(e.target.value)} className="mt-1.5 min-h-[260px] font-mono text-sm" />{res && <div className={`mt-3 p-3 rounded-lg border text-sm ${res.ok?'bg-emerald-50 text-emerald-700 border-emerald-200':'bg-rose-50 text-rose-700 border-rose-200'}`}>{res.ok?'✓ Valid JSON':`✗ ${res.err}`}</div>}</div>;
};
export const JSONToCSVTool = () => {
  const [input, setInput] = useState('[{"name":"Ada","age":30},{"name":"Bob","age":25}]'); const [output, setOutput] = useState(''); const [err, setErr] = useState('');
  const go = () => { try { const a = JSON.parse(input); if (!Array.isArray(a)) throw new Error('Expected array'); const keys=[...new Set(a.flatMap(o=>Object.keys(o)))]; const rows=[keys.join(','), ...a.map(o=>keys.map(k=>JSON.stringify(o[k]??'')).join(','))]; setOutput(rows.join('\n')); setErr('');} catch(e){ setErr(e.message); }};
  return <div>{err && <div className="mb-3 p-3 rounded bg-rose-50 text-rose-700 text-sm">{err}</div>}<TwoPaneText input={input} setInput={setInput} output={output} outputLabel="CSV" actions={<Button onClick={go} className="bg-indigo-600 hover:bg-indigo-700">Convert</Button>} /></div>;
};
export const CSVToJSONTool = () => {
  const [input, setInput] = useState('name,age\nAda,30\nBob,25'); const [output, setOutput] = useState('');
  const go = () => { const lines=input.trim().split(/\n+/); const head=lines[0].split(','); const out=lines.slice(1).map(l=>{const c=l.split(','); const o={}; head.forEach((h,i)=>o[h.trim()]=c[i]?.trim()); return o;}); setOutput(JSON.stringify(out, null, 2)); };
  return <TwoPaneText input={input} setInput={setInput} output={output} outputLabel="JSON" actions={<Button onClick={go} className="bg-indigo-600 hover:bg-indigo-700">Convert</Button>} />;
};
export const JSONToXMLTool = () => {
  const [input, setInput] = useState('{"user":{"name":"Ada","age":30}}'); const [output, setOutput] = useState('');
  const j2x = (obj, k='root') => { if (obj===null||obj===undefined) return `<${k}/>`; if (typeof obj!=='object') return `<${k}>${obj}</${k}>`; if (Array.isArray(obj)) return obj.map(v=>j2x(v,k)).join(''); const inner=Object.entries(obj).map(([kk,v])=>j2x(v,kk)).join(''); return `<${k}>${inner}</${k}>`; };
  const go = () => { try{ setOutput(j2x(JSON.parse(input)));}catch(e){setOutput(e.message);}};
  return <TwoPaneText input={input} setInput={setInput} output={output} outputLabel="XML" actions={<Button onClick={go} className="bg-indigo-600 hover:bg-indigo-700">Convert</Button>} />;
};
export const XMLToJSONTool = () => {
  const [input, setInput] = useState('<root><name>Ada</name></root>'); const [output, setOutput] = useState('');
  const x2j = (node) => { const o={}; for (const c of node.children){ const val = c.children.length ? x2j(c) : c.textContent; if (o[c.tagName]){ o[c.tagName]=[].concat(o[c.tagName], val);} else o[c.tagName]=val; } return o; };
  const go = () => { try{ const d=new DOMParser().parseFromString(input,'text/xml'); setOutput(JSON.stringify({[d.documentElement.tagName]:x2j(d.documentElement)}, null, 2));}catch(e){setOutput(e.message);}};
  return <TwoPaneText input={input} setInput={setInput} output={output} outputLabel="JSON" actions={<Button onClick={go} className="bg-indigo-600 hover:bg-indigo-700">Convert</Button>} />;
};
export const TSVToJSONTool = () => { const [input, setInput] = useState('name\tage\nAda\t30'); const [output, setOutput] = useState(''); const go = () => { const lines=input.trim().split(/\n+/); const head=lines[0].split('\t'); const out=lines.slice(1).map(l=>{const c=l.split('\t'); const o={}; head.forEach((h,i)=>o[h.trim()]=c[i]?.trim()); return o;}); setOutput(JSON.stringify(out, null, 2)); }; return <TwoPaneText input={input} setInput={setInput} output={output} outputLabel="JSON" actions={<Button onClick={go} className="bg-indigo-600 hover:bg-indigo-700">Convert</Button>} />; };
export const JSONToTSVTool = () => { const [input, setInput] = useState(''); const [output, setOutput] = useState(''); const go = () => { try{ const a=JSON.parse(input); const keys=[...new Set(a.flatMap(o=>Object.keys(o)))]; const rows=[keys.join('\t'), ...a.map(o=>keys.map(k=>String(o[k]??'')).join('\t'))]; setOutput(rows.join('\n')); }catch(e){setOutput(e.message);}}; return <TwoPaneText input={input} setInput={setInput} output={output} outputLabel="TSV" actions={<Button onClick={go} className="bg-indigo-600 hover:bg-indigo-700">Convert</Button>} />; };
export const JSONToTextTool = () => { const [input, setInput] = useState(''); const [output, setOutput] = useState(''); const flat = (o, p='') => { let r=''; for(const k in o){ const key=p?`${p}.${k}`:k; if(typeof o[k]==='object'&&o[k]!==null) r+=flat(o[k], key); else r+=`${key}: ${o[k]}\n`; } return r; }; const go = () => { try{ setOutput(flat(JSON.parse(input)));}catch(e){setOutput(e.message);}}; return <TwoPaneText input={input} setInput={setInput} output={output} outputLabel="Text" actions={<Button onClick={go} className="bg-indigo-600 hover:bg-indigo-700">Convert</Button>} />; };
export const JSONToSchemaTool = () => { const [input, setInput] = useState(''); const [output, setOutput] = useState(''); const inferSchema = (v) => { if (Array.isArray(v)) return {type:'array', items: v.length ? inferSchema(v[0]) : {}}; if (v===null) return {type:'null'}; if (typeof v==='object') return {type:'object', properties: Object.fromEntries(Object.entries(v).map(([k,vv])=>[k, inferSchema(vv)]))}; return {type: typeof v}; }; const go = () => { try{ setOutput(JSON.stringify({$schema:'http://json-schema.org/draft-07/schema#', ...inferSchema(JSON.parse(input))}, null, 2));}catch(e){setOutput(e.message);}}; return <TwoPaneText input={input} setInput={setInput} output={output} outputLabel="Schema" actions={<Button onClick={go} className="bg-indigo-600 hover:bg-indigo-700">Generate</Button>} />; };

// Code tools
export const HTMLEncodeTool = () => { const [input, setInput] = useState(''); const output = input.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); return <TwoPaneText input={input} setInput={setInput} output={output} outputLabel="Encoded" />; };
export const HTMLDecodeTool = () => { const [input, setInput] = useState(''); const ta = typeof document !== 'undefined' ? document.createElement('textarea') : null; let output=''; if (ta){ ta.innerHTML = input; output = ta.value; } return <TwoPaneText input={input} setInput={setInput} output={output} outputLabel="Decoded" />; };
export const URLEncodeTool = () => { const [input, setInput] = useState(''); let output=''; try { output = encodeURIComponent(input); } catch(e) {} return <TwoPaneText input={input} setInput={setInput} output={output} outputLabel="Encoded" />; };
export const URLDecodeTool = () => { const [input, setInput] = useState(''); let output=''; try { output = decodeURIComponent(input); } catch(e) { output = 'Invalid URL encoding'; } return <TwoPaneText input={input} setInput={setInput} output={output} outputLabel="Decoded" />; };
export const HTMLBeautifyTool = () => { const [input, setInput] = useState(''); const beautify = (s) => { let i=0,o=''; s=s.replace(/>\s*</g,'><'); for (const part of s.split(/(<\/?[^>]+>)/g)){ if (!part) continue; if (part.startsWith('</')){ i=Math.max(0,i-1); o+='  '.repeat(i)+part+'\n'; } else if (part.startsWith('<') && !part.endsWith('/>') && !/^<(br|img|input|hr|meta|link)/.test(part)){ o+='  '.repeat(i)+part+'\n'; i++; } else if (part.startsWith('<')) { o+='  '.repeat(i)+part+'\n'; } else if (part.trim()) o+='  '.repeat(i)+part.trim()+'\n'; } return o; }; return <TwoPaneText input={input} setInput={setInput} output={beautify(input)} outputLabel="Beautified" />; };
export const HTMLMinifyTool = () => { const [input, setInput] = useState(''); const output = input.replace(/<!--[\s\S]*?-->/g,'').replace(/>\s+</g,'><').replace(/\s{2,}/g,' ').trim(); return <TwoPaneText input={input} setInput={setInput} output={output} outputLabel="Minified" />; };
export const CSSBeautifyTool = () => { const [input, setInput] = useState(''); const output = input.replace(/\s*{\s*/g,' {\n  ').replace(/;\s*/g,';\n  ').replace(/\s*}\s*/g,'\n}\n').replace(/\n  \n/g,'\n').trim(); return <TwoPaneText input={input} setInput={setInput} output={output} outputLabel="Beautified" />; };
export const CSSMinifyTool = () => { const [input, setInput] = useState(''); const output = input.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s+/g,' ').replace(/\s*([{}:;,])\s*/g,'$1').replace(/;}/g,'}').trim(); return <TwoPaneText input={input} setInput={setInput} output={output} outputLabel="Minified" />; };
export const JSBeautifyTool = CSSBeautifyTool; // simple
export const JSMinifyTool = () => { const [input, setInput] = useState(''); const output = input.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\/\/.*$/gm,'').replace(/\s+/g,' ').replace(/\s*([{}();,:=<>!+\-*/])\s*/g,'$1').trim(); return <TwoPaneText input={input} setInput={setInput} output={output} outputLabel="Minified" />; };
export const JSObfuscateTool = () => { const [input, setInput] = useState(''); const output = input ? 'eval(atob("' + btoa(input) + '"))' : ''; return <TwoPaneText input={input} setInput={setInput} output={output} outputLabel="Obfuscated" />; };
export const JSDeObfuscateTool = () => { const [input, setInput] = useState(''); let output=''; const m = input.match(/atob\(["']([^"']+)["']\)/); if (m){ try { output = atob(m[1]); } catch(e){ output=e.message; }} return <TwoPaneText input={input} setInput={setInput} output={output} outputLabel="Decoded" />; };
export const URLParserTool = () => { const [input, setInput] = useState('https://example.com/path?a=1&b=2#hash'); let result=null, err=null; try { const u = new URL(input); result = { protocol: u.protocol, host: u.host, hostname: u.hostname, port: u.port||'(default)', pathname: u.pathname, search: u.search, hash: u.hash, params: Object.fromEntries(u.searchParams) }; } catch(e){ err = 'Invalid URL'; } return (<div><Label>URL</Label><Input value={input} onChange={e=>setInput(e.target.value)} className="mt-1.5 font-mono" />{err && <div className="mt-3 p-3 rounded bg-rose-50 text-rose-700 text-sm">{err}</div>}{result && <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 font-mono text-sm space-y-1">{Object.entries(result).map(([k,v]) => <div key={k}><span className="text-indigo-600 font-semibold">{k}:</span> <span className="text-slate-700">{typeof v==='object'?JSON.stringify(v):String(v)}</span></div>)}</div>}</div>); };
export const JSONViewerTool = JSONFormatterTool;
export const JSONEditorTool = JSONFormatterTool;
