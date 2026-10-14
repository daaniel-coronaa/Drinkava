# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## Design

- **Read `DESIGN.md` before any UI work** — it defines the shipped design system (luxury-minimal "Midnight Garnet"): colors, type, spacing, components. Appendix A lists the few open items (◻). Build with `useTheme()` tokens, never hardcoded hex. Accent rule: fills use `accentPrimary`, text/icons use `accentText`; accent is reserved for tappable/selected things, not scores or decoration.
- The system font is intentional. The `frontend-design` / `design-system-generator` skills in `.claude/skills/` come from a *website* toolkit (CSS/Tailwind, "banned fonts"); use them for design thinking and for regenerating `DESIGN.md`, but this project's `DESIGN.md` wins wherever they disagree.
- All user-facing strings go in `src/i18n/en.ts` and `es.ts` (same keys) and are used via `t()`. Spanish copy is casual second person ("tú").
- Confirmations use `ConfirmDialog`, never `window.confirm`/`Alert.alert` (broken on web).
