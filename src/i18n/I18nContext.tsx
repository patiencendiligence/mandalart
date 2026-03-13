import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ko, TranslationKeys } from './translations/ko';
import { en } from './translations/en';

export type Language = 'ko' | 'en';

const LANGUAGE_KEY = '@mandalart_language';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: TranslationKeys;
}

const translations: Record<Language, TranslationKeys> = {
  ko,
  en,
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>('ko');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage === 'ko' || savedLanguage === 'en') {
        setLanguageState(savedLanguage);
      }
    } catch (error) {
      console.error('Failed to load language setting:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setLanguage = useCallback(async (lang: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Failed to save language setting:', error);
    }
  }, []);

  const t = translations[language];

  if (isLoading) {
    return null;
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export function useTranslation() {
  const { t, language } = useI18n();
  
  const formatText = useCallback((template: string, params: Record<string, string | number>) => {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => String(params[key] ?? ''));
  }, []);

  const getMonthName = useCallback((monthIndex: number) => {
    return t.periodSelector.months[monthIndex - 1] || '';
  }, [t]);

  return { t, language, formatText, getMonthName };
}
