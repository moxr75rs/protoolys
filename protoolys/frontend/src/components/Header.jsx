import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import LanguageSwitcher from './LanguageSwitcher';
import { useLang } from '../contexts/LanguageContext';
import { TOOLS, CATEGORIES } from '../data/tools';

export default function Header() {
  const { t } = useLang();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const k = q.toLowerCase();
    return TOOLS.filter(x => x.name.toLowerCase().includes(k)).slice(0, 8);
  }, [q]);

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
            <Icons.Wrench className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight">Protooly</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-4">
          <Link to="/tools" className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 rounded-md hover:bg-slate-50">{t('menu_tools')}</Link>
          <div className="relative group">
            <button className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 rounded-md hover:bg-slate-50 flex items-center gap-1">
              {t('menu_categories')} <Icons.ChevronDown className="w-3.5 h-3.5" />
            </button>
            <div className="absolute left-0 top-full pt-2 hidden group-hover:block w-[480px]">
              <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-3 grid grid-cols-2 gap-1">
                {CATEGORIES.map(c => {
                  const Ico = Icons[c.icon] || Icons.Wrench;
                  return (
                    <Link key={c.id} to={`/category/${c.id}`} className="flex items-center gap-2 p-2 rounded-lg hover:bg-indigo-50">
                      <div className="w-8 h-8 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center"><Ico className="w-4 h-4" /></div>
                      <span className="text-sm font-medium text-slate-700">{c.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <Link to="/blog" className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 rounded-md hover:bg-slate-50">Blog</Link>
          <Link to="/about" className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 rounded-md hover:bg-slate-50">About</Link>
          <Link to="/faq" className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 rounded-md hover:bg-slate-50">FAQ</Link>
          <Link to="/contact" className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 rounded-md hover:bg-slate-50">Contact</Link>
        </nav>

        <div className="flex-1 max-w-md hidden md:block relative">
          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && results[0]) { nav(`/tool/${results[0].slug}`); setQ(''); } }} placeholder={t('search_ph')} className="pl-9 h-10 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500" />
          {results.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-80 overflow-auto z-50">
              {results.map(r => {
                const Ico = Icons[r.icon] || Icons.Wrench;
                return (
                  <Link key={r.id} to={`/tool/${r.slug}`} onClick={() => setQ('')} className="flex items-center gap-3 px-3 py-2 hover:bg-indigo-50 text-sm">
                    <Ico className="w-4 h-4 text-indigo-600" /> {r.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <LanguageSwitcher />
          <Link to="/dashboard" className="hidden md:inline-flex"><Button variant="outline" size="sm" className="gap-1.5"><Icons.User className="w-4 h-4" /> Dashboard</Button></Link>
          <Button className="hidden md:inline-flex bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => nav('/tools')}>{t('browse')}</Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden"><Icons.Menu className="w-5 h-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-2 mt-6">
                <Link to="/tools" onClick={() => setOpen(false)} className="px-3 py-2 rounded-md hover:bg-slate-50 font-medium">{t('menu_tools')}</Link>
                <Link to="/blog" onClick={() => setOpen(false)} className="px-3 py-2 rounded-md hover:bg-slate-50 font-medium">Blog</Link>
                <Link to="/about" onClick={() => setOpen(false)} className="px-3 py-2 rounded-md hover:bg-slate-50 font-medium">About</Link>
                <Link to="/faq" onClick={() => setOpen(false)} className="px-3 py-2 rounded-md hover:bg-slate-50 font-medium">FAQ</Link>
                <Link to="/contact" onClick={() => setOpen(false)} className="px-3 py-2 rounded-md hover:bg-slate-50 font-medium">Contact</Link>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="px-3 py-2 rounded-md hover:bg-slate-50 font-medium">Dashboard</Link>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-3 px-3">Categories</div>
                {CATEGORIES.map(c => (
                  <Link key={c.id} to={`/category/${c.id}`} onClick={() => setOpen(false)} className="px-3 py-2 rounded-md hover:bg-slate-50 text-sm text-slate-700">{c.name}</Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
