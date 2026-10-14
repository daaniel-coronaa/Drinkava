import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { QuantityStepper } from '@/components/drink-log/QuantityStepper';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/SettingsContext';
import { useSheetFrame } from '@/hooks/useSheetFrame';
import { services } from '@/services';
import { useTheme } from '@/theme';
import type { ChallengeCategory, ChallengePaceMode } from '@/types';
import { challengeCategoryIcons } from '@/utils/challengeCategory';

const ALL_CATEGORIES: ChallengeCategory[] = ['bebida', 'social', 'fisico', 'social_premium'];

type Props = {
  visible: boolean;
  onClose: () => void;
  partyId: string;
  onSaved: () => void;
};

export function ChallengeSettingsSheet({ visible, onClose, partyId, onSaved }: Props) {
  const { colors, spacing, radius, typography, challengeCategoryColors } = useTheme();
  const { t } = useTranslation();
  const { session } = useAuth();
  const sheetFrame = useSheetFrame();
  const [paceMode, setPaceMode] = useState<ChallengePaceMode>('aleatorio');
  const [intervalMinutes, setIntervalMinutes] = useState(20);
  const [categories, setCategories] = useState<ChallengeCategory[]>([]);
  const [saving, setSaving] = useState(false);
  // Which category's description is currently shown — updated by tapping any chip
  // (whether that turns it on or off), so people can see what a category means as
  // they're deciding whether to enable it.
  const [infoCategory, setInfoCategory] = useState<ChallengeCategory | null>(null);

  useEffect(() => {
    if (!visible) return;
    setInfoCategory(null);
    services.challenges.getPartyChallengeSettings(partyId).then((s) => {
      setPaceMode(s.paceMode);
      setIntervalMinutes(s.intervalMinutes);
      setCategories(s.enabledCategories);
    });
  }, [visible, partyId]);

  const toggleCategory = (cat: ChallengeCategory) => {
    setCategories((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
    setInfoCategory(cat);
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
          sheetFrame,
          { backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl },
        ]}
      >
        <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
          <Text style={[typography.h3, { color: colors.textPrimary, marginBottom: spacing.md }]}>{t('challenges.settingsTitle')}</Text>

          <Text style={[typography.eyebrow, { color: colors.textSecondary, marginBottom: spacing.xs }]}>{t('challenges.paceLabel')}</Text>
          <View style={[styles.segmented, { backgroundColor: colors.surfaceElevated, borderRadius: radius.md, marginBottom: spacing.md }]}>
            {(
              [
                ['aleatorio', t('challenges.paceRandom')],
                ['fijo', t('challenges.paceFixed')],
              ] as [ChallengePaceMode, string][]
            ).map(([mode, label]) => (
              <Pressable
                key={mode}
                onPress={() => setPaceMode(mode)}
                style={[styles.segment, { borderRadius: radius.md - spacing.xs, backgroundColor: paceMode === mode ? colors.accentPrimary : 'transparent' }]}
              >
                <Text style={[typography.caption, { color: paceMode === mode ? colors.onAccent : colors.textSecondary, textAlign: 'center' }]}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>

          {paceMode === 'aleatorio' ? (
            <Text style={[typography.tiny, { color: colors.textSecondary, marginBottom: spacing.md }]}>{t('challenges.randomExplain')}</Text>
          ) : (
            <View style={{ alignItems: 'center', marginBottom: spacing.md, gap: spacing.xs }}>
              <Text style={[typography.eyebrow, { color: colors.textSecondary }]}>{t('challenges.intervalLabel')}</Text>
              <QuantityStepper value={intervalMinutes} onChange={setIntervalMinutes} min={5} max={180} />
            </View>
          )}

          <Text style={[typography.eyebrow, { color: colors.textSecondary, marginBottom: spacing.xs }]}>
            {t('challenges.categoriesLabel')}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.sm }}>
            {ALL_CATEGORIES.map((cat) => (
              <Pressable key={cat} onPress={() => toggleCategory(cat)}>
                <Chip
                  label={t(`challenges.categories.${cat}.label`)}
                  color={categories.includes(cat) ? challengeCategoryColors[cat] : undefined}
                  size="lg"
                />
              </Pressable>
            ))}
          </View>

          {infoCategory ? (
            <View
              style={{
                flexDirection: 'row',
                gap: spacing.xs,
                backgroundColor: colors.surfaceElevated,
                borderRadius: radius.md,
                padding: spacing.sm,
                marginBottom: spacing.sm,
              }}
            >
              <MaterialCommunityIcons name={challengeCategoryIcons[infoCategory]} size={16} color={challengeCategoryColors[infoCategory]} />
              <Text style={[typography.tiny, { color: colors.textSecondary, flex: 1 }]}>
                {t(`challenges.categories.${infoCategory}.description`)}
              </Text>
            </View>
          ) : (
            <Text style={[typography.tiny, { color: colors.textSecondary, marginBottom: spacing.sm }]}>{t('challenges.tapForInfo')}</Text>
          )}

          <Text style={[typography.tiny, { color: colors.textSecondary, marginBottom: spacing.lg }]}>{t('challenges.categoryHint')}</Text>

          <Button label={t('challenges.saveButton')} onPress={save} loading={saving} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: '#00000066' },
  sheet: { maxHeight: '85%' },
  segmented: { flexDirection: 'row', padding: 4 },
  segment: { flex: 1, paddingVertical: 13 },
});
