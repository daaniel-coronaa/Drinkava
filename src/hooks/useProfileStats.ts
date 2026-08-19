import { useCallback, useEffect, useState } from 'react';

import { services } from '@/services';
import type { DrinkLog, LeaderboardEntry, Party } from '@/types';
import { drinkTypeLabels } from '@/utils/drinkType';

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

  const favoriteType = (() => {
    if (logs.length === 0) return null;
    const counts = new Map<string, number>();
    logs.forEach((l) => counts.set(l.drinkType, (counts.get(l.drinkType) ?? 0) + l.quantity));
    const [top] = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    return top ? drinkTypeLabels[top[0] as keyof typeof drinkTypeLabels] : null;
  })();

  const totalDrinks = logs.reduce((sum, l) => sum + l.quantity, 0);

  return { logs, parties, globalEntry, totalDrinks, favoriteType, loading, refetch };
}
