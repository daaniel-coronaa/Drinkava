import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { useState } from 'react';
import { Alert, Linking, Platform, Pressable, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/Card';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/theme';

const WATER_REMINDER_ID = 'drinkava-water-reminder';

// SEAM: ride-share buttons only attempt to open the app's URL scheme, with no real
// Uber/Didi API integration. Replace with an actual ride-request integration if available.
async function openRideApp(scheme: string, fallbackUrl: string, label: string) {
  const canOpen = await Linking.canOpenURL(scheme);
  try {
    await Linking.openURL(canOpen ? scheme : fallbackUrl);
  } catch {
    Alert.alert(`No pudimos abrir ${label}`, 'Intenta abrir la app manualmente.');
  }
}

export default function SafeModeScreen() {
  const { colors, spacing, radius, typography } = useTheme();
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
              content: { title: 'Drinkava', body: '💧 Hora de tomar agua. Cuídate en la fiesta.' },
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
              <Text style={[typography.bodyBold, { color: colors.textPrimary }]}>Recordatorios de agua</Text>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>
                Te avisamos cada 45 min mientras estés en modo seguro.
              </Text>
            </View>
            <Switch value={safeModeEnabled} onValueChange={handleToggle} disabled={busy} />
          </View>
        </Card>

        <Text style={[typography.caption, { color: colors.textSecondary }]}>Volver a casa</Text>
        <Card>
          <View style={{ gap: spacing.sm }}>
            <Pressable
              onPress={() => openRideApp('uber://', 'https://m.uber.com', 'Uber')}
              style={{ flexDirection: 'row', alignItems: 'center', padding: spacing.xs, borderRadius: radius.md }}
            >
              <MaterialCommunityIcons name="car" size={22} color={colors.textPrimary} style={{ marginRight: spacing.sm }} />
              <Text style={[typography.body, { color: colors.textPrimary }]}>Pedir Uber</Text>
            </Pressable>
            <Pressable
              onPress={() => openRideApp('didi://', 'https://www.didiglobal.com', 'DiDi')}
              style={{ flexDirection: 'row', alignItems: 'center', padding: spacing.xs, borderRadius: radius.md }}
            >
              <MaterialCommunityIcons name="car" size={22} color={colors.textPrimary} style={{ marginRight: spacing.sm }} />
              <Text style={[typography.body, { color: colors.textPrimary }]}>Pedir DiDi</Text>
            </Pressable>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}
