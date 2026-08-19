import type { MaterialCommunityIcons } from '@expo/vector-icons';

import type { DrinkType } from '@/types';

export const drinkTypeLabels: Record<DrinkType, string> = {
  shot: 'Shot',
  cocktail: 'Cóctel',
  beer: 'Cerveza',
  wine: 'Vino',
  other: 'Otro',
};

export const drinkTypeIcons: Record<DrinkType, React.ComponentProps<typeof MaterialCommunityIcons>['name']> = {
  shot: 'bottle-tonic-outline',
  cocktail: 'glass-cocktail',
  beer: 'glass-mug-variant',
  wine: 'glass-wine',
  other: 'cup',
};

export function drinkLabel(drinkType: DrinkType, customLabel?: string) {
  if (drinkType === 'other' && customLabel) return customLabel;
  return customLabel ? `${drinkTypeLabels[drinkType]} · ${customLabel}` : drinkTypeLabels[drinkType];
}
