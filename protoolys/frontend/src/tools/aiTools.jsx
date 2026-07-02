import React, { useState } from 'react';
import { Input, Button, Label, Textarea, Icons, CopyBtn } from './_common';
import { api } from '../lib/api';

function AIBox({ endpoint, placeholder, extraLabel, extraDefault, extraOptions, btn = 'Run AI' }) {
  const [text, setText] = useState('');
  const [extra, setExtra] = useState(extraDefault || '');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const run = async () => {
    if (!text.trim()) return;
    setLoading(true); setErr(''); setResult('');
    try {
      const r = await api.post(endpoint, { text, extra });
      setResult(r.data.result || '');
    } catch (e) {
      setErr(e.response?.data?.detail || 'Failed to call AI');
    }
    setLoading(false);
  };
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Input text</Label>
          <Textarea value={text} onChange={e => setText(e.target.value)} placeholder={placeholder || 'Type or paste your content here...'} className="mt-1.5 min-h-[260px]" />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label>AI output</Label>
            {result && <CopyBtn value={result} />}
          </div>
          <Textarea value={result} readOnly placeholder="Result will appear here..." className="mt-1.5 min-h-[260px] bg-slate-50" />
        </div>
      </div>
      {extraLabel && (
        <div className="mt-4 flex items-center gap-3">
          <Label className="whitespace-nowrap">{extraLabel}</Label>
          {extraOptions ? (
            <select value={extra} onChange={e => setExtra(e.target.value)} className="h-10 w-full sm:w-48 border border-slate-200 rounded-md px-3 text-sm bg-white">
              {extraOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : (
            <Input value={extra} onChange={e => setExtra(e.target.value)} className="flex-1" />
          )}
        </div>
      )}
      {err && <div className="mt-3 p-3 rounded bg-rose-50 text-rose-700 border border-rose-200 text-sm">{err}</div>}
      <div className="mt-4 flex justify-end">
        <Button onClick={run} disabled={loading || !text.trim()} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          {loading ? <Icons.Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Icons.Sparkles className="w-4 h-4 mr-1" />} {btn}
        </Button>
      </div>
    </div>
  );
}

export const AISummarizer = () => <AIBox endpoint="/ai/summarize" placeholder="Paste an article, report or essay to summarize..." btn="Summarize" />;
export const AIParaphrase = () => <AIBox endpoint="/ai/paraphrase" placeholder="Paste sentences or paragraphs to paraphrase..." extraLabel="Style" extraDefault="natural" extraOptions={['natural','formal','simple','academic','creative']} btn="Paraphrase" />;
export const AITranslate = () => <AIBox endpoint="/ai/translate" placeholder="Paste text to translate..." extraLabel="Target language" extraDefault="Spanish" extraOptions={['Spanish','French','German','Italian','Portuguese','Arabic','Chinese','Japanese','Korean','Russian','Hindi','Turkish','Dutch','Polish']} btn="Translate" />;
export const AIGenerate = () => <AIBox endpoint="/ai/generate" placeholder="Describe what you want written (e.g. blog post about sustainable fashion)..." extraLabel="Style/details" extraDefault="professional, informative, 300 words" btn="Generate" />;
export const AIGrammar = () => <AIBox endpoint="/ai/grammar" placeholder="Paste text to proofread..." btn="Fix grammar" />;
export const AIHumanizer = () => <AIBox endpoint="/ai/humanize" placeholder="Paste AI-generated text to humanize..." btn="Humanize" />;
export const AIRewriter = () => <AIBox endpoint="/ai/rewrite" placeholder="Paste an article to rewrite..." btn="Rewrite" />;
export const AICitation = () => <AIBox endpoint="/ai/citation" placeholder="Paste a URL, book title or article details..." extraLabel="Citation style" extraDefault="APA" extraOptions={['APA','MLA','Chicago','Harvard','IEEE','Vancouver']} btn="Generate citation" />;
export const AIDetector = () => <AIBox endpoint="/ai/detect" placeholder="Paste text to analyze for AI-generated content..." btn="Detect AI" />;

// Reverse image search — direct integration with Google Lens / TinEye
export const ReverseImageSearch = () => {
  const [url, setUrl] = useState('');
  return (
    <div>
      <Label>Image URL</Label>
      <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/image.jpg" className="mt-1.5" />
      {url && (
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a target="_blank" rel="noopener noreferrer" href={`https://lens.google.com/uploadbyurl?url=${encodeURIComponent(url)}`} className="p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 text-center"><Icons.Search className="w-6 h-6 mx-auto text-indigo-600" /><div className="mt-2 font-semibold text-slate-900">Google Lens</div></a>
          <a target="_blank" rel="noopener noreferrer" href={`https://tineye.com/search?url=${encodeURIComponent(url)}`} className="p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 text-center"><Icons.Search className="w-6 h-6 mx-auto text-indigo-600" /><div className="mt-2 font-semibold text-slate-900">TinEye</div></a>
          <a target="_blank" rel="noopener noreferrer" href={`https://yandex.com/images/search?rpt=imageview&url=${encodeURIComponent(url)}`} className="p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 text-center"><Icons.Search className="w-6 h-6 mx-auto text-indigo-600" /><div className="mt-2 font-semibold text-slate-900">Yandex</div></a>
        </div>
      )}
      <div className="mt-4 text-xs text-slate-500">Click any engine above to open the search results in a new tab.</div>
    </div>
  );
};

// Plagiarism — basic heuristic + suggest external engines
export const PlagiarismChecker = () => {
  const [text, setText] = useState('');
  const [phrases, setPhrases] = useState([]);
  const scan = () => {
    if (!text.trim()) return;
    const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.split(/\s+/).length >= 6);
    setPhrases(sentences.slice(0, 5));
  };
  return (
    <div>
      <Textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste content to scan..." className="min-h-[200px]" />
      <div className="mt-3 flex justify-end"><Button onClick={scan} className="bg-indigo-600 hover:bg-indigo-700 text-white"><Icons.SearchCheck className="w-4 h-4 mr-1" /> Generate test queries</Button></div>
      {phrases.length > 0 && (
        <div className="mt-5">
          <div className="text-sm text-slate-600 mb-2">Click any phrase to search Google for matches:</div>
          <div className="space-y-2">{phrases.map((p, i) => <a key={i} target="_blank" rel="noopener noreferrer" href={`https://www.google.com/search?q=${encodeURIComponent('"' + p + '"')}`} className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-indigo-300"><Icons.ExternalLink className="w-4 h-4 text-indigo-600 shrink-0" /><span className="text-sm text-slate-700 line-clamp-1">"{p}"</span></a>)}</div>
        </div>
      )}
    </div>
  );
};
