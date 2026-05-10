import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { TRANSLATIONS, type LangCode, type Translations } from "./translations";

type LanguageContextType = {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: Translations;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: TRANSLATIONS.en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("gluttongo-lang") as LangCode;
      if (stored && stored in TRANSLATIONS) setLangState(stored);
    } catch {}
  }, []);

  const setLang = (l: LangCode) => {
    setLangState(l);
    try { localStorage.setItem("gluttongo-lang", l); } catch {}
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: TRANSLATIONS[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
