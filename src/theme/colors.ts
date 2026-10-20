export type ThemeMode = 'light' | 'dark';

// Design direction: "Spritz Noir" (see DESIGN.md) — a dim bar after dark: near-black
// surfaces, warm ivory text, and ONE warm spritz-orange for everything you can tap.
// The palette is deliberately tiny: neutrals + one accent + green/red for meaning only.
// Every text/icon color was checked for >= 4.5:1 against the surfaces and tints it sits on.
//
// Orange is mid-light, so filled surfaces carry a dark ink label (onAccent) in both themes.
// On paper, orange text needs a deeper burnt orange (accentText) to stay readable.
//   accentPrimary  = fills/borders (buttons, selected segments, badges). Ink on it: 7.8:1 dark / 5.5:1 light.
//   accentText     = accent-colored text and icons. Spritz on dark (7.4–8.4:1), burnt orange on light (5.5–6.0:1).
//   onAccent       = label/icon color placed on an accentPrimary fill.
const INK = '#16141A';
const SPRITZ = '#FF8A3D';
const SPRITZ_LIGHT = '#E8641F';
const SPRITZ_TEXT_LIGHT = '#A94408';

export type ThemeColors = {
  accentPrimary: string;
  accentPrimaryMuted: string;
  accentText: string;
  onAccent: string;
  // Success is only for positive outcomes (validated, live). Danger is only for
  // destructive actions and errors: danger = filled surface (white label), dangerText = as text.
  accentSuccess: string;
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
  // Alpha suffix for tints so text on its own tint stays >= 4.5:1.
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
    accentPrimary: SPRITZ_LIGHT,
    accentPrimaryMuted: `${SPRITZ_LIGHT}14`,
    accentText: SPRITZ_TEXT_LIGHT,
    onAccent: INK,
    accentSuccess: '#197E43',
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
    accentPrimary: SPRITZ,
    accentPrimaryMuted: `${SPRITZ}22`,
    accentText: SPRITZ,
    onAccent: INK,
    accentSuccess: '#2ED573',
    danger: '#C0343A',
    dangerText: '#E9676B',
    tintAlpha: '22',
  },
};
