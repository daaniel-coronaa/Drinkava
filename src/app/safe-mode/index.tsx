import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { useState } from 'react';
import { Alert, Linking, Platform, Pressable, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/Card';
import { useSettings, useTranslation } from '@/context/SettingsContext';
import { useTheme } from '@/theme';

const WATER_REMINDER_ID = 'drinkava-water-reminder';

type RideApp = {
  scheme: string;
  webUrl: string;
  iosStoreUrl: string;
  androidStoreUrl: string;
  label: string;
};

const RIDE_APPS: Record<'uber' | 'didi', RideApp> = {
  uber: {
    scheme: 'uber://',
    webUrl: 'https://m.uber.com',
    iosStoreUrl: 'https://apps.apple.com/app/uber-request-a-ride/id368677368',
    androidStoreUrl: 'https://play.google.com/store/apps/details?id=com.ubercab',
    label: 'Uber',
  },
  didi: {
    scheme: 'didi://',
    // DiDi doesn't publish a web ride-request flow like Uber's m.uber.com — the store
    // listing is the most reliable link that actually opens something for every user.
    webUrl: 'https://play.google.com/store/apps/details?id=com.didiglobal.passenger',
    iosStoreUrl: 'https://apps.apple.com/app/didi-rider-affordable-rides/id1362398401',
    androidStoreUrl: 'https://play.google.com/store/apps/details?id=com.didiglobal.passenger',
    label: 'DiDi',
  },
};

// SEAM: these buttons only open the app's URL scheme (or a store/web fallback) — there's
// no real ride-request API integration. Replace with a real Uber/DiDi integration if one
// becomes available.
async function openRideApp(app: RideApp, errorTitle: string, errorMessage: string) {
  if (Platform.OS === 'web') {
    // react-native-web's Linking.canOpenURL() always resolves true regardless of the
    // scheme, so it would try (and silently fail, since Alert.alert is also a no-op on
    // web) to open uber:// / didi:// directly from the browser. Skip straight to a URL
    // a browser can actually open.
    window.open(app.webUrl, '_blank');
    return;
  }
  try {
    const canOpen = await Linking.canOpenURL(app.scheme);
    const target = canOpen ? app.scheme : Platform.OS === 'ios' ? app.iosStoreUrl : app.androidStoreUrl;
    await Linking.openURL(target);
  } catch {
    Alert.alert(errorTitle, errorMessage);
  }
}

export default function SafeModeScreen() {
  const { colors, spacing, radius, typography } = useTheme();
  const { t } = useTranslation();
  const { safeModeEnabled, setSafeModeEnabled } = useSettings();
  const [busy, setBusy] = useState(false);

  const handleToggle = async (value: boolean) => {
    setBusy(true);
    try {
      // Local scheduled notifications aren't supported on web — skip native
      // scheduling there but still let the user toggle the setting.
      if (Platform.OS !== 'web') {
        if (value) {
          const { granted } = await Notifications.requestPermissionsAsync();
          if (granted) {
            await Notifications.scheduleNotificationAsync({
              identifier: WATER_REMINDER_ID,
              content: { title: t('safeMode.waterNotificationTitle'), body: t('safeMode.waterNotificationBody') },
              trigger: { seconds: 45 * 60, repeats: true } as Notifications.TimeIntervalTriggerInput,
            });
          }
        } else {
          await Notifications.cancelScheduledNotificationAsync(WATER_REMINDER_ID);
        }
      }
      setSafeModeEnabled(value);
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['bottom']}>
      <View style={{ padding: spacing.lg, gap: spacing.md }}>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="cup-water" size={28} color={colors.accentInfo} style={{ marginRight: spacing.sm }} />
            <View style={{ flex: 1 }}>
              <Text style={[typography.bodyBold, { color: colors.textPrimary }]}>{t('safeMode.waterTitle')}</Text>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>{t('safeMode.waterSubtitle')}</Text>
            </View>
            <Switch
              value={safeModeEnabled}
              onValueChange={handleToggle}
              disabled={busy}
              trackColor={{ false: colors.borderStrong, true: colors.accentPrimary }} thumbColor="#FFFFFF" ios_backgroundColor={colors.borderStrong}
            />
          </View>
        </Card>

        <Text style={[typography.eyebrow, { color: colors.textSecondary }]}>{t('safeMode.goHomeTitle')}</Text>
        <Card>
          <View style={{ gap: spacing.sm }}>
            <Pressable
              onPress={() =>
                openRideApp(RIDE_APPS.uber, t('safeMode.openErrorTitle', { label: 'Uber' }), t('safeMode.openErrorMessage'))
              }
              style={{ flexDirection: 'row', alignItems: 'center', padding: spacing.xs, borderRadius: radius.md }}
            >
              <MaterialCommunityIcons name="car" size={22} color={colors.textPrimary} style={{ marginRight: spacing.sm }} />
              <Text style={[typography.body, { color: colors.textPrimary }]}>{t('safeMode.uberButton')}</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                openRideApp(RIDE_APPS.didi, t('safeMode.openErrorTitle', { label: 'DiDi' }), t('safeMode.openErrorMessage'))
              }
              style={{ flexDirection: 'row', alignItems: 'center', padding: spacing.xs, borderRadius: radius.md }}
            >
              <MaterialCommunityIcons name="car" size={22} color={colors.textPrimary} style={{ marginRight: spacing.sm }} />
              <Text style={[typography.body, { color: colors.textPrimary }]}>{t('safeMode.didiButton')}</Text>
            </Pressable>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}
