import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LeaderboardRow } from '@/components/leaderboard/LeaderboardRow';
import { ScoreBreakdownSheet } from '@/components/leaderboard/ScoreBreakdownSheet';
import { DrinkLogCard } from '@/components/feed/DrinkLogCard';
import { ParticipantRow } from '@/components/party/ParticipantRow';
import { PartyStatusBadge } from '@/components/party/PartyStatusBadge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useParty } from '@/hooks/useParty';
import { useUsersMap } from '@/hooks/useUsersMap';
import { useTheme } from '@/theme';
import type { LeaderboardEntry } from '@/types';
import { formatDateTime } from '@/utils/date';

type Section = 'feed' | 'members' | 'leaderboard';

export default function PartyDetailScreen() {
  const { partyId } = useLocalSearchParams<{ partyId: string }>();
  const { colors, spacing, radius, typography } = useTheme();
  const { party, members, memberUsers, logs, loading } = useParty(partyId);
  const { usersById } = useUsersMap();
  const { entries } = useLeaderboard(partyId ? { partyId } : null);
  const [section, setSection] = useState<Section>('feed');
  const [selectedEntry, setSelectedEntry] = useState<LeaderboardEntry | null>(null);

  if (!party) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        {!loading && <EmptyState icon="alert-circle-outline" title="Fiesta no encontrada" />}
      </SafeAreaView>
    );
  }

  const handleShare = () => {
    Share.share({ message: `Únete a "${party.name}" en Drinkava con el código ${party.inviteCode}` });
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

        <Button
          label="Registrar bebida en esta fiesta"
          onPress={() => router.push({ pathname: '/drink-log/new', params: { partyId: party.id } })}
          style={{ marginTop: spacing.sm }}
        />
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
            return <ParticipantRow user={user} joinedAt={item.joinedAt} isHost={item.userId === party.hostId} />;
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
