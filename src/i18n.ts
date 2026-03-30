import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./i18n/en.json";
import hi from "./i18n/hi.json";
import ar from "./i18n/ar.json";
import fr from "./i18n/fr.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      ar: { translation: ar },
      fr: { translation: fr },
    },
    fallbackLng: "en",
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "med_sync_locale",
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
