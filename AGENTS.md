# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## Design

- **Read `DESIGN.md` before any UI work** — it is the shipped design system ("Spritz Noir": minimal, dark-first, one orange accent): colors, type, motion, components. Build with `useTheme()` tokens, never hardcoded hex. The palette is tiny on purpose — neutrals + spritz orange + success/danger; don't add per-category or per-drink colors.
- Orange (`accentPrimary`) marks tappable/selected things only. Fills use `accentPrimary` **with the `onAccent` ink label (never white)**; text/icons use `accentText`. One filled primary button per screen — secondary/destructive actions go in an `ActionSheet`.
- Type is Fraunces (titles/numerals, ≥ 18dp) + DM Sans (all UI text), loaded in the root layout. Custom families carry their weight in the family name — don't set `fontWeight` on them. The `frontend-design` / `design-system-generator` skills in `.claude/skills/` come from a *website* toolkit (CSS/Tailwind); use them for design thinking and for regenerating `DESIGN.md`, but this project's `DESIGN.md` wins wherever they disagree.
- Motion & feel: use `PressableScale` for custom tappables, `Segmented` for any 2–3 way switch, `enter(index)` / `smoothLayout` from `src/theme/motion.ts` for list entrances and resizing, and `hapticSelect()` / `hapticSuccess()` from `src/utils/haptics.ts`. Reanimated shared values use `.get()` / `.set()` (React Compiler is on). Everything honors reduce-motion.
- Data hooks (`useParty`, `useParties`, `useProfileStats`, `useLeaderboard`) refetch silently on screen focus — keep that when adding hooks.
- Brand artwork (icon, splash, favicon) is generated: edit the mark in `scripts/generate-brand-assets.mjs`, run `node scripts/generate-brand-assets.mjs` (macOS), and mirror geometry/color changes in `src/components/ui/BrandMark.tsx`. Don't hand-edit the PNGs.
- Use the `Input` component for text fields, keep touch targets ≥ 44dp, and confirmations use `ConfirmDialog` — never `window.confirm`/`Alert.alert` (broken on web).
- All user-facing strings go in `src/i18n/en.ts` and `es.ts` (same keys) and are used via `t()`. Spanish copy is casual second person ("tú").
