import { Stack } from 'expo-router';

import { useTheme } from '@/theme';

export default function PartiesLayout() {
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[partyId]" options={{ title: '' }} />
    </Stack>
  );
}
