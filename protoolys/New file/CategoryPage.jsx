import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ToolCard from '../components/ToolCard';
import { CATEGORIES, getToolsByCategory } from '../data/tools';
import * as Icons from 'lucide-react';

export default function CategoryPage() {
  const { cat } = useParams();
  const meta = CATEGORIES.find(c => c.id === cat);
  const tools = getToolsByCategory(cat);
  if (!meta) return <><Header /><div className="max-w-7xl mx-auto px-6 py-20">Category not found. <Link to="/tools" className="text-indigo-600">Back</Link></div><Footer /></>;
  const Ico = Icons[meta.icon] || Icons.Wrench;
  return (
    <>
      <Header />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Ico className="w-7 h-7" /></div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">{meta.name}</h1>
            <p className="text-slate-500 mt-1">{meta.desc}</p>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {tools.map(t => <ToolCard key={t.id} tool={t} />)}
        </div>
      </section>
      <Footer />
    </>
  );
}
