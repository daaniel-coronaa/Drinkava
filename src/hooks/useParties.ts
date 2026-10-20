import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { services } from '@/services';
import type { Party, PartyStatus } from '@/types';

export function useParties(filter?: PartyStatus) {
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async ({ silent = false }: { silent?: boolean } = {}) => {
    if (!silent) setLoading(true);
    const result = await services.parties.list(filter);
    setParties(result);
    setLoading(false);
  }, [filter]);

  // Refresh whenever the screen regains focus (e.g. back from logging a drink) — silently,
  // so returning to a screen never flashes a loading spinner.
  useFocusEffect(
    useCallback(() => {
      refetch({ silent: true });
    }, [refetch]),
  );

  return { parties, loading, refetch };
}
