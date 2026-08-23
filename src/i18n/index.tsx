import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { fr, en, type Translations } from './translations';
import { contentFr, contentEn, type Content } from '../data/content';

interface I18nContextValue {
  lang: 'fr' | 'en';
  setLang: (lang: Lang) => void;
  t: Translations;
  content: Content;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = 'portfolio-lang';

function detectInitialLang(): 'fr' | 'en' {
  if (typeof window === 'undefined') return 'fr';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'fr' || stored === 'en') return stored;
  return navigator.language?.toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<'fr' | 'en'>('fr');

  useEffect(() => {
    setLang(detectInitialLang());
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // storage unavailable: ignore
    }
  }, [lang]);

  const value: I18nContextValue = {
    lang,
    setLang,
    t: lang === 'fr' ? fr : en,
    content: lang === 'fr' ? contentFr : contentEn,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within an I18nProvider');
  return ctx;
}

/** Replace {placeholders} in a translation string. */
export function tpl(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in params ? String(params[key]) : match,
  );
}
