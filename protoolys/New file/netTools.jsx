import React, { useState } from 'react';
import { Input, Button, Label, Icons, Textarea, CopyBtn } from './_common';
import * as API from '../lib/api';

const Stat = ({ label, value, mono = false }) => (
  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
    <div className="text-xs text-slate-500">{label}</div>
    <div className={`text-base font-bold text-slate-900 mt-0.5 ${mono ? 'font-mono' : ''}`}>{value}</div>
  </div>
);

function RunBar({ value, onChange, onRun, loading, placeholder = 'https://example.com' }) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="flex-1 font-mono" />
      <Button onClick={onRun} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
        {loading ? <Icons.Loader2 className="w-4 h-4 animate-spin" /> : <><Icons.Play className="w-4 h-4 mr-1" /> Check</>}
      </Button>
    </div>
  );
}

export const HTTPStatusTool = () => {
  const [url, setUrl] = useState('https://example.com');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const run = async () => { setLoading(true); setErr(''); try { setData(await API.netHttpStatus(url)); } catch(e){ setErr(e.response?.data?.detail || e.message); } finally { setLoading(false); }};
  return (
    <div>
      <RunBar value={url} onChange={setUrl} onRun={run} loading={loading} />
      {err && <div className="mt-3 p-3 rounded bg-rose-50 text-rose-700 text-sm border border-rose-200">{err}</div>}
      {data && (
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat label="Status code" value={<span className={`${data.status>=200&&data.status<300?'text-emerald-600':data.status>=400?'text-rose-600':'text-amber-600'}`}>{data.status}</span>} />
          <Stat label="Status text" value={data.statusText || '—'} />
          <Stat label="Redirects" value={data.redirects} />
          <Stat label="Final URL" value={<span className="truncate inline-block max-w-full" title={data.finalUrl}>{data.finalUrl}</span>} mono />
        </div>
      )}
    </div>
  );
};

export const GetHeadersTool = () => {
  const [url, setUrl] = useState('https://example.com');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const run = async () => { setLoading(true); setErr(''); try { setData(await API.netHeaders(url)); } catch(e){ setErr(e.response?.data?.detail || e.message); } finally { setLoading(false); }};
  return (
    <div>
      <RunBar value={url} onChange={setUrl} onRun={run} loading={loading} />
      {err && <div className="mt-3 p-3 rounded bg-rose-50 text-rose-700 text-sm border border-rose-200">{err}</div>}
      {data && (
        <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-lg font-mono text-sm space-y-1 max-h-[400px] overflow-auto">
          {Object.entries(data.headers).map(([k,v]) => (
            <div key={k}><span className="text-indigo-600 font-semibold">{k}:</span> <span className="text-slate-700 break-all">{v}</span></div>
          ))}
        </div>
      )}
    </div>
  );
};

export const PageSizeTool = () => {
  const [url, setUrl] = useState('https://example.com');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const run = async () => { setLoading(true); setErr(''); try { setData(await API.netPageSize(url)); } catch(e){ setErr(e.response?.data?.detail || e.message); } finally { setLoading(false); }};
  return (
    <div>
      <RunBar value={url} onChange={setUrl} onRun={run} loading={loading} />
      {err && <div className="mt-3 p-3 rounded bg-rose-50 text-rose-700 text-sm border border-rose-200">{err}</div>}
      {data && (
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat label="Bytes" value={data.bytes.toLocaleString()} />
          <Stat label="Kilobytes" value={`${data.kb} KB`} />
          <Stat label="Megabytes" value={`${data.mb} MB`} />
          <Stat label="Content type" value={data.contentType || '—'} />
        </div>
      )}
    </div>
  );
};

export const DomainToIPTool = () => {
  const [domain, setDomain] = useState('example.com');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const run = async () => { setLoading(true); setErr(''); try { setData(await API.netDomainToIp(domain)); } catch(e){ setErr(e.response?.data?.detail || e.message); } finally { setLoading(false); }};
  return (
    <div>
      <RunBar value={domain} onChange={setDomain} onRun={run} loading={loading} placeholder="example.com" />
      {err && <div className="mt-3 p-3 rounded bg-rose-50 text-rose-700 text-sm border border-rose-200">{err}</div>}
      {data && (
        <div className="mt-5 space-y-3">
          <div>
            <div className="text-sm font-semibold text-slate-700 mb-1">IPv4</div>
            {data.ipv4?.length ? data.ipv4.map(ip => <div key={ip} className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg font-mono">{ip}</div>) : <div className="text-sm text-slate-500">No A records</div>}
          </div>
          {data.ipv6?.length > 0 && (
            <div>
              <div className="text-sm font-semibold text-slate-700 mb-1">IPv6</div>
              {data.ipv6.map(ip => <div key={ip} className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg font-mono text-sm">{ip}</div>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const DNSRecordsTool = () => {
  const [domain, setDomain] = useState('example.com');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const run = async () => { setLoading(true); setErr(''); try { setData(await API.netDnsRecords(domain)); } catch(e){ setErr(e.response?.data?.detail || e.message); } finally { setLoading(false); }};
  return (
    <div>
      <RunBar value={domain} onChange={setDomain} onRun={run} loading={loading} placeholder="example.com" />
      {err && <div className="mt-3 p-3 rounded bg-rose-50 text-rose-700 text-sm border border-rose-200">{err}</div>}
      {data && (
        <div className="mt-5 space-y-3">
          {Object.entries(data.records).map(([rec, vals]) => (
            <div key={rec} className="p-4 rounded-lg border border-slate-200 bg-slate-50">
              <div className="text-xs font-bold text-indigo-700 uppercase mb-2">{rec} records</div>
              {vals.length ? vals.map((v, i) => <div key={i} className="font-mono text-sm text-slate-700 break-all">{v}</div>) : <div className="text-sm text-slate-400">None</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ServerStatusTool = () => {
  const [url, setUrl] = useState('https://example.com');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const run = async () => { setLoading(true); try { setData(await API.netServerStatus(url)); } catch(e){ setData({ up:false, error:e.message }); } finally { setLoading(false); }};
  return (
    <div>
      <RunBar value={url} onChange={setUrl} onRun={run} loading={loading} />
      {data && (
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Stat label="Status" value={<span className={data.up?'text-emerald-600':'text-rose-600'}>{data.up?'● Online':'● Offline'}</span>} />
          <Stat label="HTTP code" value={data.status || '—'} />
          <Stat label="Latency" value={`${data.latencyMs} ms`} />
        </div>
      )}
    </div>
  );
};

export const RedirectChainTool = () => {
  const [url, setUrl] = useState('https://bit.ly/example');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const run = async () => { setLoading(true); setErr(''); try { setData(await API.netRedirectChain(url)); } catch(e){ setErr(e.response?.data?.detail || e.message); } finally { setLoading(false); }};
  return (
    <div>
      <RunBar value={url} onChange={setUrl} onRun={run} loading={loading} />
      {err && <div className="mt-3 p-3 rounded bg-rose-50 text-rose-700 text-sm border border-rose-200">{err}</div>}
      {data && (
        <div className="mt-5 space-y-2">
          <div className="text-sm text-slate-600">{data.hops} hop{data.hops!==1?'s':''}</div>
          {data.chain.map((c, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">{i+1}</span>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-sm text-slate-700 truncate">{c.url}</div>
                <div className="text-xs text-slate-500">HTTP {c.status}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
