import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/SettingsContext';
import { useTheme } from '@/theme';

export default function OnboardingTosScreen() {
  const { colors, spacing, typography, radius } = useTheme();
  const { t } = useTranslation();
  const { acceptTerms } = useAuth();
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    try {
      await acceptTerms();
      router.replace('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>
        <Text style={[typography.h1, { color: colors.textPrimary }]}>{t('auth.onboardingTos.title')}</Text>

        <View
          style={{
            backgroundColor: `${colors.accentWarning}1A`,
            borderRadius: radius.md,
            padding: spacing.md,
            gap: spacing.xs,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
            <MaterialCommunityIcons name="alert-circle-outline" size={18} color={colors.accentWarning} />
            <Text style={[typography.bodyBold, { color: colors.textPrimary }]}>{t('auth.onboardingTos.disclaimerTitle')}</Text>
          </View>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>{t('auth.onboardingTos.disclaimerBody')}</Text>
        </View>

        <Text style={[typography.body, { color: colors.textSecondary }]}>{t('auth.onboardingTos.body')}</Text>

        <Pressable
          onPress={() => setAccepted((v) => !v)}
          style={[styles.checkboxRow, { gap: spacing.sm }]}
        >
          <View
            style={[
              styles.checkbox,
              {
                borderColor: accepted ? colors.accentPrimary : colors.border,
                backgroundColor: accepted ? colors.accentPrimary : 'transparent',
                borderRadius: radius.sm,
              },
            ]}
          >
            {accepted ? <MaterialCommunityIcons name="check" size={16} color={colors.onAccent} /> : null}
          </View>
          <Text style={[typography.body, { color: colors.textPrimary, flex: 1 }]}>{t('auth.onboardingTos.checkboxLabel')}</Text>
        </Pressable>
      </ScrollView>

      <View style={{ padding: spacing.lg }}>
        <Button label={t('auth.onboardingTos.continueButton')} onPress={handleContinue} loading={loading} disabled={!accepted} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start' },
  checkbox: { width: 24, height: 24, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});
