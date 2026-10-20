import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { services } from '@/services';
import type { LeaderboardEntry } from '@/types';

export function useLeaderboard(scope: { partyId: string } | { userId: string } | null) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const scopeKey = scope ? ('partyId' in scope ? `party:${scope.partyId}` : `user:${scope.userId}`) : null;

  const refetch = useCallback(async ({ silent = false }: { silent?: boolean } = {}) => {
    if (!scope) return;
    if (!silent) setLoading(true);
    const result =
      'partyId' in scope
        ? await services.leaderboard.getPartyLeaderboard(scope.partyId)
        : await services.leaderboard.getGlobalLeaderboard(scope.userId);
    setEntries(result);
    setLoading(false);
    // scope is a fresh object each render; scopeKey is its stable identity and the correct dependency here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeKey]);

  // Refresh whenever the screen regains focus (e.g. back from logging a drink) — silently,
  // so returning to a screen never flashes a loading spinner.
  useFocusEffect(
    useCallback(() => {
      refetch({ silent: true });
    }, [refetch]),
  );

  return { entries, loading, refetch };
}
