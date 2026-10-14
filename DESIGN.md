# Drinkava — DESIGN.md

**Direction: Noir Champagne** — luxury-minimal nightlife. Near-black rooms, warm ivory text, one house color in champagne gold, editorial serif titles. Visually calm, verbally warm.

Single source of truth for Drinkava's visual language, fully shipped in `src/theme/*`, the shared components and the screens. Format: 9-section DESIGN.md (`.claude/skills/00-design-references/design-md-format.md`) adapted for React Native / Expo — values are dp and RN style props, not CSS. Always build with `useTheme()`; never hardcode hex in a component.

Aesthetic base (read for structure, not copied): **Apple** (reductive; one chromatic color; separate values for fills vs. text on light/dark; pill CTAs) and **Stripe** (light, confident display type; warm-tinted neutrals instead of pure black/white; conservative radii).

## 1. Visual Theme & Atmosphere

Drinkava is where a night out gets remembered — photos, toasts, friends. The interface should feel like a private members' bar after dark: near-black surfaces with a faint warm cast, ivory type, and a single note of champagne gold — the color of lettering on a good bottle — reserved for what you can act on and what you've earned. Nothing glows, nothing competes with the faces and photos.

Luxury here is **restraint, space and typography**. Titles are set in a high-contrast serif (Playfair Display) the way a wine list or a fashion masthead would; everything you read or tap is a clean geometric sans (Jost). Cards are flat panels separated by a hairline, spacing is one step more generous than a utility app, and the gold appears rarely enough that every appearance means "this is for you." The voice stays friendly and casual (“tú”) — quiet visuals, warm words.

**Key characteristics**
- Dark-first; light theme is a warm-paper mirror with brass and bronze in place of champagne
- One house color — champagne gold — for actions, selection, links, and premium/earned marks
- Gold is light, so filled gold surfaces carry a **dark ink label**, never white
- Warm-tinted neutrals: ivory `#F4F1EC` on near-black; never pure `#000`/`#FFF` text
- Serif titles and numerals, sans UI text; no weight 800, no heavy system bold
- Flat tonal depth: three surface steps + hairline borders; no shadows, gradients or glass
- Pill buttons, 16dp cards, 24dp sheets
- Photography and people are the color; UI chrome stays neutral
- Category color survives as data labels, contrast-tuned per theme

**Considered and rejected for the house color:** emerald (collides with the success green and "En vivo" badges), sapphire (collides with info/social blue), burgundy (reads as the previous pink in dark mode), ivory-only (no brand memory).

## 2. Color Palette & Roles

Always read from `useTheme().colors`.

### House color — champagne gold
| Role | Dark | Light | Usage |
|------|------|-------|-------|
| accentPrimary | `#D9B877` champagne | `#A98530` brass | **Fills & borders**: primary button, selected segment, active "+" pill, checkbox, calendar selection, switch-on track |
| onAccent | `#16141A` ink | `#16141A` ink | **Label/icon on an accentPrimary fill** — ink on gold, never white |
| accentText | `#D9B877` | `#7D5A0F` bronze | **Text & icons** in gold: links, active tab, kudos given, focus border, spinners, crown, unlocked badges |
| accentPrimaryMuted | `#D9B87722` | `#A9853014` | Tint behind gold chips and icon circles (alpha tuned for ≥ 4.5:1 text) |

Rules: *fill → `accentPrimary` + `onAccent`; foreground → `accentText`.* Gold is the house color: it marks things you can tap **and** premium/earned things (crown, premium challenges, unlocked badges). It is never used for status (success/warning/danger have their own colors) and never decorates scores or avatars.

### Neutrals
| Role | Dark | Light |
|------|------|-------|
| background | `#0A0A0B` | `#F7F5F2` |
| surface | `#131316` | `#FFFFFF` |
| surfaceElevated | `#1A1A1F` | `#FFFFFF` |
| textPrimary | `#F4F1EC` | `#16141A` |
| textSecondary | `#9C98A1` | `#6A6670` |
| border (decorative hairline) | `#26262B` | `#E6E2DC` |
| borderStrong (input & secondary-button boundaries) | `#68656F` | `#8A8690` |

### Semantic (per theme — text/icon values; verified ≥ 4.5:1 on all surfaces and on their own tints)
| Role | Dark | Light |
|------|------|-------|
| success | `#2ED573` | `#197E43` |
| warning | `#FFB020` | `#9A6400` |
| info | `#428EFF` | `#0062F5` |
| danger (text) | `#E9676B` | `#C0343A` |
| danger (fill, white label) | `#C0343A` | `#C0343A` |

### Category colors (text/icon/border; per theme)
| Hue | Used for | Dark | Light |
|-----|----------|------|-------|
| orange | shot · challenge *bebida* | `#FF6B4A` | `#D42700` |
| amber | beer | `#F5A623` | `#976107` |
| violet | cocktail | `#C961FF` | `#A500FA` |
| wine | wine | `#EF5B7F` | `#B8123B` |
| steel | other drink | `#5295DB` | `#2871BE` |
| info-blue | challenge *social* | = info | = info |
| green | challenge *fisico* | = success | = success |
| gold | challenge *social_premium* | = accentText | = accentText |

Challenge *bebida* deliberately reuses the shot orange (not beer amber) so it never reads as the gold house color. Tints: category color at alpha `22` (dark) / `14` (light). Scrims: `#00000066` (sheets), `#00000088` (dialogs).

### Contrast (WCAG 2.1, computed)
| Pair | Ratio | Result |
|------|-------|--------|
| onAccent ink on gold fill — dark `#D9B877` | 9.64:1 | AAA |
| onAccent ink on brass fill — light `#A98530` | 5.30:1 | AA |
| accentText dark on bg / surface / elevated | 10.43 / 9.78 / 9.14:1 | AAA |
| accentText dark on its own `22` tint (over surface / elevated) | 7.62 / 7.00:1 | AAA |
| accentText light bronze on white / paper | 6.28 / 5.78:1 | AA |
| accentText light bronze on brass `14` tint (over white) | 5.78:1 | AA |
| gold fill vs surface — dark (UI boundary) | 9.78:1 | UI ≥ 3 |
| brass fill vs white / paper — light (UI boundary) | 3.45 / 3.17:1 | UI ≥ 3 |
| textPrimary dark `#F4F1EC` on bg / elevated | 17.57 / 15.39:1 | AAA |
| textSecondary dark `#9C98A1` on surface / elevated | 6.55 / 6.12:1 | AA |
| textPrimary light `#16141A` on page | 16.79:1 | AAA |
| textSecondary light `#6A6670` on page / white | 5.15 / 5.60:1 | AA |
| white on danger fill `#C0343A` | 5.54:1 | AA |
| danger text dark `#E9676B` on surface / elevated | 5.84 / 5.46:1 | AA |
| category & semantic colors on their own tints — dark (`22`, over surface) | 4.88 – 7.91:1 | AA |
| category & semantic colors on their own tints — light (`14`, over white) | 4.52 – 5.77:1 | AA |
| borderStrong dark on surface / elevated | 3.25 / 3.04:1 | UI ≥ 3 |
| borderStrong light on white / page | 3.56 / 3.27:1 | UI ≥ 3 |

## 3. Typography Rules

**Pairing:** **Playfair Display** (high-contrast serif) for titles and numerals · **Jost** (geometric sans) for all UI text. Loaded with `expo-font` from `@expo-google-fonts/*`; the first paint waits for the fonts (falls back to the system font if loading fails). Neither family is on the banned list; this replaces the earlier system-font decision, which read as "tech app" rather than "house".

Custom families encode their weight in the family name, so tokens set **no `fontWeight`** (Android won't synthesize it). Serif tokens set `fontVariant: ['lining-nums']` so stat numerals stay even.

Source: `src/theme/fonts.ts`, `src/theme/typography.ts` (`useTheme().typography`).

| Token | Family | Size | Line | Tracking | Used for |
|-------|--------|------|------|----------|----------|
| display | Playfair 400 | 42 | 48 | −0.6 | Wordmark, hero |
| h1 | Playfair 600 | 30 | 36 | −0.4 | Screen titles, big stat numerals |
| h2 | Playfair 600 | 23 | 29 | −0.2 | Party name, section titles |
| h3 | Playfair 600 | 18 | 24 | −0.1 | Card & sheet titles, scores |
| body | Jost 400 | 16 | 24 | 0 | Paragraphs, inputs |
| bodyBold | Jost 600 | 16 | 24 | 0 | Names, button labels |
| caption | Jost 400 | 14 | 20 | 0 | Metadata, links, chip labels (lg) |
| eyebrow | Jost 600 | 11 | 16 | +1.4, UPPERCASE | Section & form-field labels |
| tiny | Jost 500 | 12 | 16 | 0 | Chips, timestamps |

Rules: serif only at ≥ 18 and only for titles/numerals; Jost sets small for its size, hence body 16 / caption 14; uppercase appears only in `eyebrow`; Spanish runs ≈ 15–30% longer than English — never fix text widths. Navigation chrome is set explicitly: stack header titles Playfair 600 / 18, tab labels Jost 500 / 11 (line height 13 so the label fits the bar).

## 4. Component Stylings

| Component | Spec |
|-----------|------|
| **Button — primary** | Fill `accentPrimary`, label `onAccent` bodyBold, min height 52, **pill**, no border, pressed opacity 0.9, disabled 0.4 |
| **Button — secondary** | Transparent, 1 × `borderStrong`, label textPrimary, pill |
| **Button — ghost** | No fill/border, label `accentText` |
| **Button — danger** | Fill danger `#C0343A`, label `#FFFFFF`, pill |
| **Card** | `surface`, 1 hairline `border`, radius 16, padding 20, no tint; challenge cards use category border |
| **Chip** | Pill, tint = color @ `22`/`14`, text = category/semantic color. `sm` (passive): `tiny`, padding 10 × 3. `lg` (tappable): `caption`, padding 16, **min height 44** |
| **Input** (`Input`) | Min height 48, radius 12, `surfaceElevated` fill, 1 × `borderStrong`; focus border → `accentText` (platform outline removed); placeholder textSecondary |
| **Segmented control** | Track `surfaceElevated`, radius 12, padding 4; segment 44dp tall, radius 8; active = `accentPrimary` + `onAccent` label |
| **Option row** (theme/language) | Equal-width pills, gap 8, 44dp tall, active = `accentPrimary` + `onAccent` label |
| **Switch** | Track off `borderStrong` / on `accentPrimary`, thumb `#FFFFFF` |
| **Bottom sheet** | `surface`, top radius 24, `maxHeight` 85%, padding 24, scrim `#00000066`, always scrollable; sits on the 560dp column (`useSheetFrame`) |
| **Dialog** (`ConfirmDialog`) | Centered, maxWidth 360, `surface`, radius 24, padding 24, scrim `#00000088`; two equal pill buttons |
| **Tab bar** | `surface`, hairline top, active `accentText`, inactive textSecondary; center "+" = 48dp `accentPrimary` pill with `onAccent` icon |
| **Avatar** | Circle; fallback = Jost 600 initials in `textPrimary` on a `border`-tone fill |
| **Drink tile** | 80 × 80, radius 16, hairline border; selected = category border (1.5) + tint |
| **Disclaimer banner** | warning tint `1A`, radius 12, `tiny`; required on feed + logging screens |
| **Empty state** | 40dp outline icon textSecondary, h3 title, body description, vertical padding 64 |
| **Collapsible** | Whole header row tappable, chevron swaps, content mounts only when open |

## 5. Layout Principles

**Base unit 4.** Scale: xs 4 · sm 8 · md 16 · inset 20 · lg 24 · xl 32 · xxl 48 · xxxl 64.
**Radius:** sm 6 · md 12 (inputs, segmented tracks) · lg 16 (cards) · xl 24 (sheets, dialogs) · pill 999 (buttons, chips, avatars). Inner segment radius = md − 4 (concentric).

Rhythm — one step more space than a utility app:
- Screen gutters: lg (24) for forms/onboarding, inset (20) for feeds
- Card padding: inset (20); gap between cards: md (16)
- Between a title and its content: sm (8); between sections: xl (32)
- Separate with space first, hairlines second, boxes last
- Safe areas via `SafeAreaView` (`edges` per screen)

## 6. Depth & Elevation

Flat, tonal — no shadows.

| Level | Treatment | Used by |
|-------|-----------|---------|
| 0 | `background` | Screens |
| 1 | `surface` + hairline `border` | Cards, tab bar |
| 2 | `surfaceElevated` | Inputs, secondary surfaces, segmented tracks |
| 3 | Scrim + `surface` panel | Sheets, dialogs |

**No translucent / glass surfaces** (`expo-glass-effect` is deliberately unused): text over blurred, changing content can't be guaranteed ≥ 4.5:1, which would break the contrast promise in §2.

## 7. Do's and Don'ts

### Do
1. Pair every gold fill with the `onAccent` ink label; use `accentText` for gold text and icons.
2. Keep gold rare: one primary action per screen region, plus selection, links and premium marks.
3. Let photos and avatars carry color; keep chrome neutral.
4. Set titles and numerals in the serif tokens, everything else in Jost.
5. Use ivory/ink neutrals (`#F4F1EC` / `#16141A`) — never pure black or white text.
6. Add space before adding a divider; add a divider before adding a box.
7. Keep every string in `src/i18n` (es + en, same keys) and the copy casual.
8. Use `ConfirmDialog` for destructive confirmations and show errors — never fail silently.
9. Keep touch targets ≥ 44dp; keep the responsibility banner on feed/logging screens.
10. Check dark **and** light, Spanish **and** English (longer strings, serif widths).

### Don't
1. No white text on gold or brass — it fails contrast.
2. No neon, no glow, no drop shadows, no gradients, no glass.
3. No second action color; category colors are data labels, not decoration.
4. No gold on scores, avatar initials, status, or decorative icons.
5. No serif below 18dp, no faux-bold system weights, no `fontWeight` with custom families.
6. No rounded-everything: pills are for actions and chips; panels are 16/24.
7. Don't hardcode hex in components; add a token.
8. Don't rank or celebrate sheer drinking volume — variety, attendance and kudos only.
9. Don't use `window.confirm`, `Alert.alert` (invisible on web) or `Linking.canOpenURL` as a web capability check.

### Slop test (adapted)
If it could be any neon "party app" template — purple-pink gradient, glowing buttons, emoji-everything, bold system sans — it's wrong. It should feel like a dim, expensive room: dark, quiet, one gold note, a serif masthead, people first.

## 8. Responsive Behavior

Fluid React Native — no CSS breakpoints. Phone portrait first; the web preview must hold at ~400dp and on desktop.

- Single column; side-by-side only for paired actions and stat tiles (`flex: 1`)
- The whole app is one centered column, max 560dp (`ContentMaxWidth`), with hairline edges when the window is wider; sheets follow the same column
- Dialog max 360dp, breakdown card max 400dp, sheets max 85% height and scroll
- Touch targets ≥ 44dp everywhere: steppers 44, segments/option rows 44, selectable chips `lg` 44, calendar day = whole cell, small icons/links get `hitSlop`
- Sheets with inputs use `KeyboardAvoidingView` (iOS `padding`)

## 9. Agent Prompt Guide

### Quick reference
- House color: fill dark `#D9B877` / light `#A98530` · label `#16141A` · text dark `#D9B877` / light `#7D5A0F`
- Dark: bg `#0A0A0B` · surface `#131316` · elevated `#1A1A1F` · text `#F4F1EC` · secondary `#9C98A1` · border `#26262B`
- Light: bg `#F7F5F2` · surface `#FFFFFF` · text `#16141A` · secondary `#6A6670` · border `#E6E2DC`
- Type: Playfair Display (titles/numerals) + Jost (UI) · Radius 6/12/16/24/pill · Spacing 4/8/16/20/24/32/48/64

### Prompts
**Screen:** “Build the screen on `colors.background` with 20dp gutters. Title in `h1` (Playfair 600 / 30). Group content in 16dp-radius `Card`s with 20dp padding and a hairline border, 16dp apart. One primary pill `Button` (gold fill, ink label) at the bottom; everything else neutral. All values from `useTheme()`; strings via `t()` in both locales.”

**Sheet:** “Transparent `Modal`, slide, scrim `#00000066`, `surface` panel framed with `useSheetFrame()`, 24dp top radii, `maxHeight: '85%'`, `ScrollView` padding 24, `h3` title, eyebrow section labels, primary pill button last.”

**Form:** “Use `Input` for every field (48dp, filled, strong border, gold focus border) with an `eyebrow` label above each.”

**Destructive action:** “Secondary pill button → `ConfirmDialog` (`destructive`, danger fill `#C0343A`, white label) → service call in try/catch → translated error on failure.”

**Status:** “`Chip` with the per-theme semantic color (success/info/danger/warning) at the tint alpha; label from `t('…status.<state>')`. Never gold for status.”

## Appendix A — Implementation status

Everything above is shipped.

| Area | Where |
|------|-------|
| Palette incl. `onAccent`, per-theme semantic/category colors, `danger`, `tintAlpha` | `src/theme/colors.ts` |
| Fonts + type scale | `src/theme/fonts.ts`, `src/theme/typography.ts`; loaded in `src/app/_layout.tsx` |
| Spacing, radius, `ContentMaxWidth` | `src/theme/spacing.ts` |
| Shared components (Button, Card, Chip, Input, Avatar, ConfirmDialog, sheets) | `src/components/ui/*` |
| Centered column + sheet framing | `src/app/_layout.tsx`, `src/hooks/useSheetFrame.ts` |

**Open items outside the design system:** the app icon, adaptive icon and splash screen are still the Expo template art (blue); they need a Drinkava mark drawn in champagne on near-black, then `app.json` splash/adaptive colors set to `#0A0A0B`.
