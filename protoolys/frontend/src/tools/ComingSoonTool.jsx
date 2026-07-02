import React from 'react';
import * as Icons from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { getToolsByCategory } from '../data/tools';

export default function ComingSoonTool({ tool }) {
  const related = getToolsByCategory(tool.category).filter(t => t.functional).slice(0, 4);
  return (
    <div className="text-center py-10">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-100 text-amber-600 mx-auto"><Icons.Hammer className="w-10 h-10" /></div>
      <h2 className="mt-6 text-2xl font-bold text-slate-900">This tool is coming soon</h2>
      <p className="mt-2 text-slate-600 max-w-md mx-auto">{tool.name} requires advanced server-side processing and is currently being built. We ship 2–3 new tools every month — stay tuned.</p>
      <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
        <Link to="/tools"><Button className="bg-indigo-600 hover:bg-indigo-700 text-white"><Icons.LayoutGrid className="w-4 h-4 mr-1" /> Browse working tools</Button></Link>
        <Link to="/contact"><Button variant="outline">Request priority <Icons.ArrowRight className="w-4 h-4 ml-1 flip-rtl" /></Button></Link>
      </div>
      {related.length > 0 && (
        <div className="mt-10 pt-8 border-t border-slate-100">
          <div className="text-sm font-semibold text-slate-700 mb-3">Working alternatives in this category</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {related.map(r => { const I = Icons[r.icon] || Icons.Wrench; return (
              <Link key={r.id} to={`/tool/${r.slug}`} className="tool-card flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl text-left">
                <div className="icon-wrap w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"><I className="w-4 h-4" /></div>
                <span className="text-sm font-medium text-slate-800 truncate">{r.name}</span>
              </Link>
            );})}
          </div>
        </div>
      )}
    </div>
  );
}
