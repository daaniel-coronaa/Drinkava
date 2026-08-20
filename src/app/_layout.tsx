import '@/global.css';

import { DarkTheme, DefaultTheme, Stack, ThemeProvider as RouterThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { HeaderBackButton } from '@/components/ui/HeaderBackButton';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { ThemeProvider as AppThemeProvider, useTheme } from '@/theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppThemeProvider>
        <SettingsProvider>
          <AuthProvider>
            <RootNavigator />
          </AuthProvider>
        </SettingsProvider>
      </AppThemeProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  const { loading } = useAuth();
  const { mode, colors } = useTheme();

  if (loading) return null;

  return (
    <RouterThemeProvider value={mode === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.textPrimary,
          headerShadowVisible: false,
          headerLeft: () => <HeaderBackButton />,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="party/create" options={{ presentation: 'modal', headerShown: true, title: 'Nueva fiesta' }} />
        <Stack.Screen name="party/join" options={{ presentation: 'modal', headerShown: true, title: 'Unirse a fiesta' }} />
        <Stack.Screen name="drink-log/new" options={{ presentation: 'modal', headerShown: true, title: 'Registrar bebida' }} />
        <Stack.Screen
          name="achievements/index"
          options={{ headerShown: true, title: 'Logros', headerLeft: () => <HeaderBackButton fallbackHref="/(tabs)/profile" /> }}
        />
        <Stack.Screen
          name="leaderboard/index"
          options={{ headerShown: true, title: 'Ranking', headerLeft: () => <HeaderBackButton fallbackHref="/(tabs)/profile" /> }}
        />
        <Stack.Screen
          name="safe-mode/index"
          options={{ headerShown: true, title: 'Modo Seguro', headerLeft: () => <HeaderBackButton fallbackHref="/(tabs)/profile" /> }}
        />
        <Stack.Screen
          name="settings/index"
          options={{ headerShown: true, title: 'Ajustes', headerLeft: () => <HeaderBackButton fallbackHref="/(tabs)/profile" /> }}
        />
        <Stack.Screen
          name="settings/terms"
          options={{ headerShown: true, title: 'Términos de servicio', headerLeft: () => <HeaderBackButton fallbackHref="/settings" /> }}
        />
        <Stack.Screen
          name="settings/privacy"
          options={{ headerShown: true, title: 'Privacidad', headerLeft: () => <HeaderBackButton fallbackHref="/settings" /> }}
        />
      </Stack>
    </RouterThemeProvider>
  );
}
