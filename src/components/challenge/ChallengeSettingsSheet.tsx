import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { QuantityStepper } from '@/components/drink-log/QuantityStepper';
import { useAuth } from '@/context/AuthContext';
import { services } from '@/services';
import { useTheme } from '@/theme';
import type { ChallengeCategory, ChallengePaceMode } from '@/types';
import { challengeCategoryLabels } from '@/utils/challengeCategory';

const ALL_CATEGORIES: ChallengeCategory[] = ['bebida', 'social', 'fisico', 'social_premium'];

type Props = {
  visible: boolean;
  onClose: () => void;
  partyId: string;
  onSaved: () => void;
};

export function ChallengeSettingsSheet({ visible, onClose, partyId, onSaved }: Props) {
  const { colors, spacing, radius, typography } = useTheme();
  const { session } = useAuth();
  const [paceMode, setPaceMode] = useState<ChallengePaceMode>('aleatorio');
  const [intervalMinutes, setIntervalMinutes] = useState(20);
  const [categories, setCategories] = useState<ChallengeCategory[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!visible) return;
    services.challenges.getPartyChallengeSettings(partyId).then((s) => {
      setPaceMode(s.paceMode);
      setIntervalMinutes(s.intervalMinutes);
      setCategories(s.enabledCategories);
    });
  }, [visible, partyId]);

  const toggleCategory = (cat: ChallengeCategory) => {
    setCategories((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  };

  const save = async () => {
    if (!session) return;
    setSaving(true);
    try {
      await services.challenges.updatePartyChallengeSettings(partyId, session.user.id, {
        paceMode,
        intervalMinutes,
        enabledCategories: categories,
      });
      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View
        style={[
          styles.sheet,
          { backgroundColor: colors.surface, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg },
        ]}
      >
        <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
          <Text style={[typography.h3, { color: colors.textPrimary, marginBottom: spacing.md }]}>Configurar retos</Text>

          <Text style={[typography.caption, { color: colors.textSecondary, marginBottom: spacing.xs }]}>Ritmo</Text>
          <View style={[styles.segmented, { backgroundColor: colors.surfaceElevated, borderRadius: radius.md, marginBottom: spacing.md }]}>
            {(
              [
                ['aleatorio', 'Aleatorio'],
                ['fijo', 'Fijo'],
              ] as [ChallengePaceMode, string][]
            ).map(([mode, label]) => (
              <Pressable
                key={mode}
                onPress={() => setPaceMode(mode)}
                style={[styles.segment, { borderRadius: radius.sm, backgroundColor: paceMode === mode ? colors.accentPrimary : 'transparent' }]}
              >
                <Text style={[typography.caption, { color: paceMode === mode ? '#FFFFFF' : colors.textSecondary, textAlign: 'center' }]}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>

          {paceMode === 'aleatorio' ? (
            <Text style={[typography.tiny, { color: colors.textSecondary, marginBottom: spacing.md }]}>
              El siguiente reto se dispara tras un número aleatorio de turnos (entre 5 y 20): cada bebida registrada o
              reto resuelto cuenta como un turno.
            </Text>
          ) : (
            <View style={{ alignItems: 'center', marginBottom: spacing.md, gap: spacing.xs }}>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>Intervalo (minutos)</Text>
              <QuantityStepper value={intervalMinutes} onChange={setIntervalMinutes} min={5} max={180} />
            </View>
          )}

          <Text style={[typography.caption, { color: colors.textSecondary, marginBottom: spacing.xs }]}>
            Categorías habilitadas
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg }}>
            {ALL_CATEGORIES.map((cat) => (
              <Pressable key={cat} onPress={() => toggleCategory(cat)}>
                <Chip label={challengeCategoryLabels[cat]} tone={categories.includes(cat) ? 'accent' : 'neutral'} />
              </Pressable>
            ))}
          </View>
          <Text style={[typography.tiny, { color: colors.textSecondary, marginBottom: spacing.lg }]}>
            “Social premium” solo se asigna a miembros con suscripción activa, aunque esté habilitada aquí.
          </Text>

          <Button label="Guardar" onPress={save} loading={saving} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: '#00000066' },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, maxHeight: '85%' },
  segmented: { flexDirection: 'row', padding: 4 },
  segment: { flex: 1, paddingVertical: 8 },
});
