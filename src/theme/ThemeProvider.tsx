import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import { Colors, drinkTypeColors, type ThemeColors, type ThemeMode } from './colors';
import { Radius, Spacing } from './spacing';
import { Typography } from './typography';

const STORAGE_KEY = 'drinkava:themeModeOverride';

type ThemeContextValue = {
  mode: ThemeMode;
  modeOverride: ThemeMode | 'system';
  setModeOverride: (mode: ThemeMode | 'system') => void;
  colors: ThemeColors;
  spacing: typeof Spacing;
  radius: typeof Radius;
  typography: typeof Typography;
  drinkTypeColors: typeof drinkTypeColors;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [modeOverride, setModeOverrideState] = useState<ThemeMode | 'system'>('system');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setModeOverrideState(stored);
      }
    });
  }, []);

  const setModeOverride = (next: ThemeMode | 'system') => {
    setModeOverrideState(next);
    AsyncStorage.setItem(STORAGE_KEY, next);
  };

  const mode: ThemeMode = modeOverride === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : modeOverride;

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      modeOverride,
      setModeOverride,
      colors: Colors[mode],
      spacing: Spacing,
      radius: Radius,
      typography: Typography,
      drinkTypeColors,
    }),
    [mode, modeOverride],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
