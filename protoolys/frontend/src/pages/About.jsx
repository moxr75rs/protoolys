import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import * as Icons from 'lucide-react';
import { Button } from '../components/ui/button';

const Stat = ({ k, v }) => (
  <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center">
    <div className="text-3xl font-extrabold text-indigo-600">{v}</div>
    <div className="text-sm text-slate-600 mt-1">{k}</div>
  </div>
);

const Value = ({ icon, t, d }) => {
  const I = Icons[icon] || Icons.Sparkles;
  return (
    <div className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-indigo-200 transition-colors">
      <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><I className="w-5 h-5" /></div>
      <h4 className="mt-4 font-semibold text-slate-900">{t}</h4>
      <p className="mt-1 text-sm text-slate-500 leading-relaxed">{d}</p>
    </div>
  );
};

const team = [
  { name: 'Sarah Chen', role: 'Founder & CEO', initials: 'SC', color: 'bg-indigo-600' },
  { name: 'Marcus Rivera', role: 'Head of Product', initials: 'MR', color: 'bg-emerald-600' },
  { name: 'Aiko Tanaka', role: 'Lead Engineer', initials: 'AT', color: 'bg-rose-600' },
  { name: 'David Kim', role: 'Design Lead', initials: 'DK', color: 'bg-amber-600' },
];

const testimonials = [
  { name: 'Emma Wilson', role: 'Content Creator', text: "Protooly replaced 6 different tools I was paying for. The JSON formatter alone saves me hours each week." },
  { name: 'James O’Connor', role: 'SEO Consultant', text: "I use the meta tag generator and keyword density checker daily. Clean interface, no ads, no friction." },
  { name: 'Priya Sharma', role: 'Full-stack Developer', text: "The 240+ tool collection is unmatched. Image conversions, code beautifiers, calculators — all in one place." },
  { name: 'Mohamed Ali', role: 'Digital Marketer', text: "Multi-language support including Arabic was the deciding factor. UI feels premium and works flawlessly." },
];

export default function About() {
  return (
    <>
      <Header />
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium"><Icons.Sparkles className="w-3.5 h-3.5" /> Our story</div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">Built for creators who get things done</h1>
          <p className="mt-5 text-lg text-slate-600 max-w-2xl mx-auto">Protooly started in 2024 with a simple idea: stop forcing people to juggle 20 different websites for everyday tasks. One workspace. 240 tools. Zero noise.</p>
        </div>

        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat k="Tools available" v="240+" />
          <Stat k="Languages supported" v="18" />
          <Stat k="Monthly users" v="500K+" />
          <Stat k="Uptime" v="99.9%" />
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 bg-white border border-slate-200 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Icons.Telescope className="w-5 h-5" /></div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">Our mission</h3>
            <p className="mt-2 text-slate-600 leading-relaxed">Make essential productivity tools radically accessible — free, fast, multilingual, and privacy-respecting.</p>
          </div>
          <div className="p-8 bg-white border border-slate-200 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Icons.Eye className="w-5 h-5" /></div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">Our vision</h3>
            <p className="mt-2 text-slate-600 leading-relaxed">Become the default tab for every student, marketer, developer and creator who values craft over clutter.</p>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-extrabold text-slate-900 text-center">What we believe</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          <Value icon="ShieldCheck" t="Privacy first" d="Files processed in-browser whenever possible. We never sell your data." />
          <Value icon="Zap" t="Speed matters" d="Every interaction is instant. Tools load in under 300ms." />
          <Value icon="Globe2" t="Truly global" d="18 languages, RTL support, currency-aware utilities." />
          <Value icon="Heart" t="Human-first" d="No dark patterns, no autoplay videos, no popups." />
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-extrabold text-slate-900 text-center">Meet the team</h2>
        <p className="text-center text-slate-500 mt-2">A small distributed team across 3 continents.</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          {team.map(m => (
            <div key={m.name} className="p-6 bg-white border border-slate-200 rounded-2xl text-center">
              <div className={`w-20 h-20 rounded-full ${m.color} text-white text-2xl font-bold flex items-center justify-center mx-auto`}>{m.initials}</div>
              <div className="mt-4 font-semibold text-slate-900">{m.name}</div>
              <div className="text-sm text-slate-500">{m.role}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-extrabold text-slate-900 text-center">Loved by professionals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
          {testimonials.map(t => (
            <div key={t.name} className="p-6 bg-white border border-slate-200 rounded-2xl">
              <Icons.Quote className="w-6 h-6 text-indigo-300" />
              <p className="mt-3 text-slate-700 leading-relaxed">“{t.text}”</p>
              <div className="mt-4 pt-4 border-t border-slate-100"><div className="font-semibold text-slate-900 text-sm">{t.name}</div><div className="text-xs text-slate-500">{t.role}</div></div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="gradient-cta rounded-3xl p-10 text-white text-center">
          <h2 className="text-3xl font-extrabold">Ready to simplify your workflow?</h2>
          <p className="mt-2 text-indigo-100">Jump into 240+ tools — no signup, no ads.</p>
          <Link to="/tools"><Button className="mt-5 bg-white text-indigo-700 hover:bg-indigo-50 h-11 px-6 font-semibold">Explore all tools <Icons.ArrowRight className="w-4 h-4 ml-1 flip-rtl" /></Button></Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
