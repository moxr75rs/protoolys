import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Button } from './ui/button';

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem('protooly_cookies_ack')) setShow(true);
  }, []);
  const ack = () => { localStorage.setItem('protooly_cookies_ack', '1'); setShow(false); };
  if (!show) return null;
  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0"><Icons.Cookie className="w-5 h-5" /></div>
          <div className="min-w-0">
            <h4 className="font-semibold text-slate-900">We use cookies</h4>
            <p className="mt-1 text-sm text-slate-600 leading-relaxed">Only essential cookies for language and favorites. No tracking or ads. <Link to="/cookies" className="text-indigo-600 hover:underline">Learn more</Link>.</p>
            <div className="mt-3 flex gap-2">
              <Button onClick={ack} size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">Got it</Button>
              <Link to="/cookies"><Button size="sm" variant="outline">Details</Button></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
