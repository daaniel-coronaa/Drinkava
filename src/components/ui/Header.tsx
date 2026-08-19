import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme';

type Props = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
};

export function Header({ title, subtitle, right }: Props) {
  const { colors, spacing, typography } = useTheme();
  return (
    <View style={[styles.row, { paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.sm }]}>
      <View style={{ flex: 1 }}>
        <Text style={[typography.h1, { color: colors.textPrimary }]}>{title}</Text>
        {subtitle ? <Text style={[typography.body, { color: colors.textSecondary }]}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});
