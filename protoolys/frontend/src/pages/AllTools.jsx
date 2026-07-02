import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ToolCard from '../components/ToolCard';
import { TOOLS, CATEGORIES } from '../data/tools';
import { Input } from '../components/ui/input';
import * as Icons from 'lucide-react';

export default function AllTools() {
  const [sp] = useSearchParams();
  const [q, setQ] = useState(sp.get('q') || '');
  const [cat, setCat] = useState('all');
  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    return TOOLS.filter(t => (cat === 'all' || t.category === cat) && (!k || t.name.toLowerCase().includes(k)));
  }, [q, cat]);
  return (
    <>
      <Header />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">All Tools</h1>
        <p className="text-slate-500 mt-2">Browse our complete collection of {TOOLS.length} tools.</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search 240+ tools..." className="pl-9 h-11" />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => setCat('all')} className={`px-3 py-1.5 rounded-full text-sm border ${cat==='all'?'bg-indigo-600 border-indigo-600 text-white':'bg-white border-slate-200 text-slate-700 hover:border-indigo-300'}`}>All</button>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setCat(c.id)} className={`px-3 py-1.5 rounded-full text-sm border ${cat===c.id?'bg-indigo-600 border-indigo-600 text-white':'bg-white border-slate-200 text-slate-700 hover:border-indigo-300'}`}>{c.name}</button>
          ))}
        </div>
        <div className="mt-6 text-sm text-slate-500">{filtered.length} tools</div>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map(t => <ToolCard key={t.id} tool={t} />)}
        </div>
      </section>
      <Footer />
    </>
  );
}
