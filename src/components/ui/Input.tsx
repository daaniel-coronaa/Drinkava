import { useState } from 'react';
import { Platform, StyleSheet, TextInput, type TextInputProps, type TextStyle } from 'react-native';

import { useTheme } from '@/theme';

// Themed text field: filled surface, strong (>= 3:1) boundary, and an accent border on
// focus so the active field is unmistakable. Replaces ad-hoc styled TextInputs.
export function Input({ style, onFocus, onBlur, ...rest }: TextInputProps) {
  const { colors, radius, spacing, typography } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <TextInput
      placeholderTextColor={colors.textSecondary}
      {...rest}
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      style={[
        styles.base,
        {
          fontFamily: typography.body.fontFamily,
          fontSize: typography.body.fontSize,
          color: colors.textPrimary,
          backgroundColor: colors.surfaceElevated,
          borderColor: focused ? colors.accentText : colors.borderStrong,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
        },
        // react-native-web draws its own focus outline; the accent border replaces it.
        Platform.OS === 'web' ? ({ outlineStyle: 'none' } as unknown as TextStyle) : null,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: { borderWidth: 1, minHeight: 48 },
});
