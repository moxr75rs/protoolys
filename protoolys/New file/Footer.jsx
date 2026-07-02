import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { CATEGORIES } from '../data/tools';
import { useLang } from '../contexts/LanguageContext';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="bg-slate-900 text-slate-300 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center"><Icons.Wrench className="w-5 h-5 text-white" /></div>
              <span className="font-extrabold text-xl text-white">Protooly</span>
            </Link>
            <p className="mt-4 text-sm text-slate-400 max-w-sm leading-relaxed">{t('footer_about')}</p>
            <div className="flex gap-3 mt-5">
              {['Twitter','Github','Linkedin','Instagram','Youtube'].map(n => { const I = Icons[n]; return I ? <a key={n} href="#" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-indigo-600 flex items-center justify-center transition-colors"><I className="w-4 h-4" /></a> : null; })}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/tools" className="hover:text-indigo-400">All tools</Link></li>
              <li><Link to="/dashboard" className="hover:text-indigo-400">Dashboard</Link></li>
              <li><Link to="/blog" className="hover:text-indigo-400">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-indigo-400">About us</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-400">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-indigo-400">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Categories</h4>
            <ul className="space-y-2 text-sm">
              {CATEGORIES.slice(0, 5).map(c => (
                <li key={c.id}><Link to={`/category/${c.id}`} className="hover:text-indigo-400">{c.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="hover:text-indigo-400">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-indigo-400">Terms</Link></li>
              <li><Link to="/cookies" className="hover:text-indigo-400">Cookies</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Protooly. {t('footer_rights')}</p>
          <div className="flex gap-5"><Link to="/privacy" className="hover:text-indigo-400">Privacy</Link><Link to="/terms" className="hover:text-indigo-400">Terms</Link><Link to="/contact" className="hover:text-indigo-400">Contact</Link></div>
        </div>
      </div>
    </footer>
  );
}
