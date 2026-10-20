import { Fonts } from './fonts';

// "Spritz Noir" type: Fraunces carries titles and numerals, DM Sans carries all UI text.
// See DESIGN.md §3.
const lining = { fontVariant: ['lining-nums' as const] };

export const Typography = {
  display: { fontFamily: Fonts.serifMedium, fontSize: 44, letterSpacing: -0.8, lineHeight: 50, ...lining },
  h1: { fontFamily: Fonts.serifSemiBold, fontSize: 30, letterSpacing: -0.5, lineHeight: 36, ...lining },
  h2: { fontFamily: Fonts.serifSemiBold, fontSize: 23, letterSpacing: -0.3, lineHeight: 29, ...lining },
  h3: { fontFamily: Fonts.serifSemiBold, fontSize: 18, letterSpacing: -0.15, lineHeight: 24, ...lining },
  body: { fontFamily: Fonts.sans, fontSize: 16, lineHeight: 24 },
  bodyBold: { fontFamily: Fonts.sansSemiBold, fontSize: 16, lineHeight: 24 },
  caption: { fontFamily: Fonts.sans, fontSize: 14, lineHeight: 20 },
  eyebrow: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 11,
    letterSpacing: 1.2,
    lineHeight: 16,
    textTransform: 'uppercase' as const,
  },
  tiny: { fontFamily: Fonts.sansMedium, fontSize: 12, lineHeight: 16 },
};
