import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme';
import type { LeaderboardEntry } from '@/types';

type Props = {
  visible: boolean;
  onClose: () => void;
  entry: LeaderboardEntry | null;
  userName?: string;
};

export function ScoreBreakdownSheet({ visible, onClose, entry, userName }: Props) {
  const { colors, spacing, radius, typography } = useTheme();
  if (!entry) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.card, { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg }]}
        >
          <Text style={[typography.h3, { color: colors.textPrimary }]}>Por qué {userName ?? 'este puntaje'}</Text>
          <Text style={[typography.caption, { color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.md }]}>
            El ranking de Drinkava no premia solo cantidad — también variedad, asistencia y kudos.
          </Text>
          {entry.breakdown.map((item) => (
            <View key={item.label} style={styles.row}>
              <Text style={[typography.body, { color: colors.textSecondary, flex: 1 }]}>{item.label}</Text>
              <Text
                style={[
                  typography.bodyBold,
                  { color: item.contribution < 0 ? '#E5484D' : colors.textPrimary },
                ]}
              >
                {item.contribution > 0 ? '+' : ''}
                {item.contribution}
              </Text>
            </View>
          ))}
          <View style={[styles.row, { marginTop: spacing.sm, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, paddingTop: spacing.sm }]}>
            <Text style={[typography.bodyBold, { color: colors.textPrimary, flex: 1 }]}>Total</Text>
            <Text style={[typography.h3, { color: colors.accentPrimary }]}>{entry.score}</Text>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: '#00000066', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 400 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
});
