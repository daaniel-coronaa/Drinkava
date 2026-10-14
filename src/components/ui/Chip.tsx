import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme';

type Props = {
  label: string;
  color?: string;
  tone?: 'neutral' | 'accent';
  // 'lg' is for chips that are tapped (filters, toggles): 44dp tall. 'sm' is a passive label.
  size?: 'sm' | 'lg';
};

export function Chip({ label, color, tone = 'neutral', size = 'sm' }: Props) {
  const { colors, radius, typography } = useTheme();
  const backgroundColor = color ? `${color}${colors.tintAlpha}` : tone === 'accent' ? colors.accentPrimaryMuted : colors.surfaceElevated;
  const textColor = color ?? (tone === 'accent' ? colors.accentText : colors.textSecondary);

  return (
    <View
      style={[
        styles.base,
        { backgroundColor, borderRadius: radius.pill, paddingHorizontal: size === 'lg' ? 16 : 10, paddingVertical: 3 },
        size === 'lg' && styles.large,
      ]}
    >
      <Text style={[size === 'lg' ? typography.caption : typography.tiny, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignSelf: 'flex-start' },
  large: { minHeight: 44, justifyContent: 'center' },
});
