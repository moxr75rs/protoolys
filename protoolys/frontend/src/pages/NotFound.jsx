import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import * as Icons from 'lucide-react';
import { Button } from '../components/ui/button';

export default function NotFound() {
  return (
    <>
      <Header />
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-indigo-50 text-indigo-600 mx-auto"><Icons.SearchX className="w-12 h-12" /></div>
        <div className="mt-8 text-7xl font-black text-slate-900 tracking-tight">404</div>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">This page wandered off</h1>
        <p className="mt-3 text-slate-600 max-w-md mx-auto">The page or tool you're looking for doesn't exist, was moved, or is still being built. Head back home or browse our full catalog.</p>
        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          <Link to="/"><Button className="bg-indigo-600 hover:bg-indigo-700 text-white"><Icons.Home className="w-4 h-4 mr-1" /> Home</Button></Link>
          <Link to="/tools"><Button variant="outline"><Icons.LayoutGrid className="w-4 h-4 mr-1" /> Browse tools</Button></Link>
          <Link to="/contact"><Button variant="ghost">Report this</Button></Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
