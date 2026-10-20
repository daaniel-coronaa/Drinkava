import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text } from 'react-native';
import Animated from 'react-native-reanimated';

import { useTheme } from '@/theme';
import { enter } from '@/theme/motion';

type Props = {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  description?: string;
};

export function EmptyState({ icon, title, description }: Props) {
  const { colors, spacing, typography } = useTheme();
  return (
    <Animated.View entering={enter(0)} style={[styles.base, { paddingVertical: spacing.xxxl, gap: spacing.sm }]}>
      <MaterialCommunityIcons name={icon} size={40} color={colors.textSecondary} />
      <Text style={[typography.h3, { color: colors.textPrimary }]}>{title}</Text>
      {description ? (
        <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center' }]}>{description}</Text>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
});
