import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { SCORE_FACTORS } from '@/domain/leaderboard/computeBalancedScore';
import { useTheme } from '@/theme';

export function ScoringTable() {
  const { colors, spacing, typography } = useTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <Pressable
        onPress={() => setExpanded((v) => !v)}
        style={{ flexDirection: 'row', alignItems: 'center' }}
      >
        <Text style={[typography.bodyBold, { color: colors.textPrimary, flex: 1 }]}>Así se calcula el ranking</Text>
        <MaterialCommunityIcons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.textSecondary}
        />
      </Pressable>

      {expanded &&
        SCORE_FACTORS.map((factor, index) => (
          <View
            key={factor.label}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: spacing.xs,
              marginTop: index === 0 ? spacing.sm : 0,
              borderTopWidth: 1,
              borderTopColor: colors.border,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={[typography.caption, { color: colors.textPrimary }]}>{factor.label}</Text>
              <Text style={[typography.tiny, { color: colors.textSecondary }]}>{factor.description}</Text>
            </View>
            <Text
              style={[
                typography.bodyBold,
                { color: factor.points.startsWith('−') ? '#E5484D' : colors.accentPrimary, marginLeft: spacing.sm },
              ]}
            >
              {factor.points}
            </Text>
          </View>
        ))}
    </Card>
  );
}
