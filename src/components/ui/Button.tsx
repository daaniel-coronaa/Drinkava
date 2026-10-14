import { ActivityIndicator, Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
};

// Pill, 52dp tall (>= 44dp touch target). Primary is a gold fill with a dark ink label
// (onAccent); danger is a deep red with a white label — both clear 4.5:1 (DESIGN.md §2).
export function Button({ label, onPress, variant = 'primary', loading, disabled, style, icon }: Props) {
  const { colors, spacing, radius, typography } = useTheme();

  const backgroundColor = {
    primary: colors.accentPrimary,
    secondary: 'transparent',
    ghost: 'transparent',
    danger: colors.danger,
  }[variant];

  const textColor = {
    primary: colors.onAccent,
    secondary: colors.textPrimary,
    ghost: colors.accentText,
    danger: '#FFFFFF',
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor,
          borderRadius: radius.pill,
          paddingHorizontal: spacing.lg,
          opacity: disabled ? 0.4 : pressed ? 0.9 : 1,
          borderWidth: variant === 'secondary' ? 1 : 0,
          borderColor: colors.borderStrong,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon}
          <Text style={[typography.bodyBold, { color: textColor }]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 52,
  },
});
