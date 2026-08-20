import { Stack } from 'expo-router';

import { HeaderBackButton } from '@/components/ui/HeaderBackButton';
import { useTheme } from '@/theme';

export default function ProfileLayout() {
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        headerShadowVisible: false,
        headerLeft: () => <HeaderBackButton fallbackHref="/(tabs)/profile" />,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[userId]" options={{ title: '' }} />
    </Stack>
  );
}
