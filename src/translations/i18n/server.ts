// translations/server.ts
import { createInstance } from "i18next";
import  config from "./config"; // ⬅️ your config
import ka from "../ka.json";
import en from "../en.json";

export async function getServerT(lang: string) {
    const i18nInstance = createInstance();
    await i18nInstance.init({
        ...config,
        lng: lang,
        resources: {
            ka: { translation: ka },
            en: { translation: en },
        },
    });

    return i18nInstance.getFixedT(lang);
}
