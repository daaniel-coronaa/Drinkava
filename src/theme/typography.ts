import { Platform } from 'react-native';

// Let each platform's default system font (SF Pro on iOS, Roboto on Android/web) carry
// the weight instead of forcing a heavy family override — reads cleaner and more
// minimal than a "black" weight family, while staying bold at large sizes.
const titleFont = Platform.select({ ios: 'System', default: undefined });

export const Typography = {
  display: { fontSize: 38, fontWeight: '800' as const, fontFamily: titleFont, letterSpacing: -0.8, lineHeight: 42 },
  h1: { fontSize: 29, fontWeight: '800' as const, fontFamily: titleFont, letterSpacing: -0.5, lineHeight: 34 },
  h2: { fontSize: 21, fontWeight: '700' as const, fontFamily: titleFont, letterSpacing: -0.3, lineHeight: 26 },
  h3: { fontSize: 17, fontWeight: '700' as const, letterSpacing: -0.2, lineHeight: 22 },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 21 },
  bodyBold: { fontSize: 15, fontWeight: '700' as const, lineHeight: 21 },
  caption: { fontSize: 13, fontWeight: '500' as const, lineHeight: 18 },
  tiny: { fontSize: 11, fontWeight: '600' as const, lineHeight: 15 },
};
