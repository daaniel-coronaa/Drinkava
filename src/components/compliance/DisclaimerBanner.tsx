import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { useTranslation } from '@/context/SettingsContext';
import { useTheme } from '@/theme';

export function DisclaimerBanner() {
  const { colors, spacing, radius, typography } = useTheme();
  const { t } = useTranslation();
  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: `${colors.accentPrimary}${colors.tintAlpha}`,
          borderRadius: radius.md,
          padding: spacing.sm,
          marginHorizontal: spacing.inset,
          marginBottom: spacing.sm,
          gap: spacing.xs,
        },
      ]}
    >
      <MaterialCommunityIcons name="alert-circle-outline" size={16} color={colors.accentText} />
      <Text style={[typography.tiny, { color: colors.textSecondary, flex: 1 }]}>{t('common.disclaimerBanner')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center' },
});
