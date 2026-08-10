import i18n from 'i18next';
import {
  initReactI18next,
} from 'react-i18next';

import en from './locales/en.json';
import ht from './locales/ht.json';
import fr from './locales/fr.json';

const supportedLanguages = [
  'en',
  'ht',
  'fr',
];

const savedLanguage =
  localStorage.getItem(
    'enfiance-language'
  );

const initialLanguage =
  supportedLanguages.includes(
    savedLanguage
  )
    ? savedLanguage
    : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      ht: {
        translation: ht,
      },
      fr: {
        translation: fr,
      },
    },

    lng: initialLanguage,
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false,
    },
  });

i18n.on(
  'languageChanged',
  (language) => {
    if (
      supportedLanguages.includes(
        language
      )
    ) {
      localStorage.setItem(
        'enfiance-language',
        language
      );

      document.documentElement.lang =
        language;
    }
  }
);

document.documentElement.lang =
  initialLanguage;

export default i18n;
