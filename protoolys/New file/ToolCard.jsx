import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';

export default function ToolCard({ tool }) {
  const Ico = Icons[tool.icon] || Icons.Wrench;
  return (
    <Link to={`/tool/${tool.slug}`} className="tool-card group flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-xl">
      <div className="icon-wrap w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
        <Ico className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <div className="font-semibold text-sm text-slate-900 group-hover:text-indigo-700 truncate">{tool.name}</div>
        <div className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-snug">{tool.description}</div>
      </div>
    </Link>
  );
}
