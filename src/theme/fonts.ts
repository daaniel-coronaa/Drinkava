import { DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold } from '@expo-google-fonts/dm-sans';
import { Fraunces_400Regular, Fraunces_500Medium, Fraunces_600SemiBold } from '@expo-google-fonts/fraunces';

// Warm editorial pairing: Fraunces (a soft, characterful serif) for titles and numerals,
// DM Sans (clean, open, very legible at night) for everything you read or tap. Custom
// families encode their weight in the family name, so tokens set no fontWeight
// (Android won't synthesize it).
export const Fonts = {
  serif: 'Fraunces_400Regular',
  serifMedium: 'Fraunces_500Medium',
  serifSemiBold: 'Fraunces_600SemiBold',
  sans: 'DMSans_400Regular',
  sansMedium: 'DMSans_500Medium',
  sansSemiBold: 'DMSans_600SemiBold',
} as const;

export const FontAssets = {
  [Fonts.serif]: Fraunces_400Regular,
  [Fonts.serifMedium]: Fraunces_500Medium,
  [Fonts.serifSemiBold]: Fraunces_600SemiBold,
  [Fonts.sans]: DMSans_400Regular,
  [Fonts.sansMedium]: DMSans_500Medium,
  [Fonts.sansSemiBold]: DMSans_600SemiBold,
};
