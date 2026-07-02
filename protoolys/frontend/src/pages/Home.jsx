import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import ToolCard from '../components/ToolCard';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { CATEGORIES, POPULAR_TOOLS, getToolsByCategory } from '../data/tools';
import { useLang } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';

export default function Home() {
  const { t } = useLang();
  return (
    <>
      <Header />
      <Hero />

      {/* Popular tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{t('popular')}</h2>
            <p className="text-slate-500 mt-1 text-sm">Most loved tools by our community</p>
          </div>
          <Link to="/tools" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">{t('browse')} <Icons.ArrowRight className="w-4 h-4 flip-rtl" /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {POPULAR_TOOLS.map(p => <ToolCard key={p.id} tool={p} />)}
        </div>
      </section>

      {/* Categories */}
      {CATEGORIES.map(c => {
        const tools = getToolsByCategory(c.id).slice(0, 8);
        const Ico = Icons[c.icon] || Icons.Wrench;
        return (
          <section key={c.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-end justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Ico className="w-5 h-5" /></div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{c.name}</h3>
                  <p className="text-slate-500 text-sm">{c.desc}</p>
                </div>
              </div>
              <Link to={`/category/${c.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">View all <Icons.ArrowRight className="w-4 h-4 flip-rtl" /></Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {tools.map(tt => <ToolCard key={tt.id} tool={tt} />)}
            </div>
          </section>
        );
      })}

      {/* Why Protooly */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900">{t('why_title')}</h2>
          <p className="text-slate-500 mt-2">{t('why_sub')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {i:'ShieldCheck',t:t('f1_t'),d:t('f1_d')},
            {i:'Zap',t:t('f2_t'),d:t('f2_d')},
            {i:'CircleUserRound',t:t('f3_t'),d:t('f3_d')},
            {i:'Languages',t:t('f4_t'),d:t('f4_d')},
          ].map(f => {
            const I = Icons[f.i];
            return (
              <div key={f.t} className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-indigo-200 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><I className="w-5 h-5" /></div>
                <h4 className="mt-4 font-semibold text-slate-900">{f.t}</h4>
                <p className="mt-1 text-sm text-slate-500 leading-relaxed">{f.d}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="gradient-cta rounded-3xl p-10 lg:p-14 text-white relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10" />
          <div className="absolute right-20 top-6 w-32 h-32 rounded-full bg-white/10" />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">{t('cta_t')}</h2>
            <p className="mt-3 text-indigo-100 text-lg">{t('cta_d')}</p>
            <Link to="/tools"><Button className="mt-6 bg-white text-indigo-700 hover:bg-indigo-50 h-11 px-6 font-semibold">{t('cta_btn')} <Icons.ArrowRight className="w-4 h-4 ml-1 flip-rtl" /></Button></Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
