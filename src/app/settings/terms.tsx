import { ScrollView, Text } from 'react-native';

import { useTranslation } from '@/context/SettingsContext';
import { useTheme } from '@/theme';

export default function TermsScreen() {
  const { colors, spacing, typography } = useTheme();
  const { t } = useTranslation();
  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>
      <Text style={[typography.h2, { color: colors.textPrimary }]}>{t('terms.title')}</Text>
      <Text style={[typography.body, { color: colors.textSecondary }]}>{t('terms.intro')}</Text>
      <Text style={[typography.bodyBold, { color: colors.textPrimary }]}>{t('terms.responsibleTitle')}</Text>
      <Text style={[typography.body, { color: colors.textSecondary }]}>{t('terms.responsibleBody')}</Text>
      <Text style={[typography.bodyBold, { color: colors.textPrimary }]}>{t('terms.usageTitle')}</Text>
      <Text style={[typography.body, { color: colors.textSecondary }]}>{t('terms.usageBody')}</Text>
      <Text style={[typography.bodyBold, { color: colors.textPrimary }]}>{t('terms.loggingTitle')}</Text>
      <Text style={[typography.body, { color: colors.textSecondary }]}>{t('terms.loggingBody1')}</Text>
      <Text style={[typography.body, { color: colors.textSecondary }]}>{t('terms.loggingBody2')}</Text>
      <Text style={[typography.caption, { color: colors.textSecondary }]}>{t('terms.placeholder')}</Text>
    </ScrollView>
  );
}
