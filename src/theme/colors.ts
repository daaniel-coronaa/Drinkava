import type { ChallengeCategory } from '@/types/challenge';

export type DrinkType = 'shot' | 'cocktail' | 'beer' | 'wine' | 'other';

const base = {
  accentPrimary: '#FF3D6E', // confetti magenta — vibrant, distinct from Strava orange
  accentPrimaryMuted: '#FF3D6E22',
  accentSuccess: '#2ED573', // kudos / positive
  accentWarning: '#FFB020', // safe-mode / disclaimer
  accentInfo: '#3D8BFF',
};

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
    ...base,
  },
  dark: {
    background: '#0B0B0F',
    surface: '#17171D',
    surfaceElevated: '#1F1F27',
    textPrimary: '#F5F5F7',
    textSecondary: '#9B9BA6',
    border: '#2A2A33',
    ...base,
  },
};

export type ThemeMode = 'light' | 'dark';
