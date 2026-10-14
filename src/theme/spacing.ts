// Base unit 4. One step more generous than a utility app — see DESIGN.md §5.
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  inset: 20, // card padding and feed gutters
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const Radius = {
  sm: 6,
  md: 12, // inputs, segmented tracks
  lg: 16, // cards
  xl: 24, // sheets, dialogs
  pill: 999, // buttons, chips, avatars
} as const;

// App column width on wide screens (web, tablets) — phones are narrower so it's a no-op there.
export const ContentMaxWidth = 560;
