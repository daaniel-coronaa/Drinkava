import { useCallback, useEffect, useState } from 'react';

import { services } from '@/services';
import type { DrinkLog, DrinkType, LeaderboardEntry, Party } from '@/types';

export function useProfileStats(userId: string | undefined) {
  const [logs, setLogs] = useState<DrinkLog[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [globalEntry, setGlobalEntry] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const [userLogs, userParties, leaderboard] = await Promise.all([
      services.drinkLogs.listByUser(userId),
      services.parties.listForUser(userId),
      services.leaderboard.getGlobalLeaderboard(userId),
    ]);
    setLogs(userLogs);
    setParties(userParties);
    setGlobalEntry(leaderboard.find((e) => e.userId === userId) ?? null);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const favoriteType: DrinkType | null = (() => {
    if (logs.length === 0) return null;
    const counts = new Map<DrinkType, number>();
    logs.forEach((l) => counts.set(l.drinkType, (counts.get(l.drinkType) ?? 0) + l.quantity));
    const [top] = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    return top ? top[0] : null;
  })();

  const totalDrinks = logs.reduce((sum, l) => sum + l.quantity, 0);

  return { logs, parties, globalEntry, totalDrinks, favoriteType, loading, refetch };
}
