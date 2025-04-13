import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import en from '../locales/en.json';
import zh from '../locales/zh.json';

i18n
    .use(LanguageDetector) // 偵測瀏覽器語言
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            zh: { translation: zh },
        },
        supportedLngs: ['en', 'zh'],
        fallbackLng: 'en',
        interpolation: { escapeValue: false },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: 'todoless-lang',
        },
    });

export default i18n;