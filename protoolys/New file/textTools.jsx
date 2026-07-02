import React, { useMemo, useState } from 'react';
import { TwoPaneText, Stat, Input, Button, Label, Textarea, Icons, CopyBtn } from './_common';

export const WordCounterTool = () => {
  const [text, setText] = useState('');
  const stats = useMemo(() => {
    const words = (text.trim().match(/\S+/g) || []).length;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const sentences = (text.match(/[^.!?\n]+[.!?]+/g) || []).length;
    const paragraphs = text.trim() ? text.trim().split(/\n+/).length : 0;
    const readMin = Math.max(1, Math.ceil(words / 200));
    return { words, chars, charsNoSpace, sentences, paragraphs, readMin };
  }, [text]);
  return (
    <div>
      <Textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste your text here..." className="min-h-[220px]" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5">
        <Stat label="Words" value={stats.words} />
        <Stat label="Characters" value={stats.chars} />
        <Stat label="No spaces" value={stats.charsNoSpace} />
        <Stat label="Sentences" value={stats.sentences} />
        <Stat label="Paragraphs" value={stats.paragraphs} />
        <Stat label="Reading (min)" value={stats.readMin} />
      </div>
    </div>
  );
};

export const CaseConverterTool = () => {
  const [text, setText] = useState('');
  const apply = (kind) => {
    let out = text;
    if (kind === 'upper') out = text.toUpperCase();
    else if (kind === 'lower') out = text.toLowerCase();
    else if (kind === 'title') out = text.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    else if (kind === 'sentence') out = text.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase());
    else if (kind === 'alt') out = text.split('').map((c,i) => i%2 ? c.toUpperCase() : c.toLowerCase()).join('');
    else if (kind === 'inverse') out = text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
    setText(out);
  };
  return (
    <div>
      <Textarea value={text} onChange={e => setText(e.target.value)} placeholder="Type or paste text..." className="min-h-[200px]" />
      <div className="mt-4 flex flex-wrap gap-2">
        {['upper','lower','title','sentence','alt','inverse'].map(k => (
          <Button key={k} variant="outline" onClick={() => apply(k)} className="capitalize">{k} case</Button>
        ))}
        <CopyBtn value={text} />
        <Button variant="ghost" onClick={() => setText('')}>Clear</Button>
      </div>
    </div>
  );
};

export const ReverseTextTool = () => {
  const [input, setInput] = useState('');
  const output = input.split('').reverse().join('');
  return <TwoPaneText input={input} setInput={setInput} output={output} outputLabel="Reversed" />;
};

export const TextToSlugTool = () => {
  const [input, setInput] = useState('');
  const output = input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
  return <TwoPaneText input={input} setInput={setInput} output={output} outputLabel="Slug" />;
};

export const RemoveLineBreaksTool = () => {
  const [input, setInput] = useState('');
  const output = input.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
  return <TwoPaneText input={input} setInput={setInput} output={output} outputLabel="Cleaned" />;
};

export const TextRepeaterTool = () => {
  const [input, setInput] = useState('');
  const [n, setN] = useState(5);
  const [sep, setSep] = useState('\n');
  const output = Array(Math.max(1, Math.min(1000, parseInt(n)||1))).fill(input).join(sep);
  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Repeat times</Label><Input type="number" value={n} onChange={e=>setN(e.target.value)} min="1" max="1000" className="mt-1" /></div>
        <div><Label>Separator</Label><Input value={sep === '\n' ? '\\n' : sep} onChange={e => setSep(e.target.value === '\\n' ? '\n' : e.target.value)} className="mt-1" /></div>
      </div>
      <div className="mt-3"><TwoPaneText input={input} setInput={setInput} output={output} outputLabel="Repeated" /></div>
    </div>
  );
};

export const TextSorterTool = () => {
  const [input, setInput] = useState('');
  const [order, setOrder] = useState('asc');
  const output = input.split('\n').sort((a,b) => order === 'asc' ? a.localeCompare(b) : b.localeCompare(a)).join('\n');
  return (
    <div>
      <div className="flex gap-2 mb-3">
        <Button variant={order==='asc'?'default':'outline'} className={order==='asc'?'bg-indigo-600 hover:bg-indigo-700':''} onClick={()=>setOrder('asc')}>A → Z</Button>
        <Button variant={order==='desc'?'default':'outline'} className={order==='desc'?'bg-indigo-600 hover:bg-indigo-700':''} onClick={()=>setOrder('desc')}>Z → A</Button>
      </div>
      <TwoPaneText input={input} setInput={setInput} output={output} outputLabel="Sorted" />
    </div>
  );
};

export const CommaSeparatorTool = () => {
  const [input, setInput] = useState('');
  const output = input.split(/\n+/).filter(Boolean).join(', ');
  return <TwoPaneText input={input} setInput={setInput} output={output} outputLabel="Comma separated" />;
};

export const TextToHashtagsTool = () => {
  const [input, setInput] = useState('');
  const output = input.split(/[\s,]+/).filter(Boolean).map(w => '#' + w.replace(/[^a-zA-Z0-9_]/g, '')).filter(h => h.length > 1).join(' ');
  return <TwoPaneText input={input} setInput={setInput} output={output} outputLabel="Hashtags" />;
};

export const TextCompareTool = () => {
  const [a, setA] = useState(''); const [b, setB] = useState('');
  const same = a === b && a.length > 0;
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label>Text A</Label><Textarea value={a} onChange={e=>setA(e.target.value)} className="mt-1.5 min-h-[200px] font-mono text-sm" /></div>
        <div><Label>Text B</Label><Textarea value={b} onChange={e=>setB(e.target.value)} className="mt-1.5 min-h-[200px] font-mono text-sm" /></div>
      </div>
      <div className={`mt-4 p-3 rounded-lg text-sm ${same?'bg-emerald-50 text-emerald-700 border border-emerald-200':'bg-rose-50 text-rose-700 border border-rose-200'}`}>{same ? '✓ Texts are identical' : '✗ Texts differ. A: ' + a.length + ' chars, B: ' + b.length + ' chars'}</div>
    </div>
  );
};

export const LoremIpsumTool = () => {
  const [count, setCount] = useState(3);
  const para = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';
  const output = Array(Math.max(1, Math.min(50, parseInt(count)||1))).fill(para).join('\n\n');
  return (
    <div>
      <div className="flex items-center gap-3 mb-3"><Label>Paragraphs</Label><Input type="number" value={count} onChange={e=>setCount(e.target.value)} min="1" max="50" className="w-24" /></div>
      <div className="flex items-center justify-between mb-1"><Label>Generated</Label><CopyBtn value={output} /></div>
      <Textarea value={output} readOnly className="min-h-[260px] font-mono text-sm bg-slate-50" />
    </div>
  );
};

export const RandomWordTool = () => {
  const words = ['atlas','breeze','cipher','dawn','echo','flux','glade','horizon','iris','jade','karma','lumen','mosaic','nova','onyx','prism','quartz','rune','sable','tide','umbra','vela','wisp','xeno','yara','zen'];
  const [n, setN] = useState(10);
  const [out, setOut] = useState('');
  const gen = () => setOut(Array(Math.max(1, Math.min(500, parseInt(n)||1))).fill(0).map(()=>words[Math.floor(Math.random()*words.length)]).join(', '));
  React.useEffect(gen, []); // initial
  return (
    <div>
      <div className="flex items-center gap-2 mb-3"><Label>Count</Label><Input type="number" value={n} onChange={e=>setN(e.target.value)} className="w-24" /><Button onClick={gen} className="bg-indigo-600 hover:bg-indigo-700">Generate</Button><CopyBtn value={out} /></div>
      <Textarea value={out} readOnly className="min-h-[160px] bg-slate-50" />
    </div>
  );
};

export const NumberToRomanTool = () => {
  const [n, setN] = useState('');
  const toRoman = (num) => { const map=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']]; let r=''; let x = parseInt(num); if (!x || x<1 || x>3999) return 'Enter 1-3999'; for (const [v,s] of map) while (x>=v){ r+=s; x-=v; } return r; };
  return (
    <div>
      <Label>Enter number (1–3999)</Label>
      <Input type="number" value={n} onChange={e=>setN(e.target.value)} className="mt-1.5" />
      <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200 font-mono text-2xl text-indigo-700">{n ? toRoman(n) : '—'}</div>
    </div>
  );
};

export const RomanToNumberTool = () => {
  const [r, setR] = useState('');
  const fromRoman = (s) => { const m={I:1,V:5,X:10,L:50,C:100,D:500,M:1000}; let n=0; const x=s.toUpperCase(); for (let i=0;i<x.length;i++){ const cur=m[x[i]], nxt=m[x[i+1]]; if(!cur) return 'Invalid'; n += nxt>cur ? -cur : cur; } return n; };
  return (
    <div>
      <Label>Enter Roman numeral</Label>
      <Input value={r} onChange={e=>setR(e.target.value)} className="mt-1.5 uppercase" />
      <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200 font-mono text-2xl text-indigo-700">{r ? fromRoman(r) : '—'}</div>
    </div>
  );
};

export const NumberToWordTool = () => {
  const [n, setN] = useState('');
  const ones=['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const tens=['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  const inWords = (num) => {
    if (num===0) return 'Zero'; if (num<0) return 'Negative '+inWords(-num);
    const sc = ['','Thousand','Million','Billion','Trillion']; let i=0; let res='';
    const chunk=(x)=>{let s=''; if(x>=100){s+=ones[Math.floor(x/100)]+' Hundred '; x%=100;} if(x>=20){s+=tens[Math.floor(x/10)]+' '; x%=10;} if(x>0&&x<20){s+=ones[x]+' ';} return s.trim();};
    while (num>0){ const c=num%1000; if(c) res = chunk(c)+(sc[i]?' '+sc[i]:'')+(res?' '+res:''); num=Math.floor(num/1000); i++; }
    return res.trim();
  };
  return (
    <div>
      <Label>Number</Label>
      <Input type="number" value={n} onChange={e=>setN(e.target.value)} className="mt-1.5" />
      <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-lg text-slate-800">{n!=='' ? inWords(parseInt(n)||0) : '—'}</div>
    </div>
  );
};

export const WordToNumberTool = () => {
  const [t, setT] = useState('');
  const map = {zero:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19,twenty:20,thirty:30,forty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90,hundred:100,thousand:1000,million:1000000,billion:1000000000};
  const parse = (s) => { let result=0,current=0; const tokens=s.toLowerCase().replace(/[-,]/g,' ').split(/\s+/).filter(Boolean); for (const w of tokens){ if(map[w]===undefined) return 'Invalid'; const v=map[w]; if(v===100){current*=100;} else if (v>=1000){ result += (current||1)*v; current=0; } else current+=v; } return result+current; };
  return (
    <div>
      <Label>Words (e.g. "two thousand five hundred")</Label>
      <Input value={t} onChange={e=>setT(e.target.value)} className="mt-1.5" />
      <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200 font-mono text-2xl text-indigo-700">{t ? parse(t) : '—'}</div>
    </div>
  );
};
