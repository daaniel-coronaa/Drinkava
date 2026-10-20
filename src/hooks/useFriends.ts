import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { services } from '@/services';
import type { DrinkLog, Party, User } from '@/types';

export type FriendStats = { drinks: number; parties: number };
export type FriendActivity = { log: DrinkLog; user: User; party?: Party };

// Friends of `userId`, a small stats summary for each, and a newest-first feed of what
// they've been logging across every party.
export function useFriends(userId: string | undefined) {
  const [friends, setFriends] = useState<User[]>([]);
  const [statsById, setStatsById] = useState<Record<string, FriendStats>>({});
  const [activity, setActivity] = useState<FriendActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async ({ silent = false }: { silent?: boolean } = {}) => {
    if (!userId) return;
    if (!silent) setLoading(true);
    const [list, allParties] = await Promise.all([services.friends.listFriends(userId), services.parties.list()]);
    const partiesById = new Map(allParties.map((p) => [p.id, p]));

    const perFriend = await Promise.all(
      list.map(async (friend) => {
        const [logs, parties] = await Promise.all([
          services.drinkLogs.listByUser(friend.id),
          services.parties.listForUser(friend.id),
        ]);
        return { friend, logs, parties };
      }),
    );

    setFriends(list);
    setStatsById(
      Object.fromEntries(
        perFriend.map(({ friend, logs, parties }) => [
          friend.id,
          { drinks: logs.reduce((sum, l) => sum + l.quantity, 0), parties: parties.length },
        ]),
      ),
    );
    setActivity(
      perFriend
        .flatMap(({ friend, logs }) => logs.map((log) => ({ log, user: friend, party: partiesById.get(log.partyId) })))
        .sort((a, b) => (a.log.timestamp < b.log.timestamp ? 1 : -1))
        .slice(0, 30),
    );
    setLoading(false);
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      refetch({ silent: true });
    }, [refetch]),
  );

  return { friends, statsById, activity, loading, refetch };
}
