import type { ChallengeCategory } from '@/types/challenge';

export type DrinkType = 'shot' | 'cocktail' | 'beer' | 'wine' | 'other';
export type ThemeMode = 'light' | 'dark';

// Design direction: "Midnight Garnet" (see DESIGN.md). Every text/icon color below was
// checked for >= 4.5:1 against the surfaces and tints it sits on in its own theme.

// One brand rose, two roles — a single pink can't be both a filled surface under white
// text AND readable as small text on near-black (the two pull luminance opposite ways).
//   accentPrimary  = fills/borders (buttons, selected segments, badges). White on it: 5.50:1.
//   accentText     = accent-colored text and icons. Dark theme gets a lighter rose
//                    (6.4–7.3:1 on every dark surface); light theme reuses the fill (5.05:1+).
const ACCENT_FILL = '#C8244F';

export type ThemeColors = {
  accentPrimary: string;
  accentPrimaryMuted: string;
  accentText: string;
  accentSuccess: string;
  accentWarning: string;
  accentInfo: string;
  // danger = filled destructive surface (white label, 5.54:1); dangerText = errors as text.
  danger: string;
  dangerText: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  textPrimary: string;
  textSecondary: string;
  // Hairline dividers and card edges (decorative).
  border: string;
  // Boundaries that must be perceivable (inputs, secondary buttons) — >= 3:1.
  borderStrong: string;
  // Alpha suffix for category/semantic tints so text on its own tint stays >= 4.5:1.
  tintAlpha: string;
};

export const Colors: Record<ThemeMode, ThemeColors> = {
  light: {
    background: '#F7F5F2', // warm paper
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    textPrimary: '#16141A',
    textSecondary: '#6A6670',
    border: '#E6E2DC',
    borderStrong: '#8A8690',
    accentPrimary: ACCENT_FILL,
    accentPrimaryMuted: `${ACCENT_FILL}14`,
    accentText: ACCENT_FILL,
    accentSuccess: '#197E43',
    accentWarning: '#9A6400',
    accentInfo: '#0062F5',
    danger: '#C0343A',
    dangerText: '#C0343A',
    tintAlpha: '14',
  },
  dark: {
    background: '#0A0A0B',
    surface: '#131316',
    surfaceElevated: '#1A1A1F',
    textPrimary: '#F4F1EC', // ivory, not pure white
    textSecondary: '#9C98A1',
    border: '#26262B',
    borderStrong: '#68656F',
    accentPrimary: ACCENT_FILL,
    accentPrimaryMuted: `${ACCENT_FILL}22`,
    accentText: '#FF6B8E',
    accentSuccess: '#2ED573',
    accentWarning: '#FFB020',
    accentInfo: '#428EFF',
    danger: '#C0343A',
    dangerText: '#E9676B',
    tintAlpha: '22',
  },
};

// Category colors are data labels, not decoration — desaturated/darkened per theme so the
// same hue stays legible as text on white (light) and on near-black (dark).
export const drinkTypeColors: Record<ThemeMode, Record<DrinkType, string>> = {
  dark: { shot: '#FF6B4A', cocktail: '#C961FF', beer: '#F5A623', wine: '#EF5B7F', other: '#5295DB' },
  light: { shot: '#D42700', cocktail: '#A500FA', beer: '#976107', wine: '#B8123B', other: '#2871BE' },
};

export const challengeCategoryColors: Record<ThemeMode, Record<ChallengeCategory, string>> = {
  dark: { bebida: '#F5A623', social: '#428EFF', fisico: '#2ED573', social_premium: '#C961FF' },
  light: { bebida: '#976107', social: '#0062F5', fisico: '#197E43', social_premium: '#A500FA' },
};
