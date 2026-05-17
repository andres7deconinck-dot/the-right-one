import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { TRANSLATIONS, type LangCode, type Translations } from "./translations";

type LanguageContextType = {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: Translations;
};

// The 3 languages the UI actually supports end-to-end.
// Any other browser/stored lang falls back to English.
const SUPPORTED: LangCode[] = ["en", "nl", "fr"];

function detectBrowserLang(): LangCode {
  if (typeof navigator === "undefined") return "en";
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const raw of langs) {
    const code = raw.toLowerCase().split("-")[0] as LangCode;
    if (SUPPORTED.includes(code)) return code;
  }
  return "en";
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: TRANSLATIONS.en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("gluttongo-lang") as LangCode | null;
      if (stored && SUPPORTED.includes(stored)) {
        setLangState(stored);
        return;
      }
      const detected = detectBrowserLang();
      setLangState(detected);
      localStorage.setItem("gluttongo-lang", detected);
    } catch {}
  }, []);

  const setLang = (l: LangCode) => {
    const safe = SUPPORTED.includes(l) ? l : "en";
    setLangState(safe);
    try { localStorage.setItem("gluttongo-lang", safe); } catch {}
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
