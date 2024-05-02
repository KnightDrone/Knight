import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import "intl-pluralrules";

import en from "./en.json";
import ro from "./translations/ro.json";
import fr from "./translations/fr.json";
import de from "./translations/de.json";
import it from "./translations/it.json";
import es from "./translations/es.json";
import pk from "./translations/pk.json";
import dz from "./translations/dz.json";
import gr from "./translations/gr.json";

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
  es: {
    translation: es,
  },
  pk: {
    translation: pk,
  },
  dz: {
    translation: dz,
  },
  gr: {
    translation: gr,
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
      lng: "us",
      fallbackLng: "us",

      interpolation: {
        escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
      },
    });
}

export const locales = [
  "en",
  "fr",
  "de",
  "it",
  "es",
  "pk",
  "dz",
  "ro",
  "gr",
] as const;

type Locale = (typeof locales)[number];

export function useLocale() {
  const locale = i18n.language;
  const setLocale = (locale: string) => {
    i18n.changeLanguage(locale);
  };
  return [locale, setLocale] as [Locale, (locale: Locale) => void];
}

export const langIcons = {
  en: require(`../../assets/icons/lang/en-us.png`),
  de: require(`../../assets/icons/lang/de.png`),
  fr: require(`../../assets/icons/lang/fr.png`),
  it: require(`../../assets/icons/lang/it.png`),
  ro: require(`../../assets/icons/lang/ro.png`),
  es: require(`../../assets/icons/lang/es.png`),
  pk: require(`../../assets/icons/lang/pk.png`),
  dz: require(`../../assets/icons/lang/dz.png`),
  gr: require(`../../assets/icons/lang/gr.png`),
};
