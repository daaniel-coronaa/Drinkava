# Drinkava — DESIGN.md

The shipped design system for the Drinkava app (React Native / Expo). Direction: **Spritz Noir** — a dim bar at night with one warm orange glow. Minimal, elegant, and inviting: near-black surfaces, warm ivory text, and a single spritz-orange accent that always means "you can tap this".

Build with `useTheme()` tokens (`src/theme`), never hardcoded hex. Screens never invent colors.

## 1. Visual Theme & Atmosphere

- **Purpose**: friends logging drinks during a party one of them created. The app is used one-handed, in the dark, with a drink in the other hand — so every screen has **one obvious primary action**, big targets, and almost no chrome.
- **Mood**: calm dark room, one lit orange thing. Generous space, hairline borders, no shadows. Light theme is warm paper (`#F7F5F2`), same single accent.
- **Memorable thing**: the orange is the only color that asks for a tap — buttons, selected states, the "+" — so the UI explains itself without labels.
- **Motion**: springy, short, staggered. Things rise in, presses squish, the segmented pill slides, bubbles rise in the brand mark. Always honors "reduce motion".

### Brand mark
A "D" with a heavy stem, hairline bowl, and four bubbles rising inside it, in an apricot → deep-orange foil gradient (`#FFC08A → #FF8A3D → #E8601C` on dark; `#EE7433 → #E8601C → #A94408` on light). Source of truth: `scripts/generate-brand-assets.mjs` (generates icon, splash, adaptive icon, favicon). Runtime version: `src/components/ui/BrandMark.tsx` (`animated` adds the rising bubbles + warm glow; welcome screen only). Mirror geometry/color changes in both.

## 2. Color Palette & Roles

A deliberately tiny palette: **neutrals + one accent + two meanings (success, danger)**. Nothing else — no per-category or per-drink colors.

### House accent — spritz orange
| Token | Dark | Light | Use |
|---|---|---|---|
| `accentPrimary` | `#FF8A3D` | `#E8641F` | fills (buttons, selected segment, "+"), borders of selected things |
| `onAccent` | `#16141A` | `#16141A` | label/icon **on** an accent fill — ink, never white |
| `accentText` | `#FF8A3D` | `#A94408` | accent-colored text and icons on plain surfaces |
| `accentPrimaryMuted` | `#FF8A3D22` | `#E8641F14` | quiet selected backgrounds |

Orange means *tappable / selected / yours*. Not status, not scores, not decoration.

### Neutrals
| Token | Dark | Light |
|---|---|---|
| `background` | `#0A0A0B` | `#F7F5F2` |
| `surface` | `#131316` | `#FFFFFF` |
| `surfaceElevated` | `#1A1A1F` | `#FFFFFF` |
| `textPrimary` | `#F4F1EC` | `#16141A` |
| `textSecondary` | `#9C98A1` | `#6A6670` |
| `border` | `#26262B` | `#E6E2DC` |
| `borderStrong` | `#68656F` | `#8A8690` |

### Meaning
| Token | Dark | Light | Use |
|---|---|---|---|
| `accentSuccess` | `#2ED573` | `#197E43` | live badge, completed |
| `danger` | `#C0343A` | `#C0343A` | destructive **fill** (white label) |
| `dangerText` | `#E9676B` | `#C0343A` | destructive text/icons, errors |

`tintAlpha` (`22` dark / `14` light) is the hex alpha appended to a color for soft tinted backgrounds, e.g. `` `${colors.accentPrimary}${colors.tintAlpha}` ``.

### Contrast (WCAG 2.1, computed)
| Pair | Ratio |
|---|---|
| Dark text / background | 17.6 |
| Dark secondary text / background · surface · elevated | 7.0 · 6.6 · 6.1 |
| Dark accent text / background · surface | 8.4 · 7.9 |
| Ink on spritz (dark fill) | 7.8 |
| Dark success / surface | 9.6 |
| Dark dangerText / surface | 5.8 |
| White on danger | 5.5 |
| Light text / background | 16.8 |
| Light secondary text / background · white | 5.2 · 5.6 |
| Light accent text / white · background | 6.0 · 5.5 |
| Ink on light spritz fill | 5.5 |
| Light success / white | 5.1 |
| Light danger / white | 5.5 |
| `borderStrong` / background (non-text, ≥ 3:1) | 3.5 dark · 3.3 light |

All text pairs ≥ 4.5:1; non-text boundaries ≥ 3:1.

## 3. Typography Rules

Two families, both loaded in the root layout (`FontAssets`) which gates first paint:
- **Fraunces** (soft-serif, high character) — titles and numerals only, ≥ 18dp. Tokens carry `fontVariant: ['lining-nums']`.
- **DM Sans** — everything else: UI, body, labels.

Weight lives in the family name (`Fraunces_600SemiBold`, `DMSans_500Medium`) — **never set `fontWeight`** on these.

| Token | Font | Size / line | Notes |
|---|---|---|---|
| `display` | Fraunces 500 | 44 / 50 | −0.8 tracking; welcome wordmark |
| `h1` | Fraunces 600 | 30 / 36 | −0.5; screen/party titles |
| `h2` | Fraunces 600 | 23 / 29 | −0.3 |
| `h3` | Fraunces 600 | 18 / 24 | −0.15 |
| `body` | DM Sans 400 | 16 / 24 | |
| `bodyBold` | DM Sans 600 | 16 / 24 | |
| `caption` | DM Sans 400 | 14 / 20 | |
| `eyebrow` | DM Sans 600 | 11 / 16 | +1.2 tracking, uppercase — section labels |
| `tiny` | DM Sans 500 | 12 / 16 | |

Tab labels need `lineHeight: 13`; header titles are styled once in the root Stack `headerTitleStyle`.

## 4. Component Stylings

- **Button** (`ui/Button`): pill, min height 52. `primary` = `accentPrimary` fill + `onAccent` label; `secondary` = transparent + `borderStrong` border; `ghost` = `accentText` text; `danger` = `danger` fill + white. Built on `PressableScale`.
- **PressableScale** (`ui/PressableScale`): Pressable with a spring scale to 0.97 on press. Use for any custom tappable (icon buttons, chips, rows).
- **Segmented** (`ui/Segmented`): generic `<Segmented<K> options value onChange />`. Track + sliding spring indicator (accent fill, `onAccent` label), 44dp segments, haptic on change. Used for the parties filter, party sections, theme and language. Replaces every hand-rolled pill row.
- **ActionSheet** (`ui/ActionSheet`): bottom sheet of 56dp rows (`SheetAction { key, label, icon, onPress, destructive? }`). Home of secondary/destructive actions so screens keep one primary CTA — e.g. the party's "···" menu (configure challenges, end party, leave).
- **Card**: `surface` fill, hairline `border`, radius `lg`, no shadow.
- **Chip**: neutral by default; `accent` tone only for selected/yours.
- **Input**: always use `ui/Input` (eyebrow label, `surface` field, `borderStrong` on focus).
- **ConfirmDialog**: every confirmation. Never `Alert.alert`/`window.confirm` (broken on web).
- **Icon buttons**: 44×44 hit area, plain `textPrimary` outline icons. The Parties header has two: add friends (`account-multiple-plus-outline`) and join by invite code (`ticket-confirmation-outline`).
- **Bottom tabs**: three tabs, center "+" is a 48dp accent circle that opens an `ActionSheet` (Log a drink / Create a party). Tab switches fade.

## 5. Layout Principles

- Spacing tokens: `xs4 sm8 md16 inset20 lg24 xl32 xxl48 xxxl64`. Screen gutter is `inset` (20).
- Radii: `sm6 md12 lg16 xl24 pill`.
- App column is `ContentMaxWidth = 560`, centered, so web/tablet reads as a phone-width column; sheets use `useSheetFrame()` to match.
- One primary action per screen. Anything secondary goes in an `ActionSheet`.
- Touch targets ≥ 44dp.

## 6. Depth & Elevation

Flat. Depth comes from the surface ramp (`background → surface → surfaceElevated`) and hairline borders, never shadows. Sheets use a 40%-black backdrop. The only glow is the warm radial behind the brand mark on the welcome screen.

## 7. Do's and Don'ts

### Do
- Use `accentPrimary` + `onAccent` for the single most important action per screen.
- Reveal lists with `enter(index)` (staggered), reorder/resize with `smoothLayout`, press with `PressableScale`, confirm with a light haptic (`hapticSelect`) or `hapticSuccess`.
- Keep copy short and casual (Spanish uses "tú").
- Refetch on focus (`useFocusEffect`, silent) so returning to a screen shows fresh data.

### Don't
- Don't add colors: no per-drink, per-category, or "premium" hues. Use neutrals and the one accent.
- Don't put white text on the accent fill — it's ink.
- Don't set `fontWeight` on Fraunces/DM Sans; don't use Fraunces below 18dp.
- Don't stack more than one filled button on a screen.
- Don't animate without `ReduceMotion.System`; keep springs short — nothing bouncy or slow.

### Slop test
If you can swap in another app's name and the screen still works, it's too generic. The orange-on-near-black, serif titles, and rising bubbles are the identity — keep them.

## 8. Responsive Behavior

Phone-first. Above 560dp the content column stays 560 wide, centered on `background`. Bottom sheets and the tab bar use the same column. Layouts are single-column; nothing relies on hover.

## 9. Agent Prompt Guide

### Quick reference
- Accent: spritz orange `#FF8A3D` (dark) / `#E8641F` fill + `#A94408` text (light); ink label `#16141A`.
- Surfaces: `#0A0A0B / #131316 / #1A1A1F` dark · `#F7F5F2 / #FFFFFF` light.
- Fonts: Fraunces (titles, numerals) + DM Sans (UI).
- Primitives: `Button`, `PressableScale`, `Segmented`, `ActionSheet`, `Card`, `Chip`, `Input`, `ConfirmDialog`.
- Motion helpers: `src/theme/motion.ts` (`enter`, `fadeIn`, `smoothLayout`); haptics: `src/utils/haptics.ts`.

### Prompts
- "Add a screen: Fraunces `h1` title, one `Button` primary action, secondary actions in an `ActionSheet`, list items wrapped in `Animated.View entering={enter(index)}`."
- "Add a filter: use `Segmented`, never a hand-built pill row."
- "Add a status: use `accentSuccess` or `dangerText` — never a new color."
