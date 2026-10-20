import '@/global.css';

import { DarkTheme, DefaultTheme, router, Stack, ThemeProvider as RouterThemeProvider, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { HeaderBackButton } from '@/components/ui/HeaderBackButton';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { SettingsProvider, useTranslation } from '@/context/SettingsContext';
import { ContentMaxWidth, FontAssets, Fonts, ThemeProvider as AppThemeProvider, useTheme } from '@/theme';

// Screens under (auth) that don't require a session to be reachable — everything else
// there (age-gate, onboarding-tos) needs one to actually function.
const PUBLIC_AUTH_SCREENS = ['welcome', 'email-login', 'email-register'];

// index.tsx only guards the very first load (its <Redirect> only runs once, on mount of
// that route). Without this, navigating directly to any other route — a party detail
// page, a tab, a deep link — while signed out (or after the session/onboarding state
// changes) renders whatever that screen does with session === null, which for several
// screens is a blank/black screen instead of being sent back to sign in. This runs on
// every navigation and keeps the whole app, not just the initial load, in sync with
// auth/onboarding state.
function useAuthGate() {
  const { loading, session } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === '(auth)';
    const authScreen = segments[1];

    if (!session) {
      if (!(inAuthGroup && PUBLIC_AUTH_SCREENS.includes(authScreen ?? ''))) router.replace('/(auth)/welcome');
      return;
    }
    if (!session.ageVerified) {
      if (!(inAuthGroup && authScreen === 'age-gate')) router.replace('/(auth)/age-gate');
      return;
    }
    if (!session.tosAccepted) {
      if (!(inAuthGroup && authScreen === 'onboarding-tos')) router.replace('/(auth)/onboarding-tos');
      return;
    }
    if (inAuthGroup) router.replace('/(tabs)/parties');
  }, [loading, session, segments]);
}

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
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const wide = width > ContentMaxWidth;
  const [fontsLoaded, fontError] = useFonts(FontAssets);

  useAuthGate();

  // Hold the first paint until the editorial fonts are ready (or failed — then fall back).
  if (loading || (!fontsLoaded && !fontError)) return null;

  return (
    <RouterThemeProvider value={mode === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: colors.background }}>
        <View
          style={{
            flex: 1,
            width: '100%',
            maxWidth: ContentMaxWidth,
            borderColor: colors.border,
            borderLeftWidth: wide ? StyleSheet.hairlineWidth : 0,
            borderRightWidth: wide ? StyleSheet.hairlineWidth : 0,
          }}
        >
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontFamily: Fonts.serifSemiBold, fontSize: 18 },
          headerShadowVisible: false,
          headerLeft: () => <HeaderBackButton />,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="party/create" options={{ presentation: 'modal', headerShown: true, title: t('parties.create.title') }} />
        <Stack.Screen name="party/join" options={{ presentation: 'modal', headerShown: true, title: t('parties.join.title') }} />
        <Stack.Screen
          name="friends/index"
          options={{ headerShown: true, title: t('friends.listTitle'), headerLeft: () => <HeaderBackButton fallbackHref="/(tabs)/profile" /> }}
        />
        <Stack.Screen name="friends/add" options={{ presentation: 'modal', headerShown: true, title: t('friends.title') }} />
        <Stack.Screen name="drink-log/new" options={{ presentation: 'modal', headerShown: true, title: t('drinkLog.screenTitle') }} />
        <Stack.Screen
          name="achievements/index"
          options={{ headerShown: true, title: t('achievements.screenTitle'), headerLeft: () => <HeaderBackButton fallbackHref="/(tabs)/profile" /> }}
        />
        <Stack.Screen
          name="leaderboard/index"
          options={{ headerShown: true, title: t('leaderboard.screenTitle'), headerLeft: () => <HeaderBackButton fallbackHref="/(tabs)/profile" /> }}
        />
        <Stack.Screen
          name="safe-mode/index"
          options={{ headerShown: true, title: t('safeMode.screenTitle'), headerLeft: () => <HeaderBackButton fallbackHref="/(tabs)/profile" /> }}
        />
        <Stack.Screen
          name="settings/index"
          options={{ headerShown: true, title: t('settings.screenTitle'), headerLeft: () => <HeaderBackButton fallbackHref="/(tabs)/profile" /> }}
        />
        <Stack.Screen
          name="settings/terms"
          options={{ headerShown: true, title: t('settings.termsRow'), headerLeft: () => <HeaderBackButton fallbackHref="/settings" /> }}
        />
        <Stack.Screen
          name="settings/privacy"
          options={{ headerShown: true, title: t('settings.privacyRow'), headerLeft: () => <HeaderBackButton fallbackHref="/settings" /> }}
        />
      </Stack>
        </View>
      </View>
    </RouterThemeProvider>
  );
}
