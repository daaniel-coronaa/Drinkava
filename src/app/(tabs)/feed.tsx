import { useEffect, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DisclaimerBanner } from '@/components/compliance/DisclaimerBanner';
import { DrinkLogCard } from '@/components/feed/DrinkLogCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Header } from '@/components/ui/Header';
import { useAuth } from '@/context/AuthContext';
import { useFeed } from '@/hooks/useFeed';
import { useUsersMap } from '@/hooks/useUsersMap';
import { services } from '@/services';
import { useTheme } from '@/theme';
import type { Party } from '@/types';

export default function FeedScreen() {
  const { colors } = useTheme();
  const { session } = useAuth();
  const { logs, loading, refetch } = useFeed(session?.user.id);
  const { usersById } = useUsersMap();
  const [partiesById, setPartiesById] = useState<Record<string, Party>>({});

  useEffect(() => {
    services.parties.list().then((parties) => {
      setPartiesById(Object.fromEntries(parties.map((p) => [p.id, p])));
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <Header title="Feed" subtitle="Lo último de tu grupo" />
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.accentPrimary} />}
        ListHeaderComponent={<DisclaimerBanner />}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon="party-popper"
              title="Aún no hay actividad"
              description="Únete a una fiesta y registra tu primer trago para verlo aquí."
            />
          ) : null
        }
        renderItem={({ item }) => (
          <DrinkLogCard drinkLog={item} usersById={usersById} partyName={partiesById[item.partyId]?.name} />
        )}
      />
    </SafeAreaView>
  );
}
