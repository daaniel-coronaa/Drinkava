import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { PhotoPicker } from '@/components/drink-log/PhotoPicker';
import { useTranslation } from '@/context/SettingsContext';
import type { TranslationKey } from '@/i18n';
import { challengeCatalog, services } from '@/services';
import { useTheme } from '@/theme';
import type { ChallengeAssignment, User } from '@/types';
import { timeAgo } from '@/utils/date';
import { challengeCategoryIcons } from '@/utils/challengeCategory';

type Props = {
  assignment: ChallengeAssignment;
  usersById: Record<string, User>;
  currentUserId: string;
  isHost: boolean;
  // Called after every action. `countsAsTurn` is true when the assignment left
  // 'pendiente' for a resolved state (completado/validado/rechazado/pasado) — that's
  // the "turno" the brief defines for 'aleatorio' pacing; a first accept on a
  // 'fisico' challenge (still waiting on the other side) does not count.
  onChanged: (countsAsTurn: boolean) => void;
};

export function ChallengeCard({ assignment, usersById, currentUserId, isHost, onChanged }: Props) {
  const { colors, spacing, radius, typography, challengeCategoryColors } = useTheme();
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>();
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);

  const challenge = challengeCatalog.find((c) => c.id === assignment.challengeId);
  if (!challenge) return null;

  const accent = challengeCategoryColors[challenge.category];
  const userA = usersById[assignment.userIdA];
  const userB = assignment.userIdB ? usersById[assignment.userIdB] : undefined;
  const isFisico = challenge.category === 'fisico';
  const isTargetA = currentUserId === assignment.userIdA;
  const isTargetB = currentUserId === assignment.userIdB;

  const run = async (action: () => Promise<ChallengeAssignment | void>) => {
    setBusy(true);
    try {
      const result = await action();
      onChanged(!!result && result.status !== 'pendiente');
    } finally {
      setBusy(false);
    }
  };

  const statusColor =
    assignment.status === 'validado'
      ? colors.accentSuccess
      : assignment.status === 'rechazado'
        ? colors.dangerText
        : assignment.status === 'completado'
          ? colors.accentInfo
          : colors.textSecondary;

  return (
    <Card style={{ marginHorizontal: spacing.inset, marginBottom: spacing.md, borderColor: accent }}>
      <View style={styles.headerRow}>
        <View style={[styles.iconCircle, { backgroundColor: `${accent}${colors.tintAlpha}`, borderRadius: radius.pill }]}>
          <MaterialCommunityIcons name={challengeCategoryIcons[challenge.category]} size={20} color={accent} />
        </View>
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          <Chip label={t(`challenges.categories.${challenge.category}.label`)} color={accent} />
          <Text style={[typography.tiny, { color: colors.textSecondary, marginTop: 2 }]}>{timeAgo(assignment.sentAt)}</Text>
        </View>
        <Chip label={t(`challenges.status.${assignment.status}`)} color={statusColor} />
      </View>

      <Text style={[typography.body, { color: colors.textPrimary, marginTop: spacing.sm }]}>
        {/* challenge.id is a plain string (not a literal union) since Challenge comes
            from mock data — the catalog covers c1..c10 in both dictionaries, so this
            is safe even though TS can't verify it statically. */}
        {t(`challenges.catalog.${challenge.id}.text` as TranslationKey)}
      </Text>

      <View style={[styles.targetRow, { marginTop: spacing.sm, gap: spacing.xs }]}>
        <Avatar uri={userA?.avatarUrl} name={userA?.name ?? '?'} size={24} />
        <Text style={[typography.caption, { color: colors.textPrimary }]}>{userA?.name ?? t('feed.someone')}</Text>
        {userB ? (
          <>
            <MaterialCommunityIcons name="plus" size={14} color={colors.textSecondary} />
            <Avatar uri={userB?.avatarUrl} name={userB?.name ?? '?'} size={24} />
            <Text style={[typography.caption, { color: colors.textPrimary }]}>{userB?.name ?? t('feed.someone')}</Text>
          </>
        ) : null}
        <Text style={[typography.tiny, { color: accent, marginLeft: 'auto' }]}>{t('challenges.points', { points: challenge.points })}</Text>
      </View>

      {assignment.photoEvidenceUrl ? (
        <Text style={[typography.tiny, { color: colors.textSecondary, marginTop: spacing.xs }]}>{t('challenges.withPhotoEvidence')}</Text>
      ) : null}

      {/* Doble consentimiento — retos 'fisico' */}
      {isFisico && assignment.status === 'pendiente' && (isTargetA || isTargetB) ? (
        (() => {
          const alreadyAccepted = isTargetA ? assignment.acceptedByA : assignment.acceptedByB;
          if (alreadyAccepted) {
            return (
              <Text style={[typography.caption, { color: colors.textSecondary, marginTop: spacing.sm }]}>
                {t('challenges.waitingFor', { name: (isTargetA ? userB?.name : userA?.name) ?? t('feed.someone') })}
              </Text>
            );
          }
          return (
            <View style={[styles.actionsRow, { marginTop: spacing.sm, gap: spacing.sm }]}>
              <Button
                label={t('challenges.accept')}
                loading={busy}
                onPress={() => run(() => services.challenges.respondToConsent(assignment.id, currentUserId, true))}
                style={{ flex: 1 }}
              />
              <Button
                label={t('challenges.reject')}
                loading={busy}
                variant="secondary"
                onPress={() => run(() => services.challenges.respondToConsent(assignment.id, currentUserId, false))}
                style={{ flex: 1 }}
              />
            </View>
          );
        })()
      ) : null}

      {/* Autoreporte — retos de un solo objetivo */}
      {!isFisico && assignment.status === 'pendiente' && isTargetA ? (
        <View style={{ marginTop: spacing.sm }}>
          {showPhotoPicker ? (
            <PhotoPicker uri={photoUrl} onChange={setPhotoUrl} label={t('challenges.addPhotoEvidence')} />
          ) : (
            <Pressable onPress={() => setShowPhotoPicker(true)} hitSlop={{ top: 12, bottom: 12 }}>
              <Text style={[typography.caption, { color: colors.accentText, marginBottom: spacing.sm }]}>
                {t('challenges.addPhotoEvidence')}
              </Text>
            </Pressable>
          )}
          <View style={[styles.actionsRow, { gap: spacing.sm, marginTop: spacing.sm }]}>
            <Button
              label={t('challenges.markDone')}
              loading={busy}
              onPress={() => run(() => services.challenges.markDone(assignment.id, currentUserId, photoUrl))}
              style={{ flex: 1 }}
            />
            <Button
              label={t('challenges.skip')}
              loading={busy}
              variant="secondary"
              onPress={() => run(() => services.challenges.skip(assignment.id, currentUserId))}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      ) : null}

      {/* Validación — exclusiva del host */}
      {isHost && assignment.status === 'completado' ? (
        <View style={[styles.actionsRow, { marginTop: spacing.sm, gap: spacing.sm }]}>
          <Button
            label={t('challenges.validate')}
            loading={busy}
            onPress={() => run(() => services.challenges.validate(assignment.id, currentUserId))}
            style={{ flex: 1 }}
          />
          <Button
            label={t('challenges.reject')}
            loading={busy}
            variant="secondary"
            onPress={() => run(() => services.challenges.reject(assignment.id, currentUserId))}
            style={{ flex: 1 }}
          />
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  targetRow: { flexDirection: 'row', alignItems: 'center' },
  actionsRow: { flexDirection: 'row' },
});
