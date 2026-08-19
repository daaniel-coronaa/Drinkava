import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const SAFE_MODE_KEY = 'drinkava:safeMode';

type SettingsContextValue = {
  safeModeEnabled: boolean;
  setSafeModeEnabled: (enabled: boolean) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [safeModeEnabled, setSafeModeEnabledState] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(SAFE_MODE_KEY).then((v) => setSafeModeEnabledState(v === 'true'));
  }, []);

  const setSafeModeEnabled = (enabled: boolean) => {
    setSafeModeEnabledState(enabled);
    AsyncStorage.setItem(SAFE_MODE_KEY, String(enabled));
  };

  const value = useMemo(() => ({ safeModeEnabled, setSafeModeEnabled }), [safeModeEnabled]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
