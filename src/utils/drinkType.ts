import type { MaterialCommunityIcons } from '@expo/vector-icons';

import type { DrinkType } from '@/types';

export const drinkTypeIcons: Record<DrinkType, React.ComponentProps<typeof MaterialCommunityIcons>['name']> = {
  shot: 'bottle-tonic-outline',
  cocktail: 'glass-cocktail',
  beer: 'glass-mug-variant',
  wine: 'glass-wine',
  other: 'cup',
};

// `typeLabel` is the already-translated label for `drinkType` (see drinkTypes.* in
// src/i18n) — kept as a plain param since this isn't a component and can't call useTranslation().
export function drinkLabel(drinkType: DrinkType, typeLabel: string, customLabel?: string) {
  if (drinkType === 'other' && customLabel) return customLabel;
  return customLabel ? `${typeLabel} · ${customLabel}` : typeLabel;
}
