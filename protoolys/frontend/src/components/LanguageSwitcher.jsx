import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LANGUAGES } from '../i18n/translations';
import { useLang } from '../contexts/LanguageContext';
import * as Icons from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-slate-200">
          <Icons.Globe className="w-4 h-4 text-slate-500" />
          <span className="hidden sm:inline text-sm">{current.label}</span>
          <span className="sm:hidden text-sm">{current.code.toUpperCase()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-1 max-h-80 overflow-auto">
        <div className="grid grid-cols-1">
          {LANGUAGES.map(l => (
            <button key={l.code} onClick={() => { setLang(l.code); setOpen(false); }} className={`flex items-center justify-between px-3 py-2 rounded-md text-sm hover:bg-indigo-50 ${l.code === lang ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-700'}`}>
              <span className="flex items-center gap-2"><span className="text-base">{l.flag}</span>{l.label}</span>
              {l.code === lang && <Icons.Check className="w-4 h-4 text-indigo-600" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
