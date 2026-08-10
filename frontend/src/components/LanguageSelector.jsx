import {
  Languages,
} from 'lucide-react';

import {
  useTranslation,
} from 'react-i18next';

const languages = [
  {
    code: 'en',
    label: 'English',
  },
  {
    code: 'ht',
    label: 'Kreyòl',
  },
  {
    code: 'fr',
    label: 'Français',
  },
];

export default function LanguageSelector() {
  const {
    i18n,
    t,
  } = useTranslation();

  const currentLanguage =
    i18n.resolvedLanguage ||
    i18n.language ||
    'en';

  const handleChange = async (event) => {
    await i18n.changeLanguage(
      event.target.value
    );
  };

  return (
    <div className="language-selector">
      <Languages
        size={17}
        aria-hidden="true"
      />

      <label
        htmlFor="enfiance-language"
        className="sr-only"
      >
        {t('common.language')}
      </label>

      <select
        id="enfiance-language"
        value={currentLanguage}
        onChange={handleChange}
        className="language-select"
        aria-label={t('common.language')}
      >
        {languages.map(
          (language) => (
            <option
              key={language.code}
              value={language.code}
            >
              {language.label}
            </option>
          )
        )}
      </select>
    </div>
  );
}
