import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { PhotoPicker } from '@/components/drink-log/PhotoPicker';
import { challengeCatalog, services } from '@/services';
import { useTheme } from '@/theme';
import type { ChallengeAssignment, ChallengeAssignmentStatus, User } from '@/types';
import { timeAgo } from '@/utils/date';
import { challengeCategoryIcons, challengeCategoryLabels } from '@/utils/challengeCategory';

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

const STATUS_LABELS: Record<ChallengeAssignmentStatus, string> = {
  pendiente: 'Pendiente',
  completado: 'Por validar',
  validado: 'Validado',
  rechazado: 'Rechazado',
  pasado: 'Pasado',
};

export function ChallengeCard({ assignment, usersById, currentUserId, isHost, onChanged }: Props) {
  const { colors, spacing, radius, typography, challengeCategoryColors } = useTheme();
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
        ? '#E5484D'
        : assignment.status === 'completado'
          ? colors.accentInfo
          : colors.textSecondary;

  return (
    <Card style={{ marginHorizontal: spacing.md, marginBottom: spacing.sm, borderColor: accent }}>
      <View style={styles.headerRow}>
        <View style={[styles.iconCircle, { backgroundColor: `${accent}22`, borderRadius: radius.pill }]}>
          <MaterialCommunityIcons name={challengeCategoryIcons[challenge.category]} size={20} color={accent} />
        </View>
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          <Chip label={challengeCategoryLabels[challenge.category]} color={accent} />
          <Text style={[typography.tiny, { color: colors.textSecondary, marginTop: 2 }]}>{timeAgo(assignment.sentAt)}</Text>
        </View>
        <Chip label={STATUS_LABELS[assignment.status]} color={statusColor} />
      </View>

      <Text style={[typography.body, { color: colors.textPrimary, marginTop: spacing.sm }]}>{challenge.text}</Text>

      <View style={[styles.targetRow, { marginTop: spacing.sm, gap: spacing.xs }]}>
        <Avatar uri={userA?.avatarUrl} name={userA?.name ?? '?'} size={24} />
        <Text style={[typography.caption, { color: colors.textPrimary }]}>{userA?.name ?? 'Alguien'}</Text>
        {userB ? (
          <>
            <MaterialCommunityIcons name="plus" size={14} color={colors.textSecondary} />
            <Avatar uri={userB?.avatarUrl} name={userB?.name ?? '?'} size={24} />
            <Text style={[typography.caption, { color: colors.textPrimary }]}>{userB?.name ?? 'Alguien'}</Text>
          </>
        ) : null}
        <Text style={[typography.tiny, { color: accent, marginLeft: 'auto' }]}>+{challenge.points} pts</Text>
      </View>

      {assignment.photoEvidenceUrl ? (
        <Text style={[typography.tiny, { color: colors.textSecondary, marginTop: spacing.xs }]}>📷 Con foto de evidencia</Text>
      ) : null}

      {/* Doble consentimiento — retos 'fisico' */}
      {isFisico && assignment.status === 'pendiente' && (isTargetA || isTargetB) ? (
        (() => {
          const alreadyAccepted = isTargetA ? assignment.acceptedByA : assignment.acceptedByB;
          if (alreadyAccepted) {
            return (
              <Text style={[typography.caption, { color: colors.textSecondary, marginTop: spacing.sm }]}>
                Ya aceptaste — esperando a {isTargetA ? userB?.name : userA?.name}.
              </Text>
            );
          }
          return (
            <View style={[styles.actionsRow, { marginTop: spacing.sm, gap: spacing.sm }]}>
              <Button
                label="Aceptar"
                loading={busy}
                onPress={() => run(() => services.challenges.respondToConsent(assignment.id, currentUserId, true))}
                style={{ flex: 1 }}
              />
              <Button
                label="Rechazar"
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
            <PhotoPicker uri={photoUrl} onChange={setPhotoUrl} label="Agregar foto de evidencia (opcional)" />
          ) : (
            <Pressable onPress={() => setShowPhotoPicker(true)}>
              <Text style={[typography.caption, { color: colors.accentPrimary, marginBottom: spacing.sm }]}>
                + Agregar foto de evidencia (opcional)
              </Text>
            </Pressable>
          )}
          <View style={[styles.actionsRow, { gap: spacing.sm, marginTop: spacing.sm }]}>
            <Button
              label="Marcar como hecho"
              loading={busy}
              onPress={() => run(() => services.challenges.markDone(assignment.id, currentUserId, photoUrl))}
              style={{ flex: 1 }}
            />
            <Button
              label="Saltar"
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
            label="Validar"
            loading={busy}
            onPress={() => run(() => services.challenges.validate(assignment.id, currentUserId))}
            style={{ flex: 1 }}
          />
          <Button
            label="Rechazar"
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
