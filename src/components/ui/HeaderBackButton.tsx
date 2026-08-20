import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import { Pressable } from 'react-native';

import { useTheme } from '@/theme';

// Always renders a back arrow, even when this screen was reached without in-app
// navigation history (deep link, reload, or a hard-reset stack) — falls back to a
// sensible route instead of leaving the header with no way back.
export function HeaderBackButton({ fallbackHref = '/(tabs)/parties' as Href }: { fallbackHref?: Href }) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => (router.canGoBack() ? router.back() : router.replace(fallbackHref))}
      hitSlop={12}
      style={{ paddingHorizontal: 12 }}
    >
      <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textPrimary} />
    </Pressable>
  );
}
