import { ScrollView, Text } from 'react-native';

import { useTranslation } from '@/context/SettingsContext';
import { useTheme } from '@/theme';

export default function PrivacyScreen() {
  const { colors, spacing, typography } = useTheme();
  const { t } = useTranslation();
  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>
      <Text style={[typography.h2, { color: colors.textPrimary }]}>{t('privacy.title')}</Text>
      <Text style={[typography.body, { color: colors.textSecondary }]}>{t('privacy.intro')}</Text>
      <Text style={[typography.bodyBold, { color: colors.textPrimary }]}>{t('privacy.dataTitle')}</Text>
      <Text style={[typography.body, { color: colors.textSecondary }]}>{t('privacy.dataBody')}</Text>
      <Text style={[typography.bodyBold, { color: colors.textPrimary }]}>{t('privacy.sharingTitle')}</Text>
      <Text style={[typography.body, { color: colors.textSecondary }]}>{t('privacy.sharingBody')}</Text>
      <Text style={[typography.caption, { color: colors.textSecondary }]}>{t('privacy.placeholder')}</Text>
    </ScrollView>
  );
}
