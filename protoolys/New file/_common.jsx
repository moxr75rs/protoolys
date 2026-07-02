// Generic helpers for tool components
import React from 'react';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import * as Icons from 'lucide-react';

export function CopyBtn({ value }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <Button type="button" variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(value || ''); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="gap-1.5">
      {copied ? <Icons.Check className="w-3.5 h-3.5 text-emerald-600" /> : <Icons.Copy className="w-3.5 h-3.5" />} {copied ? 'Copied' : 'Copy'}
    </Button>
  );
}

export function TwoPaneText({ inputLabel='Input', outputLabel='Output', input, setInput, output, placeholder='Type or paste your text here...', actions, oneWay=false }) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-slate-700">{inputLabel}</Label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={placeholder} className="mt-1.5 min-h-[220px] font-mono text-sm" />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-slate-700">{outputLabel}</Label>
            <CopyBtn value={output} />
          </div>
          <Textarea value={output} readOnly className="mt-1.5 min-h-[220px] font-mono text-sm bg-slate-50" />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 justify-end">{actions}</div>
    </div>
  );
}

export function Stat({ label, value }) {
  return (
    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-lg font-bold text-slate-900 mt-0.5">{value}</div>
    </div>
  );
}

export { Input, Button, Label, Textarea, Icons };
