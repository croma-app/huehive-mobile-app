import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { locales } from './locales';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  fallbackLng: 'en',
  lng: 'en', // TODO: change to  lng: RNLocalize.getLocales()[0].languageCode once i18n is enabled.
  resources: locales
});

export default i18n;
