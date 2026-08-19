import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, Platform, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DisclaimerBanner } from '@/components/compliance/DisclaimerBanner';
import { LeaderboardRow } from '@/components/leaderboard/LeaderboardRow';
import { ScoreBreakdownSheet } from '@/components/leaderboard/ScoreBreakdownSheet';
import { DrinkLogCard } from '@/components/feed/DrinkLogCard';
import { ParticipantRow } from '@/components/party/ParticipantRow';
import { PartyStatusBadge } from '@/components/party/PartyStatusBadge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/context/AuthContext';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useParty } from '@/hooks/useParty';
import { useUsersMap } from '@/hooks/useUsersMap';
import { services } from '@/services';
import { useTheme } from '@/theme';
import type { LeaderboardEntry } from '@/types';
import { formatDateTime } from '@/utils/date';

type Section = 'feed' | 'members' | 'leaderboard';

export default function PartyDetailScreen() {
  const { partyId } = useLocalSearchParams<{ partyId: string }>();
  const { colors, spacing, radius, typography } = useTheme();
  const { session } = useAuth();
  const { party, members, memberUsers, logs, loading, refetch } = useParty(partyId);
  const { usersById } = useUsersMap();
  const { entries } = useLeaderboard(partyId ? { partyId } : null);
  const [section, setSection] = useState<Section>('feed');
  const [selectedEntry, setSelectedEntry] = useState<LeaderboardEntry | null>(null);
  const [finishing, setFinishing] = useState(false);
  const [leaving, setLeaving] = useState(false);

  if (!party) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        {!loading && <EmptyState icon="alert-circle-outline" title="Fiesta no encontrada" />}
      </SafeAreaView>
    );
  }

  const myRole = members.find((m) => m.userId === session?.user.id)?.role;
  const isAdmin = myRole === 'admin';

  const handleShare = () => {
    Share.share({
      message: `Únete a "${party.name}" en Drinkava con el código ${party.inviteCode} o este link: drinkava://party/join?code=${party.inviteCode}`,
    });
  };

  const finishParty = async () => {
    if (!session) return;
    setFinishing(true);
    try {
      await services.parties.updateStatus(party.id, 'finished', session.user.id);
      await refetch();
    } finally {
      setFinishing(false);
    }
  };

  const handleFinishParty = () => {
    const message = `¿Seguro que quieres terminar "${party.name}"? Ya no se podrán registrar más bebidas.`;
    // Alert.alert has no visual implementation on web — fall back to window.confirm there.
    if (Platform.OS === 'web') {
      if (window.confirm(message)) finishParty();
      return;
    }
    Alert.alert('Terminar fiesta', message, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Terminar', style: 'destructive', onPress: finishParty },
    ]);
  };

  const leaveParty = async () => {
    if (!session) return;
    setLeaving(true);
    try {
      await services.parties.leave(party.id, session.user.id);
      router.replace('/(tabs)/parties');
    } finally {
      setLeaving(false);
    }
  };

  const handleLeaveParty = () => {
    const message = `¿Seguro que quieres salir de "${party.name}"? Tendrás que volver a unirte con el código si cambias de opinión.`;
    if (Platform.OS === 'web') {
      if (window.confirm(message)) leaveParty();
      return;
    }
    Alert.alert('Salir de la fiesta', message, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: leaveParty },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['bottom']}>
      <View style={{ padding: spacing.md, gap: spacing.xs }}>
        <View style={styles.row}>
          <Text style={[typography.h2, { color: colors.textPrimary, flex: 1 }]}>{party.name}</Text>
          <PartyStatusBadge status={party.status} />
        </View>
        <Text style={[typography.caption, { color: colors.textSecondary }]}>{formatDateTime(party.date)}</Text>
        {party.location ? (
          <Text style={[typography.caption, { color: colors.textSecondary }]}>{party.location}</Text>
        ) : null}

        <Pressable onPress={handleShare} style={[styles.row, { marginTop: spacing.xs }]}>
          <MaterialCommunityIcons name="share-variant-outline" size={16} color={colors.accentPrimary} />
          <Text style={[typography.caption, { color: colors.accentPrimary, marginLeft: 6 }]}>
            Código {party.inviteCode} · Compartir invitación
          </Text>
        </Pressable>

        {party.status === 'active' ? (
          <Button
            label="Registrar bebida en esta fiesta"
            onPress={() => router.push({ pathname: '/drink-log/new', params: { partyId: party.id } })}
            style={{ marginTop: spacing.sm }}
          />
        ) : (
          <Text style={[typography.caption, { color: colors.textSecondary, marginTop: spacing.sm }]}>
            Esta fiesta ya terminó — no se pueden registrar más bebidas.
          </Text>
        )}

        {isAdmin && party.status === 'active' ? (
          <Button
            label="Terminar fiesta"
            onPress={handleFinishParty}
            loading={finishing}
            variant="secondary"
            style={{ marginTop: spacing.xs }}
          />
        ) : null}

        {!isAdmin && myRole ? (
          <Button
            label="Salir de la fiesta"
            onPress={handleLeaveParty}
            loading={leaving}
            variant="secondary"
            style={{ marginTop: spacing.xs }}
          />
        ) : null}
      </View>

      <View style={[styles.segmented, { marginHorizontal: spacing.md, marginBottom: spacing.sm, backgroundColor: colors.surfaceElevated, borderRadius: radius.md }]}>
        {(
          [
            ['feed', 'Feed'],
            ['members', 'Miembros'],
            ['leaderboard', 'Ranking'],
          ] as [Section, string][]
        ).map(([key, label]) => (
          <Pressable
            key={key}
            onPress={() => setSection(key)}
            style={[styles.segment, { borderRadius: radius.sm, backgroundColor: section === key ? colors.accentPrimary : 'transparent' }]}
          >
            <Text style={[typography.caption, { color: section === key ? '#FFFFFF' : colors.textSecondary, textAlign: 'center' }]}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      {section === 'feed' && (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={<DisclaimerBanner />}
          ListEmptyComponent={<EmptyState icon="glass-cocktail" title="Nadie ha registrado nada aún" />}
          renderItem={({ item }) => <DrinkLogCard drinkLog={item} usersById={usersById} />}
        />
      )}

      {section === 'members' && (
        <FlatList
          data={members}
          keyExtractor={(m) => m.userId}
          renderItem={({ item }) => {
            const user = memberUsers.find((u) => u.id === item.userId);
            if (!user) return null;
            return <ParticipantRow user={user} joinedAt={item.joinedAt} role={item.role} />;
          }}
        />
      )}

      {section === 'leaderboard' && (
        <FlatList
          data={entries}
          keyExtractor={(e) => e.userId}
          ListEmptyComponent={<EmptyState icon="trophy-outline" title="Aún no hay ranking" />}
          renderItem={({ item }) => (
            <LeaderboardRow entry={item} user={usersById[item.userId]} onPress={() => setSelectedEntry(item)} />
          )}
        />
      )}

      <ScoreBreakdownSheet
        visible={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
        entry={selectedEntry}
        userName={selectedEntry ? usersById[selectedEntry.userId]?.name : undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  segmented: { flexDirection: 'row', padding: 4 },
  segment: { flex: 1, paddingVertical: 8 },
});
