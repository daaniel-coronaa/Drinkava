import { Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { SCORE_FACTORS } from '@/domain/leaderboard/computeBalancedScore';
import { useTheme } from '@/theme';

export function ScoringTable() {
  const { colors, spacing, typography } = useTheme();

  return (
    <Card>
      <Text style={[typography.bodyBold, { color: colors.textPrimary, marginBottom: spacing.xs }]}>
        Así se calcula el ranking
      </Text>
      <Text style={[typography.caption, { color: colors.textSecondary, marginBottom: spacing.sm }]}>
        No es una competencia de quién toma más — la variedad, los kudos y la asistencia pesan más que el volumen.
      </Text>

      {SCORE_FACTORS.map((factor, index) => (
        <View
          key={factor.label}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: spacing.xs,
            borderTopWidth: index === 0 ? 0 : 1,
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
