import { useLanguageStore } from '../store/languageStore';
import { translations, TranslationKey } from '../i18n/translations';

export const useTranslation = () => {
  const { currentLanguage } = useLanguageStore();
  
  const t = (key: TranslationKey): string => {
    return translations[currentLanguage.code as keyof typeof translations]?.[key] || 
           translations.es[key] || 
           key;
  };
  
  return { t, currentLanguage };
};