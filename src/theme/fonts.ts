import { Jost_400Regular, Jost_500Medium, Jost_600SemiBold } from '@expo-google-fonts/jost';
import { PlayfairDisplay_400Regular, PlayfairDisplay_600SemiBold } from '@expo-google-fonts/playfair-display';

// Editorial pairing: Playfair Display (high-contrast serif) for titles, Jost (geometric
// sans) for everything you read or tap. Custom families encode their weight in the
// family name, so tokens below set no fontWeight (Android won't synthesize it).
export const Fonts = {
  serif: 'PlayfairDisplay_400Regular',
  serifSemiBold: 'PlayfairDisplay_600SemiBold',
  sans: 'Jost_400Regular',
  sansMedium: 'Jost_500Medium',
  sansSemiBold: 'Jost_600SemiBold',
} as const;

export const FontAssets = {
  [Fonts.serif]: PlayfairDisplay_400Regular,
  [Fonts.serifSemiBold]: PlayfairDisplay_600SemiBold,
  [Fonts.sans]: Jost_400Regular,
  [Fonts.sansMedium]: Jost_500Medium,
  [Fonts.sansSemiBold]: Jost_600SemiBold,
};
