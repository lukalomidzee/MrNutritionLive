// config.ts
import { InitOptions } from "i18next";
import ka from "../ka.json";
import en from "../en.json";

const config: InitOptions = {
    resources: {
        ka: { translation: ka },
        en: { translation: en },
    },
    lng: "ka",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
};

export default config;   // 🔹 now you can do import config from "./config"
