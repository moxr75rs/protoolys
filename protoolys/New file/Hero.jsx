import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useLang } from '../contexts/LanguageContext';
import { CATEGORIES, POPULAR_TOOLS } from '../data/tools';

export default function Hero() {
  const { t } = useLang();
  const nav = useNavigate();
  const [q, setQ] = React.useState('');
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-soft" />
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 lg:pt-24 lg:pb-20">
        <div className="max-w-3xl mx-auto text-center fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-indigo-100 text-indigo-700 text-xs font-medium shadow-sm">
            <Icons.Sparkles className="w-3.5 h-3.5" /> 240+ free productivity tools
          </div>
          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.05]">
            {t('hero_title')}
          </h1>
          <p className="mt-5 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">{t('hero_sub')}</p>

          <div className="mt-8 flex items-center gap-2 bg-white rounded-2xl border border-slate-200 shadow-lg p-2 max-w-2xl mx-auto">
            <Icons.Search className="w-5 h-5 text-slate-400 ml-3" />
            <Input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && nav(`/tools?q=${encodeURIComponent(q)}`)} placeholder={t('search_ph')} className="border-0 shadow-none focus-visible:ring-0 text-base h-11" />
            <Button onClick={() => nav(`/tools?q=${encodeURIComponent(q)}`)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 px-5">Search</Button>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-slate-500">{t('popular')}:</span>
            {POPULAR_TOOLS.slice(0, 6).map(p => (
              <Link key={p.id} to={`/tool/${p.slug}`} className="text-xs px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-700">
                {p.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {CATEGORIES.slice(0, 7).map(c => {
            const Ico = Icons[c.icon] || Icons.Wrench;
            return (
              <Link key={c.id} to={`/category/${c.id}`} className="tool-card flex flex-col items-center gap-2 p-4 bg-white border border-slate-200 rounded-xl text-center">
                <div className="icon-wrap w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Ico className="w-5 h-5" /></div>
                <span className="text-sm font-semibold text-slate-800">{c.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
