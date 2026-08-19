import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme';

export function DisclaimerBanner() {
  const { colors, spacing, radius, typography } = useTheme();
  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: `${colors.accentWarning}1A`,
          borderRadius: radius.md,
          padding: spacing.sm,
          marginHorizontal: spacing.md,
          marginBottom: spacing.sm,
          gap: spacing.xs,
        },
      ]}
    >
      <MaterialCommunityIcons name="alert-circle-outline" size={16} color={colors.accentWarning} />
      <Text style={[typography.tiny, { color: colors.textSecondary, flex: 1 }]}>
        Bebe con responsabilidad. Debes ser mayor de edad.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center' },
});
