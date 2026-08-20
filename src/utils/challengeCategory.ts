import type { MaterialCommunityIcons } from '@expo/vector-icons';

import type { ChallengeCategory } from '@/types';

export const challengeCategoryLabels: Record<ChallengeCategory, string> = {
  bebida: 'Bebida',
  social: 'Social',
  fisico: 'Físico',
  social_premium: 'Social premium',
};

export const challengeCategoryIcons: Record<ChallengeCategory, React.ComponentProps<typeof MaterialCommunityIcons>['name']> = {
  bebida: 'glass-mug-variant',
  social: 'chat-processing-outline',
  fisico: 'handshake-outline',
  social_premium: 'crown-outline',
};
