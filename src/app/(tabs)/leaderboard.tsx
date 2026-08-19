import { useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LeaderboardRow } from '@/components/leaderboard/LeaderboardRow';
import { ScoreBreakdownSheet } from '@/components/leaderboard/ScoreBreakdownSheet';
import { EmptyState } from '@/components/ui/EmptyState';
import { Header } from '@/components/ui/Header';
import { useAuth } from '@/context/AuthContext';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useUsersMap } from '@/hooks/useUsersMap';
import { useTheme } from '@/theme';
import type { LeaderboardEntry } from '@/types';

export default function GlobalLeaderboardScreen() {
  const { colors } = useTheme();
  const { session } = useAuth();
  const { entries, loading, refetch } = useLeaderboard(session ? { userId: session.user.id } : null);
  const { usersById } = useUsersMap();
  const [selectedEntry, setSelectedEntry] = useState<LeaderboardEntry | null>(null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <Header title="Ranking" subtitle="Tu grupo de amigos, todas las fiestas" />
      <FlatList
        data={entries}
        keyExtractor={(e) => e.userId}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.accentPrimary} />}
        ListEmptyComponent={!loading ? <EmptyState icon="trophy-outline" title="Aún no hay ranking" /> : null}
        renderItem={({ item }) => (
          <LeaderboardRow entry={item} user={usersById[item.userId]} onPress={() => setSelectedEntry(item)} />
        )}
      />
      <ScoreBreakdownSheet
        visible={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
        entry={selectedEntry}
        userName={selectedEntry ? usersById[selectedEntry.userId]?.name : undefined}
      />
    </SafeAreaView>
  );
}
