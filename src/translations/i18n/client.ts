"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import config from "./config";
import ka from "../ka.json";
import en from "../en.json";

const savedLang =
    typeof window !== "undefined" ? localStorage.getItem("lang") : null;

i18n
    .use(initReactI18next)
    .init({
        ...config,
        resources: {
            ka: { translation: ka },
            en: { translation: en },
        },
        lng: savedLang || "ka",   // pick saved or fallback
    });

export default i18n;
