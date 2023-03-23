import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import { locales } from './locales';

RNLocalize.addEventListener('change', () => {
  i18n.changeLanguage(RNLocalize.getLocales()[0].languageCode);
});

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  fallbackLng: 'en',
  lng: RNLocalize.getLocales()[0].languageCode,
  resources: locales
});

export default i18n;
