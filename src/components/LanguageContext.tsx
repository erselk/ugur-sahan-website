"use client";
import { createContext, useState, useContext, ReactNode } from "react";

type Language = "tr" | "en";

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const LanguageContext = createContext<LanguageContextProps>({
  language: "tr",
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("tr");
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
} 