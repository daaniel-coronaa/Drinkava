import { Platform } from 'react-native';

// Platform system font (SF Pro on iOS, Roboto on Android/web) — deliberate, and the same
// choice as the Apple reference in DESIGN.md. Character comes from weight, tracking and
// scale: light-to-semibold titles with tight negative tracking, quiet body text.
// Weight 300 only at >= 36: light weights vanish on dark at small sizes.
const titleFont = Platform.select({ ios: 'System', default: undefined });

export const Typography = {
  display: { fontSize: 40, fontWeight: '300' as const, fontFamily: titleFont, letterSpacing: -1.0, lineHeight: 44 },
  h1: { fontSize: 28, fontWeight: '600' as const, fontFamily: titleFont, letterSpacing: -0.6, lineHeight: 34 },
  h2: { fontSize: 21, fontWeight: '600' as const, fontFamily: titleFont, letterSpacing: -0.3, lineHeight: 27 },
  h3: { fontSize: 17, fontWeight: '600' as const, letterSpacing: -0.2, lineHeight: 23 },
  body: { fontSize: 15, fontWeight: '400' as const, letterSpacing: -0.1, lineHeight: 22 },
  bodyBold: { fontSize: 15, fontWeight: '600' as const, letterSpacing: -0.1, lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  eyebrow: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 0.8, lineHeight: 14, textTransform: 'uppercase' as const },
  tiny: { fontSize: 11, fontWeight: '500' as const, lineHeight: 15 },
};
