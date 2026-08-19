import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme';

type Props = {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  description?: string;
};

export function EmptyState({ icon, title, description }: Props) {
  const { colors, spacing, typography } = useTheme();
  return (
    <View style={[styles.base, { paddingVertical: spacing.xxl, gap: spacing.sm }]}>
      <MaterialCommunityIcons name={icon} size={40} color={colors.textSecondary} />
      <Text style={[typography.h3, { color: colors.textPrimary }]}>{title}</Text>
      {description ? (
        <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center' }]}>{description}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
});
