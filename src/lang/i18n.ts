import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import "intl-pluralrules";

import en from "./en.json";
import ro from "./translations/ro.json";
import fr from "./translations/fr.json";
import de from "./translations/de.json";
import it from "./translations/it.json";

const resources = {
  en: {
    translation: en,
  },
  ro: {
    translation: ro,
  },
  fr: {
    translation: fr,
  },
  de: {
    translation: de,
  },
  it: {
    translation: it,
  },
};

declare module "i18next" {
  interface CustomTypeOptions {
    resources: (typeof resources)["en"];
  }
}

export function initI18n() {
  i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources,
      lng: "en",
      fallbackLng: "en",

      interpolation: {
        escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
      },
    });
}

export const locales = ["en", "fr", "de", "it", "ro"] as const;

type Locale = (typeof locales)[number];

export function useLocale() {
  const locale = i18n.language;
  const setLocale = (locale: string) => {
    i18n.changeLanguage(locale);
  };
  return [locale, setLocale] as [Locale, (locale: Locale) => void];
}

export const langIcons = {
  en: require(`../../assets/icons/lang/en.png`),
  de: require(`../../assets/icons/lang/de.png`),
  fr: require(`../../assets/icons/lang/fr.png`),
  it: require(`../../assets/icons/lang/it.png`),
  ro: require(`../../assets/icons/lang/ro.png`),
};
