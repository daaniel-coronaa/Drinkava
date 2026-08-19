import { Platform } from 'react-native';

const boldFont = Platform.select({ ios: 'System', android: 'sans-serif-black', default: 'System' });

export const Typography = {
  display: { fontSize: 40, fontWeight: '800' as const, fontFamily: boldFont, letterSpacing: -0.5 },
  h1: { fontSize: 28, fontWeight: '800' as const, fontFamily: boldFont },
  h2: { fontSize: 22, fontWeight: '700' as const, fontFamily: boldFont },
  h3: { fontSize: 18, fontWeight: '700' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  bodyBold: { fontSize: 15, fontWeight: '700' as const },
  caption: { fontSize: 13, fontWeight: '500' as const },
  tiny: { fontSize: 11, fontWeight: '600' as const },
};
