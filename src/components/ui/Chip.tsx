import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme';

type Props = {
  label: string;
  color?: string;
  tone?: 'neutral' | 'accent';
};

export function Chip({ label, color, tone = 'neutral' }: Props) {
  const { colors, spacing, radius, typography } = useTheme();
  const backgroundColor = color ? `${color}22` : tone === 'accent' ? colors.accentPrimaryMuted : colors.surfaceElevated;
  const textColor = color ?? (tone === 'accent' ? colors.accentPrimary : colors.textSecondary);

  return (
    <View
      style={[
        styles.base,
        { backgroundColor, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs / 2 },
      ]}
    >
      <Text style={[typography.tiny, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignSelf: 'flex-start' },
});
