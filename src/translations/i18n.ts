"use client";

import i18n, { InitOptions } from "i18next";
import { initReactI18next } from "react-i18next";
import ka from "./ka.json";
import en from "./en.json";

i18n.use(initReactI18next).init({
    resources: {
        ka: { translation: ka },
        en: { translation: en },
    },
    lng: "ka", // default
    fallbackLng: "en",
    interpolation: { escapeValue: false },
} as InitOptions);

export default i18n;
