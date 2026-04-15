import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LanguageSwitcher.module.scss';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className={styles['lang-switcher']}>
      {['en', 'ua', 'pl'].map(lang => (
        <button
          key={lang}
          type="button"
          className={`${styles['lang-switcher__btn']} ${
            i18n.language === lang ? styles['lang-switcher__btn--active'] : ''
          }`}
          onClick={() => changeLanguage(lang)}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
};
