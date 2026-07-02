import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useParams } from 'react-router-dom';
import * as Icons from 'lucide-react';

const POSTS = [
  { slug:'top-10-pdf-tools-2025', title:'Top 10 PDF tools every freelancer should know in 2025', cat:'Productivity', read:'5 min', date:'Jul 12, 2025', author:'Sarah Chen', cover:'bg-gradient-to-br from-indigo-500 to-purple-500', excerpt:'From merging contracts to OCR scanning receipts, here are the PDF utilities that pay for themselves in the first week.' },
  { slug:'json-formatting-deep-dive', title:'JSON formatting: a deep dive into pretty-printing and validation', cat:'Developers', read:'8 min', date:'Jul 5, 2025', author:'Aiko Tanaka', cover:'bg-gradient-to-br from-emerald-500 to-teal-500', excerpt:'Behind the scenes of building a fast, error-tolerant JSON formatter that handles 5MB payloads without freezing the tab.' },
  { slug:'seo-on-page-checklist', title:'The 2025 on-page SEO checklist (with free tools)', cat:'SEO', read:'10 min', date:'Jun 28, 2025', author:'James O’Connor', cover:'bg-gradient-to-br from-orange-500 to-rose-500', excerpt:'Meta tags, schema markup, page speed, redirects — the full checklist your audit deserves.' },
  { slug:'why-arabic-support-matters', title:'Why first-class Arabic (RTL) support matters for global tools', cat:'Design', read:'6 min', date:'Jun 20, 2025', author:'Mohamed Ali', cover:'bg-gradient-to-br from-pink-500 to-fuchsia-500', excerpt:'Right-to-left layouts are not an afterthought. Here is how we reimagined every component for true bidirectional UX.' },
  { slug:'password-security-2025', title:'Password security in 2025: are 16 characters enough?', cat:'Security', read:'7 min', date:'Jun 12, 2025', author:'Marcus Rivera', cover:'bg-gradient-to-br from-slate-700 to-slate-900', excerpt:'A look at modern entropy requirements, why passphrases beat passwords, and how to roll your own generator safely.' },
  { slug:'currency-converter-architecture', title:'Building a real-time currency converter that doesn’t lie', cat:'Engineering', read:'9 min', date:'Jun 04, 2025', author:'Aiko Tanaka', cover:'bg-gradient-to-br from-cyan-500 to-blue-500', excerpt:'Stale FX rates ruin trust. Here’s the caching, fallback and rate-limit strategy behind our 1M+ daily conversions.' },
];

export function BlogList() {
  return (
    <>
      <Header />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium"><Icons.PenLine className="w-3.5 h-3.5" /> The Protooly Blog</div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold text-slate-900">Tutorials, deep dives & product news</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Practical guides on productivity, SEO and engineering — written by people who use these tools daily.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POSTS.map(p => (
            <Link key={p.slug} to={`/blog/${p.slug}`} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-indigo-300 hover:shadow-lg transition-all">
              <div className={`h-44 ${p.cover} relative overflow-hidden`}>
                <div className="absolute inset-0 flex items-center justify-center"><Icons.BookOpen className="w-16 h-16 text-white/30 group-hover:scale-110 transition-transform" /></div>
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur text-white text-xs font-medium">{p.cat}</span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-slate-900 group-hover:text-indigo-700 leading-snug">{p.title}</h3>
                <p className="text-sm text-slate-500 mt-2 line-clamp-2">{p.excerpt}</p>
                <div className="flex items-center gap-3 mt-4 text-xs text-slate-500">
                  <span>{p.author}</span>
                  <span>·</span>
                  <span>{p.date}</span>
                  <span>·</span>
                  <span>{p.read}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}

export function BlogPost() {
  const { slug } = useParams();
  const p = POSTS.find(x => x.slug === slug);
  if (!p) return <><Header /><div className="max-w-3xl mx-auto px-6 py-20 text-center"><h1 className="text-3xl font-bold">Article not found</h1><Link to="/blog" className="text-indigo-600 mt-4 inline-block">← Back to blog</Link></div><Footer /></>;
  return (
    <>
      <Header />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/blog" className="text-sm text-slate-500 hover:text-indigo-600 inline-flex items-center gap-1"><Icons.ArrowLeft className="w-4 h-4 flip-rtl" /> Back to blog</Link>
        <div className={`mt-6 h-56 ${p.cover} rounded-2xl flex items-center justify-center`}><Icons.BookOpen className="w-16 h-16 text-white/40" /></div>
        <div className="mt-6 flex items-center gap-3 text-xs text-slate-500">
          <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium">{p.cat}</span>
          <span>{p.date}</span><span>·</span><span>{p.read} read</span>
        </div>
        <h1 className="mt-4 text-4xl font-extrabold text-slate-900 leading-tight">{p.title}</h1>
        <p className="mt-3 text-slate-500">By <span className="font-medium text-slate-700">{p.author}</span></p>
        <div className="mt-8 prose prose-slate max-w-none">
          <p className="text-lg text-slate-700 leading-relaxed">{p.excerpt}</p>
          <p className="text-slate-700 leading-relaxed mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-3">Why this matters</h2>
          <p className="text-slate-700 leading-relaxed">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-3">Key takeaways</h2>
          <ul className="list-disc pl-6 space-y-2 text-slate-700"><li>Insight one about the topic and how it applies.</li><li>Insight two with a practical example.</li><li>Insight three connecting to a Protooly tool you can use today.</li></ul>
          <p className="text-slate-700 leading-relaxed mt-6">Have thoughts? <Link to="/contact" className="text-indigo-600 hover:underline">Get in touch</Link> — we read every message.</p>
        </div>
      </article>
      <Footer />
    </>
  );
}
