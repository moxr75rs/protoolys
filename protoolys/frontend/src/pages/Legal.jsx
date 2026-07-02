import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import * as Icons from 'lucide-react';

function LegalShell({ title, updated, icon='FileText', children }) {
  const I = Icons[icon] || Icons.FileText;
  return (
    <>
      <Header />
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><I className="w-5 h-5" /></div>
          <div><h1 className="text-3xl font-extrabold text-slate-900">{title}</h1><p className="text-sm text-slate-500">Last updated: {updated}</p></div>
        </div>
        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">{children}</div>
      </section>
      <Footer />
    </>
  );
}

export function Privacy() {
  return (
    <LegalShell title="Privacy Policy" updated="July 1, 2025" icon="Shield">
      <p>Protooly (“we”, “our”) is committed to protecting your privacy. This policy explains what data we collect, how we use it and your rights.</p>
      <h2 className="text-xl font-bold text-slate-900 mt-6">Data we collect</h2>
      <ul className="list-disc pl-6 space-y-1"><li><b>Anonymous usage statistics</b> — which tools are used (no IP linkage).</li><li><b>Session identifiers</b> — a random ID stored in your browser for favorites.</li><li><b>Contact form submissions</b> — only what you submit voluntarily.</li></ul>
      <h2 className="text-xl font-bold text-slate-900 mt-6">Data we don’t collect</h2>
      <ul className="list-disc pl-6 space-y-1"><li>Your name, address or phone unless you submit them.</li><li>Files processed by client-side tools.</li><li>Browsing history outside Protooly.</li></ul>
      <h2 className="text-xl font-bold text-slate-900 mt-6">Cookies</h2>
      <p>We use a single first-party cookie/localStorage entry for language preferences and favorites. We never sell data to third parties.</p>
      <h2 className="text-xl font-bold text-slate-900 mt-6">Your rights</h2>
      <p>You can clear your local data anytime from your browser settings. To request deletion of contact-form messages, email <a href="mailto:privacy@protooly.app" className="text-indigo-600">privacy@protooly.app</a>.</p>
    </LegalShell>
  );
}

export function Terms() {
  return (
    <LegalShell title="Terms & Conditions" updated="July 1, 2025" icon="ScrollText">
      <p>By using Protooly, you agree to these terms. Please read them carefully.</p>
      <h2 className="text-xl font-bold text-slate-900 mt-6">Use of services</h2>
      <p>Our tools are provided “as is” for personal and commercial use. You may not use them for illegal purposes or to violate intellectual property rights.</p>
      <h2 className="text-xl font-bold text-slate-900 mt-6">Content responsibility</h2>
      <p>You retain full ownership of any content you process. We claim no rights and store nothing beyond what’s necessary to serve a request.</p>
      <h2 className="text-xl font-bold text-slate-900 mt-6">Service availability</h2>
      <p>We aim for 99.9% uptime but make no guarantees. Tools may be temporarily disabled for maintenance or upgrades.</p>
      <h2 className="text-xl font-bold text-slate-900 mt-6">Limitation of liability</h2>
      <p>Protooly is free to use. We are not liable for any direct, indirect or consequential damages arising from use of the service.</p>
      <h2 className="text-xl font-bold text-slate-900 mt-6">Changes</h2>
      <p>We may update these terms. Material changes will be announced on this page.</p>
    </LegalShell>
  );
}

export function Cookies() {
  return (
    <LegalShell title="Cookie Policy" updated="July 1, 2025" icon="Cookie">
      <p>This page describes how Protooly uses cookies and similar storage technologies.</p>
      <h2 className="text-xl font-bold text-slate-900 mt-6">What we use</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li><b>localStorage</b> — stores your language preference and a random session ID.</li>
        <li><b>Analytics cookies</b> — anonymous, aggregate usage only (no personal data).</li>
      </ul>
      <h2 className="text-xl font-bold text-slate-900 mt-6">Third-party</h2>
      <p>We do <i>not</i> use third-party tracking, advertising or fingerprinting cookies.</p>
      <h2 className="text-xl font-bold text-slate-900 mt-6">Manage cookies</h2>
      <p>You can clear cookies and local storage at any time from your browser’s settings. Doing so will reset your favorites and language.</p>
    </LegalShell>
  );
}
