import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { DateTimePickerField } from '@/components/ui/DateTimePickerField';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/SettingsContext';
import { AgeRestrictedError } from '@/services';
import { useTheme } from '@/theme';

export default function AgeGateScreen() {
  const { colors, spacing, typography, radius } = useTheme();
  const { t } = useTranslation();
  const { submitBirthDate } = useAuth();
  const [date, setDate] = useState(new Date(2000, 0, 1));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    setError(null);
    try {
      await submitBirthDate(date.toISOString().slice(0, 10));
      router.replace('/');
    } catch (e) {
      if (e instanceof AgeRestrictedError) {
        setError(t('auth.ageGate.errorUnderage'));
      } else {
        setError(t('auth.ageGate.errorGeneric'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background, padding: spacing.lg }]}>
      <View style={{ gap: spacing.sm, marginTop: spacing.xl }}>
        <Text style={[typography.h1, { color: colors.textPrimary }]}>{t('auth.ageGate.title')}</Text>
        <Text style={[typography.body, { color: colors.textSecondary }]}>{t('auth.ageGate.subtitle')}</Text>
      </View>

      <View style={{ marginTop: spacing.xl, alignItems: 'center', width: '100%' }}>
        <DateTimePickerField value={date} onChange={setDate} mode="date" maximumDate={new Date()} />
      </View>

      {error ? (
        <View
          style={{
            marginTop: spacing.md,
            padding: spacing.sm,
            borderRadius: radius.md,
            backgroundColor: '#E5484D22',
          }}
        >
          <Text style={[typography.caption, { color: '#E5484D' }]}>{error}</Text>
        </View>
      ) : null}

      <View style={{ flex: 1 }} />
      <Button label={t('auth.ageGate.continue')} onPress={handleContinue} loading={loading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
