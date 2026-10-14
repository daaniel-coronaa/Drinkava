import type { ChallengeCategory } from '@/types/challenge';

export type DrinkType = 'shot' | 'cocktail' | 'beer' | 'wine' | 'other';
export type ThemeMode = 'light' | 'dark';

// Design direction: "Noir Champagne" (see DESIGN.md) — near-black, warm ivory, and one
// house color: champagne gold. Every text/icon color below was checked for >= 4.5:1
// against the surfaces and tints it sits on in its own theme.
//
// Gold is light, so filled surfaces carry a dark ink label (onAccent), the way a gold
// plate carries black lettering — and text/icons use a bronze in light mode, where gold
// itself is too pale to read on paper.
//   accentPrimary  = fills/borders (buttons, selected segments, badges). Ink on it: 9.6:1 dark / 5.3:1 light.
//   accentText     = accent-colored text and icons. Champagne on dark (9.1–10.4:1), bronze on light (5.8–6.3:1).
//   onAccent       = label/icon color placed on an accentPrimary fill.
const INK = '#16141A';
const GOLD_DARK = '#D9B877'; // champagne
const GOLD_LIGHT = '#A98530'; // brass fill for light surfaces
const BRONZE = '#7D5A0F'; // text/icons on light surfaces

export type ThemeColors = {
  accentPrimary: string;
  accentPrimaryMuted: string;
  accentText: string;
  onAccent: string;
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
    accentPrimary: GOLD_LIGHT,
    accentPrimaryMuted: `${GOLD_LIGHT}14`,
    accentText: BRONZE,
    onAccent: INK,
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
    accentPrimary: GOLD_DARK,
    accentPrimaryMuted: `${GOLD_DARK}22`,
    accentText: GOLD_DARK,
    onAccent: INK,
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

// "bebida" reuses the shot orange (not beer amber) so it never reads as the gold house color.
export const challengeCategoryColors: Record<ThemeMode, Record<ChallengeCategory, string>> = {
  dark: { bebida: '#FF6B4A', social: '#428EFF', fisico: '#2ED573', social_premium: GOLD_DARK },
  light: { bebida: '#D42700', social: '#0062F5', fisico: '#197E43', social_premium: BRONZE },
};
