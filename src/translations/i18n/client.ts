"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ka from "../ka.json";
import en from "../en.json";

i18n
    .use(initReactI18next)
    .init({
        resources: {
            ka: { translation: ka },
            en: { translation: en },
        },
        lng: "ka",
        fallbackLng: "en",
        interpolation: { escapeValue: false },
    });

export default i18n;
