# Drinkava — DESIGN.md

**Direction: Midnight Garnet** — luxury-minimal nightlife. Restrained, dark-first, one deep rose accent, generous space, quiet type. Visually calm, verbally warm.

Single source of truth for Drinkava's visual language. Format: 9-section DESIGN.md (`.claude/skills/00-design-references/design-md-format.md`), adapted for React Native / Expo — values are dp and RN style props, not CSS.

**Status:** shipped in `src/theme` and the shared components (✅). The few items still open are marked ◻ and listed in Appendix A. Always build with `useTheme()` — never hardcode hex in a component.

Aesthetic base (read for structure, not copied): **Apple** (reductive; chromatic accent reserved for interactive elements; separate accent values for fills vs. text on light/dark; pill CTAs; SF system font) and **Stripe** (light display weights that "don't need to shout"; warm-tinted neutrals instead of pure black/white; conservative radii).

## 1. Visual Theme & Atmosphere

Drinkava is where a night out gets remembered — photos, toasts, friends. The interface should recede like a gallery wall: near-black surfaces with a faint warm cast, ivory text, and one deep garnet-rose reserved for the things you can act on. Nothing glows, nothing competes with the faces and photos. The previous neon-magenta energy is replaced by the confidence of a dim, well-run bar: low light, good material, nothing shouting.

Luxury here is **restraint and space**, not ornament. Titles are set in lighter weights with tight tracking (the display wordmark is a whisper, not a banner); cards are flat panels separated by a hairline; spacing is one step more generous than a utility app would use; the accent appears rarely enough that every appearance means "this is tappable or selected." The voice stays friendly and casual (“tú”) — quiet visuals, warm words.

**Key characteristics**
- Dark-first; light theme is a warm-paper mirror, not an afterthought
- One accent (garnet rose), used **only** for actions, selection, links, active state
- Warm-tinted neutrals: ivory `#F4F1EC` text on near-black, never pure `#000`/`#FFF` text
- Flat tonal depth: three surface steps + hairline borders; no shadows, no gradients
- System font (SF Pro / Roboto) with light–semibold weights and negative tracking on titles
- Pill primary buttons, 16dp cards, 24dp sheets
- Photography and people are the color; UI chrome stays neutral
- Category color survives, but desaturated and contrast-tuned per theme

## 2. Color Palette & Roles

Always read from `useTheme().colors`.

### Accent
| Role | Value | Status | Usage |
|------|-------|--------|-------|
| accentPrimary | `#C8244F` | ✅ | **Fills & borders**: primary button, selected segment, active "+" pill, checkbox, calendar selection. White on it: 5.50:1 |
| accentText | dark `#FF6B8E` · light `#C8244F` | ✅ | **Text & icons** in accent: links, active tab, kudos given, spinners |
| accentPrimaryMuted | dark `#C8244F22` · light `#C8244F14` | ✅ | Tint behind accent chips / icon circles (alpha tuned for ≥ 4.5:1 text) |

Rule: *fill → `accentPrimary`, foreground → `accentText`.* A single pink cannot be both a surface under white text and small text on near-black, so the system carries two values (the same split Apple uses for CTA blue vs. link blue).

### Neutrals
| Role | Dark | Light | Status |
|------|---------------|----------------|--------|
| background | `#0A0A0B` | `#F7F5F2` | ✅ |
| surface | `#131316` | `#FFFFFF` | ✅ |
| surfaceElevated | `#1A1A1F` | `#FFFFFF` | ✅ |
| textPrimary | `#F4F1EC` | `#16141A` | ✅ |
| textSecondary | `#9C98A1` | `#6A6670` | ✅ |
| border (decorative hairline) | `#26262B` | `#E6E2DC` | ✅ |
| borderStrong (input boundaries) | `#68656F` | `#8A8690` | ✅ new |

### Semantic (per theme — text/icon values; verified ≥ 4.5:1 on all surfaces and on their own tints)
| Role | Dark | Light | Status |
|------|------|-------|--------|
| success | `#2ED573` | `#197E43` | ✅ light new |
| warning | `#FFB020` | `#9A6400` | ✅ light new |
| info | `#428EFF` | `#0062F5` | ✅ |
| danger (text) | `#E9676B` | `#C0343A` | ✅ token new |
| danger (fill, white label) | `#C0343A` | `#C0343A` | ✅ token new |

### Category colors (text/icon/border; per theme)
| Hue | Used for | Dark | Light |
|-----|----------|------|-------|
| amber | beer · challenge *bebida* | `#F5A623` | `#976107` |
| violet | cocktail · challenge *social_premium* | `#C961FF` | `#A500FA` |
| orange | shot | `#FF6B4A` | `#D42700` |
| wine | wine | `#EF5B7F` | `#B8123B` |
| steel | other drink | `#5295DB` | `#2871BE` |
| info-blue | challenge *social* | = info | = info |
| green | challenge *fisico* | = success | = success |

Tints: category color at alpha `22` (dark) / `14` (light) for chip and icon-circle backgrounds. Scrims: `#00000066` (sheets), `#00000088` (dialogs).

### Contrast (WCAG 2.1, computed with `contrast-check.js`)
| Pair | Ratio | Result |
|------|-------|--------|
| white on accentPrimary `#C8244F` | 5.50:1 | AA ✅ shipped |
| accentText dark `#FF6B8E` on bg / surface / elevated | 7.30 / 6.84 / 6.39:1 | AA |
| accentText light `#C8244F` on `#FFFFFF` / `#F7F5F2` | 5.50 / 5.05:1 | AA |
| accent text on its own tint — dark (`22` over surface / elevated) / light (`14` over white) | 6.30 / 5.89 / 4.87:1 | AA |
| every category & semantic color on its own tint — dark (`22`, over surface) | 4.88 – 7.91:1 | AA |
| every category & semantic color on its own tint — light (`14`, over white) | 4.52 – 5.77:1 | AA |
| textPrimary dark `#F4F1EC` on bg / elevated | 17.57 / 15.39:1 | AAA |
| textSecondary dark `#9C98A1` on surface / elevated | 6.55 / 6.12:1 | AA |
| textPrimary light `#16141A` on page | 16.79:1 | AAA |
| textSecondary light `#6A6670` on page / white | 5.15 / 5.60:1 | AA |
| white on danger fill `#C0343A` | 5.54:1 | AA |
| danger text dark `#E9676B` on surface / elevated | 5.84 / 5.46:1 | AA |
| borderStrong dark `#68656F` on surface / elevated | 3.25 / 3.04:1 | UI ≥ 3 |
| borderStrong light `#8A8690` on white / page | 3.56 / 3.27:1 | UI ≥ 3 |


## 3. Typography Rules

**Font:** platform system font (SF Pro on iOS, Roboto on Android/web) — **deliberate and consistent with the Apple base**. Do not add a custom family and do not apply the website skills' "banned fonts" rule here. Character comes from weight, tracking and scale.

| Token | Size | Weight | Line height | Tracking | Status | Used for |
|-------|------|--------|-------------|----------|--------|----------|
| display | 40 | 300 | 44 | −1.0 | ✅ | Wordmark, hero numerals. Weight 300 only at ≥ 36 |
| h1 | 28 | 600 | 34 | −0.6 | ✅ | Screen titles, big stats |
| h2 | 21 | 600 | 27 | −0.3 | ✅ | Party name, section titles |
| h3 | 17 | 600 | 23 | −0.2 | ✅ | Card & sheet titles |
| body | 15 | 400 | 22 | −0.1 | ✅ | Paragraphs, inputs |
| bodyBold | 15 | 600 | 22 | −0.1 | ✅ | Names, button labels |
| caption | 13 | 400 | 18 | 0 | ✅ | Labels, metadata, links |
| eyebrow | 11 | 600 | 14 | +0.8, UPPERCASE | ✅ new | Section labels, category tags |
| tiny | 11 | 500 | 15 | 0 | ✅ | Chips, timestamps |

Rules: nothing below 11; weight ≥ 600 for anything under 17 that must stay prominent (light weights vanish on dark at small sizes); Spanish runs ≈ 15–30% longer than English — never fix widths.

## 4. Component Stylings

| Component | Spec |
|-----------|---------------|
| **Button — primary** | Fill `accentPrimary`, label `#FFFFFF` bodyBold, height 52, **pill**, no border, pressed opacity 0.9, disabled 0.4 |
| **Button — secondary** | Transparent, 1 × `borderStrong`, label textPrimary, pill, height 52 |
| **Button — ghost** | No fill/border, label `accentText` |
| **Button — danger** | Fill danger `#C0343A`, label `#FFFFFF`, pill |
| **Card** | `surface`, 1 hairline `border`, radius 16, padding 20, no tint; challenge cards use category border |
| **Chip** | Pill, `tiny`, padding 10 × 3, tint = color @ `22`/`14`, text = category/semantic color |
| **Input** | Min height 48, radius 12, `surfaceElevated` fill, 1 × `borderStrong`; placeholder textSecondary. ◻ Custom focus border (`accentText`) not implemented — platform default today |
| **Segmented control** | Track `surfaceElevated`, radius 12, padding 4; active segment `accentPrimary` + white label; radius 8 |
| **Bottom sheet** | `surface`, top radius 24, `maxHeight` 85%, padding 24, scrim `#00000066`, grab affordance optional, always scrollable |
| **Dialog** (`ConfirmDialog`) | Centered, maxWidth 360, `surface`, radius 24, padding 24, scrim `#00000088`; two equal pill buttons |
| **Tab bar** | `surface`, hairline top, active `accentText`, inactive textSecondary; center "+" = 48dp `accentPrimary` pill |
| **Avatar** | Circle; fallback = initials 600 in `textPrimary` on a `border`-tone fill (accent reserved for interactive; `border` rather than `surfaceElevated` so it still reads on white cards in light mode) |
| **Drink tile** | 80 × 80, radius 16, hairline border; selected = category color border + `1A` tint |
| **Disclaimer banner** | warning tint `1A`, radius 12, `tiny`; required on feed + logging screens |
| **Empty state** | 40dp outline icon textSecondary, h3 title, body description, vertical padding 64 |
| **Collapsible** | Whole header row tappable, chevron swaps, content mounts only when open |
| **Option row** (theme/language) | Equal-width pills, gap 8, active = `accentPrimary` + white label |


## 5. Layout Principles

**Base unit 4.** Scale: xs 4 · sm 8 · md 16 · inset 20 *(new)* · lg 24 · xl 32 · xxl 48 · xxxl 64 *(new)*.
**Radius:** sm 6 · md 12 (inputs, segmented tracks) · lg 16 (cards) · xl 24 (sheets, dialogs) · pill 999 (buttons, chips, avatars). Inner segment radius = md − 4 (concentric).

Rhythm — *one step more space than today*:
- Screen gutters: lg (24) for forms/onboarding, md (16) → **inset (20)** for feeds
- Card padding: inset (20); gap between cards: md (16)
- Between a title and its content: sm (8); between sections: xl (32)
- Separate with space first, hairlines second, boxes last
- Safe areas via `SafeAreaView` (`edges` per screen)

## 6. Depth & Elevation

Flat, tonal — no shadows (Apple's "no gradients, no textures" discipline).

| Level | Treatment | Used by |
|-------|-----------|---------|
| 0 | `background` | Screens |
| 1 | `surface` + hairline `border` | Cards, tab bar |
| 2 | `surfaceElevated` | Inputs, secondary surfaces, segmented tracks |
| 3 | Scrim + `surface` panel | Sheets, dialogs |

Optional enhancement (iOS only, fallback to solid `surface`): translucent tab bar / sheets via `expo-glass-effect`.

## 7. Do's and Don'ts

### Do
1. Reserve the accent for what is tappable or selected — if it's decorative, make it neutral.
2. Use `accentPrimary` for fills and `accentText` for text/icons; never swap them.
3. Let photos and avatars carry color; keep chrome neutral.
4. Use ivory/ink neutrals (`#F4F1EC` / `#16141A`) — never pure black or white text.
5. Titles in 300–600 weights with the tracking in §3; reserve 300 for ≥ 36dp.
6. Add space before adding a divider; add a divider before adding a box.
7. Keep every string in `src/i18n` (es + en, same keys) and the copy casual.
8. Use `ConfirmDialog` for destructive confirmations and show errors — never fail silently.
9. Keep touch targets ≥ 44dp; keep the responsibility banner on feed/logging screens.
10. Check dark **and** light, Spanish **and** English.

### Don't
1. No neon, no glow, no drop shadows, no gradients.
2. No second accent hue; category colors are data labels, not decoration.
3. No accent on scores, avatar initials, headings or decorative icons.
4. No custom font family; no weight 800 anywhere new.
5. No rounded-everything: pills are for actions and chips; panels are 16/24.
6. Don't hardcode hex in components (existing `#E5484D`/`#FFFFFF` uses are debt).
7. Don't rank or celebrate sheer drinking volume — variety, attendance and kudos only.
8. Don't use `window.confirm`, `Alert.alert` (invisible on web) or `Linking.canOpenURL` as a web capability check.

### Slop test (adapted)
If it could be any neon "party app" template — purple-pink gradient, glowing buttons, emoji-everything — it's wrong. It should feel like a dim, expensive room: dark, quiet, one garnet accent, people first.

## 8. Responsive Behavior

Fluid React Native — no CSS breakpoints. Phone portrait first; web preview must hold at ~400dp and on desktop.

- Single column; side-by-side only for paired actions and stat tiles (`flex: 1`)
- Dialog max 360dp, breakdown card max 400dp, sheets max 85% height and scroll
- ◻ Feeds on wide screens: cap content width at 560dp and center (not implemented yet)
- Touch targets ≥ 44dp. Undersized today: quantity stepper 40, time stepper 32, photo-remove 28
- Sheets with inputs use `KeyboardAvoidingView` (iOS `padding`)

## 9. Agent Prompt Guide

### Quick reference
- Accent fill `#C8244F` · accent text dark `#FF6B8E` / light `#C8244F`
- Dark: bg `#0A0A0B` · surface `#131316` · elevated `#1A1A1F` · text `#F4F1EC` · secondary `#9C98A1` · border `#26262B`
- Light: bg `#F7F5F2` · surface `#FFFFFF` · text `#16141A` · secondary `#6A6670` · border `#E6E2DC`
- Radius 6/12/16/24/pill · Spacing 4/8/16/20/24/32/48/64 · system font, 300–600

### Prompts
**Screen:** “Build the screen on `colors.background` with 20dp gutters. Title in `h1` (28/600, −0.6). Group content in 16dp-radius `Card`s with 20dp padding and a hairline border, 16dp apart. One primary pill `Button` at the bottom; everything else neutral. All values from `useTheme()`; strings via `t()` in both locales.”

**Sheet:** “Transparent `Modal`, slide, scrim `#00000066`, `surface` panel with 24dp top radii, `maxHeight: '85%'`, `ScrollView` padding 24, `h3` title, primary pill button last.”

**Destructive action:** “Secondary pill button → `ConfirmDialog` (`destructive`, danger fill `#C0343A`) → service call in try/catch → translated error on failure.”

**Status:** “`Chip` with the per-theme semantic color (success/info/danger/warning) at 14–22% tint; label from `t('…status.<state>')`. No accent color for status.”

## Appendix A — Implementation status

All palette, type, spacing, radius and component tokens in this document are shipped in `src/theme/*` and the shared components (`Button`, `Card`, `Chip`, `Avatar`, `ConfirmDialog`, sheets, inputs). Per-theme semantic and category colors are served through `useTheme()` (`drinkTypeColors`, `challengeCategoryColors`, `accentSuccess/Warning/Info`, `danger`, `dangerText`); tint backgrounds use `colors.tintAlpha`.

| Token / rule | Value | Status |
|--------------|-------|--------|
| accentPrimary / accentText / accentPrimaryMuted | `#C8244F` · dark `#FF6B8E` / light `#C8244F` · `22` / `14` alpha | ✅ |
| Neutrals (background, surface, elevated, text, border, borderStrong) | §2 | ✅ |
| Semantic + category colors, per theme | §2 | ✅ |
| danger / dangerText tokens (no more hardcoded `#E5484D`) | `#C0343A` · dark `#E9676B` | ✅ |
| Type scale incl. `eyebrow` | §3 | ✅ |
| Radius 6/12/16/24/pill, spacing + `inset` 20, `xxxl` 64 | §5 | ✅ |
| Pill buttons (52dp), filled inputs (48dp), 80dp drink tiles, 48dp tab action | §4 | ✅ |
| Accent removed from scores, avatar fallback, hero/trophy/achievement icons | §7 | ✅ |

**Not yet implemented (◻):**
- Input focus state (`accentText` border) — uses the platform default
- Content max-width (560dp) on wide screens
- Touch targets below 44dp: quantity stepper 40, time stepper 32, photo-remove badge 28
- Optional translucent tab bar / sheets via `expo-glass-effect`
- `eyebrow` is applied to Settings and Safe Mode section labels only; other small section labels still use `caption`
