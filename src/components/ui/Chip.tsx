import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme';

type Props = {
  label: string;
  color?: string;
  tone?: 'neutral' | 'accent';
};

export function Chip({ label, color, tone = 'neutral' }: Props) {
  const { colors, radius, typography } = useTheme();
  const backgroundColor = color ? `${color}${colors.tintAlpha}` : tone === 'accent' ? colors.accentPrimaryMuted : colors.surfaceElevated;
  const textColor = color ?? (tone === 'accent' ? colors.accentText : colors.textSecondary);

  return (
    <View
      style={[
        styles.base,
        { backgroundColor, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3 },
      ]}
    >
      <Text style={[typography.tiny, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignSelf: 'flex-start' },
});
