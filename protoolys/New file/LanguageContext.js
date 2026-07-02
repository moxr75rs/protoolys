import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { LANGUAGES, tr } from '../i18n/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('protooly_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('protooly_lang', lang);
    const meta = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
    document.documentElement.lang = lang;
    document.documentElement.dir = meta.dir;
  }, [lang]);

  const t = useCallback((key) => tr(lang, key), [lang]);
  return (
    <LanguageContext.Provider value={{ lang, setLang, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
