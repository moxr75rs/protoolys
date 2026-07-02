import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import * as Icons from 'lucide-react';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import { sendContact } from '../lib/api';

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return toast({ title: 'Missing fields', description: 'Please complete all fields.' });
    setLoading(true);
    try {
      await sendContact(form);
      toast({ title: 'Message sent', description: "Thanks! We'll reply within 24 hours." });
      setForm({ name: '', email: '', message: '' });
    } catch {
      toast({ title: 'Could not send', description: 'Please try again later.' });
    } finally { setLoading(false); }
  };
  return (
    <>
      <Header />
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium"><Icons.MessageCircle className="w-3.5 h-3.5" /> Get in touch</div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold text-slate-900">We’d love to hear from you</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Have feedback, a tool idea, or a partnership proposal? Drop us a line.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-3">
            {[
              { i:'Mail', t:'Email', v:'hello@protooly.app' },
              { i:'Phone', t:'Phone', v:'+1 (555) 123-4567' },
              { i:'MapPin', t:'Office', v:'Remote — worldwide' },
              { i:'Clock', t:'Response time', v:'Within 24 hours' },
            ].map(c => { const I = Icons[c.i]; return (
              <div key={c.t} className="p-5 bg-white border border-slate-200 rounded-xl flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"><I className="w-4 h-4" /></div>
                <div><div className="text-xs text-slate-500">{c.t}</div><div className="font-semibold text-slate-900">{c.v}</div></div>
              </div>
            ); })}
            <div className="p-5 bg-white border border-slate-200 rounded-xl">
              <div className="text-sm font-semibold text-slate-900 mb-3">Follow us</div>
              <div className="flex gap-2">{['Twitter','Github','Linkedin','Instagram','Youtube'].map(n => { const I = Icons[n]; return I ? <a key={n} href="#" className="w-9 h-9 rounded-full bg-slate-100 hover:bg-indigo-600 hover:text-white flex items-center justify-center text-slate-600 transition-colors"><I className="w-4 h-4" /></a> : null; })}</div>
            </div>
          </div>
          <form onSubmit={submit} className="lg:col-span-2 p-8 bg-white border border-slate-200 rounded-2xl space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><Label>Your name</Label><Input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Jane Doe" className="mt-1.5" /></div>
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="jane@example.com" className="mt-1.5" /></div>
            </div>
            <div><Label>Message</Label><Textarea value={form.message} onChange={e=>setForm({...form, message:e.target.value})} placeholder="How can we help?" className="mt-1.5 min-h-[180px]" /></div>
            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">{loading ? <Icons.Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Icons.Send className="w-4 h-4 mr-1" />} Send message</Button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
}
