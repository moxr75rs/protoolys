import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ToolCard from '../components/ToolCard';
import * as Icons from 'lucide-react';
import { getFavorites, getPopular, getSessionId } from '../lib/api';
import { getToolBySlug } from '../data/tools';
import { LANGUAGES } from '../i18n/translations';
import { useLang } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';

export default function Dashboard() {
  const { lang, setLang } = useLang();
  const [favs, setFavs] = useState([]);
  const [pop, setPop] = useState([]);
  const [tab, setTab] = useState('favorites');

  useEffect(() => {
    getFavorites().then(setFavs).catch(() => {});
    getPopular(8).then(setPop).catch(() => {});
  }, []);

  const favTools = favs.map(s => getToolBySlug(s)).filter(Boolean);
  const popTools = pop.map(p => getToolBySlug(p.slug)).filter(Boolean);
  const sid = getSessionId();

  return (
    <>
      <Header />
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl">{sid.slice(0,2).toUpperCase()}</div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Your dashboard</h1>
              <p className="text-slate-500 text-sm">Session: <span className="font-mono">{sid.slice(0,8)}…</span></p>
            </div>
          </div>
          <Link to="/tools"><Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Browse all tools <Icons.ArrowRight className="w-4 h-4 ml-1 flip-rtl" /></Button></Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
          {[
            { i:'Star', l:'Favorites', v: favTools.length },
            { i:'TrendingUp', l:'Most used', v: popTools.length },
            { i:'Languages', l:'Language', v: (LANGUAGES.find(l=>l.code===lang)||{}).label },
            { i:'CheckCircle2', l:'Available tools', v:'240+' },
          ].map(s => { const I = Icons[s.i]; return (
            <div key={s.l} className="p-5 bg-white border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between"><div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{s.l}</div><I className="w-4 h-4 text-indigo-500" /></div>
              <div className="text-2xl font-extrabold text-slate-900 mt-2">{s.v}</div>
            </div>
          ); })}
        </div>

        <div className="mt-8 flex gap-2 border-b border-slate-200">
          {[['favorites','My favorites','Star'],['popular','Trending','TrendingUp'],['settings','Settings','Settings']].map(([k,l,ic]) => { const I = Icons[ic]; return (
            <button key={k} onClick={()=>setTab(k)} className={`px-4 py-2.5 text-sm font-medium flex items-center gap-2 border-b-2 -mb-px ${tab===k?'border-indigo-600 text-indigo-700':'border-transparent text-slate-500 hover:text-slate-700'}`}><I className="w-4 h-4" /> {l}</button>
          ); })}
        </div>

        <div className="mt-6">
          {tab === 'favorites' && (favTools.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{favTools.map(t => <ToolCard key={t.id} tool={t} />)}</div>
          ) : (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl"><Icons.Star className="w-10 h-10 text-slate-300 mx-auto" /><h3 className="mt-4 font-semibold text-slate-900">No favorites yet</h3><p className="text-sm text-slate-500 mt-1">Click the star on any tool to save it here.</p><Link to="/tools"><Button variant="outline" className="mt-4">Discover tools</Button></Link></div>
          ))}
          {tab === 'popular' && (popTools.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{popTools.map(t => <ToolCard key={t.id} tool={t} />)}</div>
          ) : (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl text-slate-500">Trending data appears after community usage.</div>
          ))}
          {tab === 'settings' && (
            <div className="max-w-xl p-6 bg-white border border-slate-200 rounded-2xl space-y-5">
              <div>
                <div className="text-sm font-semibold text-slate-900">Interface language</div>
                <select value={lang} onChange={e=>setLang(e.target.value)} className="mt-2 h-10 w-full border border-slate-200 rounded-md px-3 text-sm bg-white">{LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.label}</option>)}</select>
              </div>
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg">
                <div className="text-sm font-semibold text-rose-700">Clear local data</div>
                <p className="text-xs text-rose-600 mt-1">Removes your favorites, session and language preference.</p>
                <Button variant="outline" className="mt-3 border-rose-300 text-rose-700 hover:bg-rose-100" onClick={() => { localStorage.clear(); window.location.reload(); }}>Clear data</Button>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
