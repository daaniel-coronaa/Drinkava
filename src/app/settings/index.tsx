import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useAuth } from '@/context/AuthContext';
import { useSettings, useTranslation } from '@/context/SettingsContext';
import type { Language } from '@/i18n';
import { mockDb } from '@/services';
import { useTheme, type ThemeMode } from '@/theme';

function Row({ icon, label, onPress }: { icon: React.ComponentProps<typeof MaterialCommunityIcons>['name']; label: string; onPress: () => void }) {
  const { colors, spacing, typography } = useTheme();
  return (
    <Pressable onPress={onPress} style={[styles.row, { paddingVertical: spacing.sm }]}>
      <MaterialCommunityIcons name={icon} size={20} color={colors.textPrimary} style={{ marginRight: spacing.sm }} />
      <Text style={[typography.body, { color: colors.textPrimary, flex: 1 }]}>{label}</Text>
      <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { colors, spacing, radius, typography, modeOverride, setModeOverride } = useTheme();
  const { t } = useTranslation();
  const { language, setLanguage } = useSettings();
  const { session, signOut, updateProfile } = useAuth();
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [savingSubscription, setSavingSubscription] = useState(false);
  const [resetConfirmVisible, setResetConfirmVisible] = useState(false);

  useEffect(() => {
    setHasActiveSubscription(!!session?.user.hasActiveSubscription);
  }, [session?.user.hasActiveSubscription]);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };

  const resetLocalData = async () => {
    await mockDb.reset();
    // mockDb.reset() only clears the underlying storage — signOut() is what actually
    // updates AuthContext's in-memory session, which nothing else here would refresh.
    await signOut();
    router.replace('/');
  };

  const handleResetData = () => setResetConfirmVisible(true);

  const confirmResetData = () => {
    setResetConfirmVisible(false);
    resetLocalData();
  };

  const toggleSubscription = async (value: boolean) => {
    if (!session) return;
    setSavingSubscription(true);
    setHasActiveSubscription(value);
    try {
      await updateProfile({ hasActiveSubscription: value });
    } finally {
      setSavingSubscription(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['bottom']}>
      <View style={{ padding: spacing.lg, gap: spacing.md }}>
        <Card>
          <Text style={[typography.eyebrow, { color: colors.textSecondary, marginBottom: spacing.sm }]}>{t('settings.appearanceTitle')}</Text>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            {(['system', 'light', 'dark'] as (ThemeMode | 'system')[]).map((mode) => (
              <Pressable
                key={mode}
                onPress={() => setModeOverride(mode)}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: radius.pill,
                  backgroundColor: modeOverride === mode ? colors.accentPrimary : colors.surfaceElevated,
                }}
              >
                <Text
                  style={[
                    typography.caption,
                    { color: modeOverride === mode ? '#FFFFFF' : colors.textSecondary, textAlign: 'center' },
                  ]}
                >
                  {mode === 'system' ? t('settings.systemOption') : mode === 'light' ? t('settings.lightOption') : t('settings.darkOption')}
                </Text>
              </Pressable>
            ))}
          </View>
        </Card>

        <Card>
          <Text style={[typography.eyebrow, { color: colors.textSecondary, marginBottom: spacing.sm }]}>{t('settings.languageTitle')}</Text>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            {(['es', 'en'] as Language[]).map((lang) => (
              <Pressable
                key={lang}
                onPress={() => setLanguage(lang)}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: radius.pill,
                  backgroundColor: language === lang ? colors.accentPrimary : colors.surfaceElevated,
                }}
              >
                <Text
                  style={[
                    typography.caption,
                    { color: language === lang ? '#FFFFFF' : colors.textSecondary, textAlign: 'center' },
                  ]}
                >
                  {lang === 'es' ? t('settings.languageSpanish') : t('settings.languageEnglish')}
                </Text>
              </Pressable>
            ))}
          </View>
        </Card>

        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="crown-outline" size={20} color={colors.textPrimary} style={{ marginRight: spacing.sm }} />
            <View style={{ flex: 1 }}>
              <Text style={[typography.body, { color: colors.textPrimary }]}>{t('settings.subscriptionTitle')}</Text>
              <Text style={[typography.tiny, { color: colors.textSecondary }]}>{t('settings.subscriptionSubtitle')}</Text>
            </View>
            <Switch value={hasActiveSubscription} onValueChange={toggleSubscription} disabled={savingSubscription} />
          </View>
        </Card>

        <Card>
          <Row icon="shield-check-outline" label={t('settings.safeModeRow')} onPress={() => router.push('/safe-mode')} />
          <Row icon="file-document-outline" label={t('settings.termsRow')} onPress={() => router.push('/settings/terms')} />
          <Row icon="lock-outline" label={t('settings.privacyRow')} onPress={() => router.push('/settings/privacy')} />
        </Card>

        <Pressable onPress={handleSignOut} style={{ alignItems: 'center', paddingVertical: spacing.sm }}>
          <Text style={[typography.bodyBold, { color: colors.dangerText }]}>{t('settings.signOut')}</Text>
        </Pressable>

        <Pressable onPress={handleResetData} style={{ alignItems: 'center', paddingVertical: spacing.sm }}>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>{t('settings.resetDataButton')}</Text>
        </Pressable>
      </View>

      <ConfirmDialog
        visible={resetConfirmVisible}
        title={t('settings.resetConfirmTitle')}
        message={t('settings.resetConfirmMessage')}
        confirmLabel={t('settings.resetConfirmConfirm')}
        destructive
        onConfirm={confirmResetData}
        onCancel={() => setResetConfirmVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});
