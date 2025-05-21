import { useContext } from "react";
import { LanguageContext } from "@/components/LanguageContext";
import { translations } from "./translations";

type TranslationKey = 
  | "common.siteName"
  | "common.toggleTheme"
  | "common.search"
  | "common.readMore"
  | "common.back"
  | "common.home"
  | "common.loading"
  | "common.error"
  | "nav.about"
  | "nav.writings"
  | "nav.projects"
  | "nav.contact"
  | "nav.title"
  | "nav.poems"
  | "nav.memories"
  | "nav.essays"
  | "nav.innovation"
  | "nav.tasting"
  | "nav.language.switch"
  | "home.welcome"
  | "home.description"
  | "home.explore"
  | "home.latestWorks"
  | "home.contact"
  | "home.stats.writings"
  | "home.stats.projects"
  | "home.stats.experience"
  | "home.stats.readers"
  | "about.title"
  | "about.description"
  | "poems.title"
  | "poems.empty"
  | "memories.title"
  | "memories.empty"
  | "essays.title"
  | "essays.empty"
  | "innovation.title"
  | "innovation.empty"
  | "tasting.title"
  | "tasting.empty";

export function useTranslation() {
  const { language } = useContext(LanguageContext);

  const t = (key: TranslationKey): string => {
    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      if (value === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
      value = value[k];
    }

    if (typeof value !== "string") {
      console.warn(`Translation value is not a string: ${key}`);
      return key;
    }

    return value;
  };

  return { t };
} 