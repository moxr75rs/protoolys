import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ToolCard from '../components/ToolCard';
import { getToolBySlug, getToolsByCategory, CATEGORIES } from '../data/tools';
import { useLang } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import * as Icons from 'lucide-react';
import { toolRegistry } from '../tools/registry';
import ComingSoonTool from '../tools/ComingSoonTool';
import { trackTool, getFavorites, toggleFavorite } from '../lib/api';

export default function ToolPage() {
  const { slug } = useParams();
  const { t } = useLang();
  const nav = useNavigate();
  const tool = getToolBySlug(slug);
  const [favs, setFavs] = useState([]);

  useEffect(() => {
    if (slug) {
      trackTool(slug);
      getFavorites().then(setFavs).catch(() => {});
    }
  }, [slug]);

  const isFav = favs.includes(slug);
  const toggleFav = async () => {
    try {
      const r = await toggleFavorite(slug);
      setFavs(prev => r.favorited ? [...prev, slug] : prev.filter(x => x !== slug));
    } catch {}
  };

  if (!tool) return <><Header /><div className="max-w-7xl mx-auto px-6 py-20">Tool not found. <Link to="/tools" className="text-indigo-600">Back to tools</Link></div><Footer /></>;
  const cat = CATEGORIES.find(c => c.id === tool.category);
  const Ico = Icons[tool.icon] || Icons.Wrench;
  const Implementation = toolRegistry[tool.slug];
  const related = getToolsByCategory(tool.category).filter(x => x.slug !== slug).slice(0, 4);
  return (
    <>
      <Header />
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => nav(-1)} className="text-sm text-slate-500 hover:text-indigo-600 inline-flex items-center gap-1"><Icons.ArrowLeft className="w-4 h-4 flip-rtl" /> {t('back')}</button>
        <div className="mt-4 flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shrink-0"><Ico className="w-7 h-7" /></div>
          <div className="flex-1 min-w-0">
            <div className="text-xs uppercase tracking-wider text-indigo-600 font-semibold">{cat?.name}</div>
            <h1 className="text-3xl font-extrabold text-slate-900">{tool.name}</h1>
            <p className="text-slate-500 mt-1">{tool.description}</p>
          </div>
          <Button onClick={toggleFav} variant="outline" size="sm" className="gap-1.5 shrink-0">
            <Icons.Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span className="hidden sm:inline">{isFav ? 'Favorited' : 'Favorite'}</span>
          </Button>
        </div>
        <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          {Implementation ? <Implementation /> : <ComingSoonTool tool={tool} />}
        </div>
        {tool.keywords && tool.keywords.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Keywords:</span>
            {tool.keywords.map(k => <span key={k} className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs">{k}</span>)}
          </div>
        )}
      </section>
      {related.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h3 className="text-lg font-bold text-slate-900 mb-3">Related tools</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">{related.map(r => <ToolCard key={r.id} tool={r} />)}</div>
        </section>
      )}
      <Footer />
    </>
  );
}
