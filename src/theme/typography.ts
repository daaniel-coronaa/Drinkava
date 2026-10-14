import { Fonts } from './fonts';

// "Noir Champagne" type: a high-contrast serif carries titles and numerals, a geometric
// sans carries all UI text. Jost sets small for its size, so body/caption/tiny sit one
// point above the previous system-font scale. See DESIGN.md §3.
const lining = { fontVariant: ['lining-nums' as const] };

export const Typography = {
  display: { fontFamily: Fonts.serif, fontSize: 42, letterSpacing: -0.6, lineHeight: 48, ...lining },
  h1: { fontFamily: Fonts.serifSemiBold, fontSize: 30, letterSpacing: -0.4, lineHeight: 36, ...lining },
  h2: { fontFamily: Fonts.serifSemiBold, fontSize: 23, letterSpacing: -0.2, lineHeight: 29, ...lining },
  h3: { fontFamily: Fonts.serifSemiBold, fontSize: 18, letterSpacing: -0.1, lineHeight: 24, ...lining },
  body: { fontFamily: Fonts.sans, fontSize: 16, lineHeight: 24 },
  bodyBold: { fontFamily: Fonts.sansSemiBold, fontSize: 16, lineHeight: 24 },
  caption: { fontFamily: Fonts.sans, fontSize: 14, lineHeight: 20 },
  eyebrow: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 11,
    letterSpacing: 1.4,
    lineHeight: 16,
    textTransform: 'uppercase' as const,
  },
  tiny: { fontFamily: Fonts.sansMedium, fontSize: 12, lineHeight: 16 },
};
