import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { translate, type Language, type TranslationKey } from '@/i18n';
import { setDateFnsLocale } from '@/utils/date';

const SAFE_MODE_KEY = 'drinkava:safeMode';
const LANGUAGE_KEY = 'drinkava:language';

type SettingsContextValue = {
  safeModeEnabled: boolean;
  setSafeModeEnabled: (enabled: boolean) => void;
  language: Language;
  setLanguage: (language: Language) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [safeModeEnabled, setSafeModeEnabledState] = useState(false);
  const [language, setLanguageState] = useState<Language>('es');

  useEffect(() => {
    AsyncStorage.getItem(SAFE_MODE_KEY).then((v) => setSafeModeEnabledState(v === 'true'));
    AsyncStorage.getItem(LANGUAGE_KEY).then((v) => {
      const lang = v === 'en' ? 'en' : 'es';
      setLanguageState(lang);
      setDateFnsLocale(lang);
    });
  }, []);

  const setSafeModeEnabled = (enabled: boolean) => {
    setSafeModeEnabledState(enabled);
    AsyncStorage.setItem(SAFE_MODE_KEY, String(enabled));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setDateFnsLocale(lang);
    AsyncStorage.setItem(LANGUAGE_KEY, lang);
  };

  const value = useMemo(
    () => ({ safeModeEnabled, setSafeModeEnabled, language, setLanguage }),
    [safeModeEnabled, language],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}

export function useTranslation() {
  const { language } = useSettings();
  const t = useCallback((key: TranslationKey, params?: Record<string, string | number>) => translate(language, key, params), [language]);
  return { t, language };
}
