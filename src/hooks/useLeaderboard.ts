import { useCallback, useEffect, useState } from 'react';

import { services } from '@/services';
import type { LeaderboardEntry } from '@/types';

export function useLeaderboard(scope: { partyId: string } | { userId: string } | null) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const scopeKey = scope ? ('partyId' in scope ? `party:${scope.partyId}` : `user:${scope.userId}`) : null;

  const refetch = useCallback(async () => {
    if (!scope) return;
    setLoading(true);
    const result =
      'partyId' in scope
        ? await services.leaderboard.getPartyLeaderboard(scope.partyId)
        : await services.leaderboard.getGlobalLeaderboard(scope.userId);
    setEntries(result);
    setLoading(false);
    // scope is a fresh object each render; scopeKey is its stable identity and the correct dependency here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeKey]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { entries, loading, refetch };
}
