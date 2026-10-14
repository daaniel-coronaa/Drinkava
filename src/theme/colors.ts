import type { ChallengeCategory } from '@/types/challenge';

export type DrinkType = 'shot' | 'cocktail' | 'beer' | 'wine' | 'other';

const base = {
  accentSuccess: '#2ED573', // kudos / positive
  accentWarning: '#FFB020', // safe-mode / disclaimer
  accentInfo: '#3D8BFF',
};

// One brand rose, two roles — a single pink can't be both a filled surface under white
// text AND readable as small text on near-black (the two pull luminance opposite ways).
//   accentPrimary  = fills/borders (buttons, selected segments, badges). White on it: 5.50:1.
//   accentText     = accent-colored text and icons. Dark theme gets a lighter rose
//                    (6.0–7.3:1 on every dark surface); light theme reuses the fill (5.27:1).
const ACCENT_FILL = '#C8244F';

export const drinkTypeColors: Record<DrinkType, string> = {
  shot: '#FF6B4A',
  cocktail: '#C24DFF',
  beer: '#F5A623',
  wine: '#B8123B',
  other: '#4A90D9',
};

export const challengeCategoryColors: Record<ChallengeCategory, string> = {
  bebida: '#F5A623',
  social: '#3D8BFF',
  fisico: '#2ED573',
  social_premium: '#C24DFF',
};

export type ThemeColors = typeof base & {
  accentPrimary: string;
  accentPrimaryMuted: string;
  accentText: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
};

export const Colors: Record<'light' | 'dark', ThemeColors> = {
  light: {
    background: '#FAFAFC',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    textPrimary: '#14141A',
    textSecondary: '#6B6B76',
    border: '#E7E7ED',
    accentPrimary: ACCENT_FILL,
    accentPrimaryMuted: `${ACCENT_FILL}14`, // 8% — keeps accent text on its tint ≥ 4.5:1
    accentText: ACCENT_FILL,
    ...base,
  },
  dark: {
    background: '#0B0B0F',
    surface: '#17171D',
    surfaceElevated: '#1F1F27',
    textPrimary: '#F5F5F7',
    textSecondary: '#9B9BA6',
    border: '#2A2A33',
    accentPrimary: ACCENT_FILL,
    accentPrimaryMuted: `${ACCENT_FILL}22`,
    accentText: '#FF6B8E',
    ...base,
  },
};

export type ThemeMode = 'light' | 'dark';
