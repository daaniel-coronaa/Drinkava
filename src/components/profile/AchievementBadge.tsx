import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme';
import type { AchievementDefinition } from '@/types';
import { formatDate } from '@/utils/date';

type Props = {
  definition: AchievementDefinition;
  unlockedAt?: string;
};

export function AchievementBadge({ definition, unlockedAt }: Props) {
  const { colors, spacing, radius, typography } = useTheme();
  const unlocked = !!unlockedAt;

  return (
    <View style={[styles.card, { borderRadius: radius.lg, borderColor: colors.border, opacity: unlocked ? 1 : 0.45 }]}>
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: unlocked ? colors.accentPrimaryMuted : colors.surfaceElevated, borderRadius: radius.pill },
        ]}
      >
        <MaterialCommunityIcons
          name={definition.icon as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
          size={28}
          color={unlocked ? colors.accentPrimary : colors.textSecondary}
        />
      </View>
      <Text style={[typography.bodyBold, { color: colors.textPrimary, textAlign: 'center', marginTop: spacing.xs }]}>
        {definition.title}
      </Text>
      <Text style={[typography.tiny, { color: colors.textSecondary, textAlign: 'center', marginTop: 2 }]}>
        {unlocked ? formatDate(unlockedAt) : definition.description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: 140, borderWidth: StyleSheet.hairlineWidth, padding: 12, alignItems: 'center', margin: 6 },
  iconCircle: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
});
