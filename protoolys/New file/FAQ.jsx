import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Input } from '../components/ui/input';
import * as Icons from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQS = [
  { q: 'Is Protooly really free?', a: 'Yes. All 240+ tools are free to use without any signup. We may introduce a Pro plan later for bulk processing limits and team features.' },
  { q: 'Do you store the files I upload?', a: 'No. Whenever possible, tools run entirely in your browser. For tools that need server processing (like HTTP checks), we only handle the request and never store content.' },
  { q: 'Do I need to create an account?', a: 'No account is required for any tool. Your favorites and history are stored locally in your browser.' },
  { q: 'Which languages are supported?', a: '18 languages: English, Spanish, Portuguese, Russian, German, Italian, Indonesian, Arabic, Turkish, Dutch, Vietnamese, French, Swedish, Korean, Japanese, Danish, Romanian, Norwegian.' },
  { q: 'Can I use Protooly tools for commercial work?', a: 'Absolutely. There are no restrictions on commercial use. We only ask that you respect copyright laws when processing content you don’t own.' },
  { q: 'Do you offer an API?', a: 'A public API is on our roadmap. Join the newsletter to be notified at launch.' },
  { q: 'What if a tool doesn’t work as expected?', a: 'Most browser-based tools work offline once loaded. If you spot a bug, drop us a note via Contact — we triage feedback weekly.' },
  { q: 'Are PDF tools available offline?', a: 'PDF conversion tools rely on server-side libraries for production use. They’re currently in beta preview.' },
  { q: 'How do you make money if everything is free?', a: 'We plan to launch optional premium tiers with batch processing, white-labelling, and team workspaces. The free tier will always include essentials.' },
  { q: 'Can I request a new tool?', a: 'Yes — please use the Contact form. We ship 2–3 new tools every month based on community requests.' },
];

export default function FAQ() {
  const [q, setQ] = useState('');
  const list = FAQS.filter(f => !q || f.q.toLowerCase().includes(q.toLowerCase()) || f.a.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <Header />
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium"><Icons.HelpCircle className="w-3.5 h-3.5" /> Frequently asked</div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold text-slate-900">Questions, answered</h1>
          <p className="mt-3 text-slate-600">Quick answers to common questions about Protooly.</p>
        </div>
        <div className="relative mb-6">
          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search questions..." className="pl-9 h-11" />
        </div>
        <Accordion type="single" collapsible className="space-y-2">
          {list.map((f, i) => (
            <AccordionItem key={i} value={`q-${i}`} className="border border-slate-200 rounded-xl px-4 bg-white">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        {list.length === 0 && <div className="text-center py-10 text-slate-500">No questions match “{q}”. Try a different search.</div>}
        <div className="mt-10 p-6 bg-indigo-50 border border-indigo-100 rounded-2xl text-center">
          <h3 className="font-semibold text-slate-900">Still have questions?</h3>
          <p className="text-sm text-slate-600 mt-1">Reach out and we’ll get back to you within a day.</p>
          <Link to="/contact" className="inline-flex items-center gap-1 mt-3 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium">Contact us <Icons.ArrowRight className="w-4 h-4 flip-rtl" /></Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
