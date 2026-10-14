# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## Design

- **Read `DESIGN.md` before any UI work** — it is the shipped design system ("Noir Champagne", luxury-minimal): colors, type, spacing, components. Build with `useTheme()` tokens, never hardcoded hex.
- House color is champagne gold: fills use `accentPrimary` **with the `onAccent` ink label (never white)**, text/icons use `accentText`. Gold marks tappable/selected and premium/earned things only — not status, scores or decoration.
- Type is Playfair Display (titles/numerals, ≥ 18dp) + Jost (all UI text), loaded in the root layout. Custom families carry their weight in the family name — don't set `fontWeight` on them. The `frontend-design` / `design-system-generator` skills in `.claude/skills/` come from a *website* toolkit (CSS/Tailwind); use them for design thinking and for regenerating `DESIGN.md`, but this project's `DESIGN.md` wins wherever they disagree.
- Use the `Input` component for text fields, keep touch targets ≥ 44dp, and confirmations use `ConfirmDialog` — never `window.confirm`/`Alert.alert` (broken on web).
- All user-facing strings go in `src/i18n/en.ts` and `es.ts` (same keys) and are used via `t()`. Spanish copy is casual second person ("tú").
