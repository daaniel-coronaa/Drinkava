import '@/global.css';

import { DarkTheme, DefaultTheme, Stack, ThemeProvider as RouterThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="party/create" options={{ presentation: 'modal', headerShown: true, title: 'Nueva fiesta' }} />
        <Stack.Screen name="party/join" options={{ presentation: 'modal', headerShown: true, title: 'Unirse a fiesta' }} />
        <Stack.Screen name="drink-log/new" options={{ presentation: 'modal', headerShown: true, title: 'Registrar bebida' }} />
        <Stack.Screen name="achievements/index" options={{ headerShown: true, title: 'Logros' }} />
        <Stack.Screen name="safe-mode/index" options={{ headerShown: true, title: 'Modo Seguro' }} />
        <Stack.Screen name="settings/index" options={{ headerShown: true, title: 'Ajustes' }} />
        <Stack.Screen name="settings/terms" options={{ headerShown: true, title: 'Términos de servicio' }} />
        <Stack.Screen name="settings/privacy" options={{ headerShown: true, title: 'Privacidad' }} />
      </Stack>
    </RouterThemeProvider>
  );
}
