import { useContext } from "react";
import { LanguageContext } from "@/components/LanguageContext";
import { translations } from "./translations";

export type TranslationKey = 
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
  | "footer.navigation"
  | "footer.search"
  | "footer.searchPlaceholder"
  | "footer.rights"
  | "home.welcome"
  | "home.description"
  | "home.contact"
  | "home.hero.title"
  | "home.hero.subtitle"
  | "home.hero.description"
  | "home.expertise.title"
  | "home.expertise.subtitle"
  | "home.expertise.engineering.title"
  | "home.expertise.engineering.description"
  | "home.expertise.entrepreneurship.title"
  | "home.expertise.entrepreneurship.description"
  | "home.expertise.innovation.title"
  | "home.expertise.innovation.description"
  | "home.expertise.multidisciplinary.title"
  | "home.expertise.multidisciplinary.description"
  | "home.expertise.software.title"
  | "home.expertise.software.description"
  | "home.expertise.design.title"
  | "home.expertise.design.description"
  | "about.title"
  | "about.description"
  | "about.education.title"
  | "about.education.content"
  | "about.personal.title"
  | "about.personal.content"
  | "about.philosophy.title"
  | "about.philosophy.content"
  | "about.roles.engineer"
  | "about.roles.entrepreneur"
  | "about.roles.innovator"
  | "poems.title"
  | "poems.empty"
  | "memories.title"
  | "memories.empty"
  | "essays.title"
  | "essays.empty"
  | "innovation.title"
  | "innovation.empty"
  | "tasting.title"
  | "tasting.empty"
  | "contact.title"
  | "contact.description"
  | "contact.info.title"
  | "contact.info.subtitle"
  | "contact.info.email"
  | "contact.info.phone"
  | "contact.info.address"
  | "contact.info.social"
  | "contact.info.getDirections"
  | "contact.form.title"
  | "contact.form.subtitle"
  | "contact.form.name"
  | "contact.form.email"
  | "contact.form.subject"
  | "contact.form.message"
  | "contact.form.send"
  | "contact.form.success"
  | "contact.form.successDetail"
  | "contact.form.error"
  | "contact.collaboration.title"
  | "contact.collaboration.subtitle"
  | "contact.collaboration.description"
  | "contact.support.title"
  | "contact.support.subtitle"
  | "contact.support.description"
  | "projects.title"
  | "projects.comingSoon";

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