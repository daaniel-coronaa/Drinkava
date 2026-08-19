import { useCallback, useEffect, useState } from 'react';

import { services } from '@/services';
import type { Party, PartyStatus } from '@/types';

export function useParties(filter?: PartyStatus) {
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    const result = await services.parties.list(filter);
    setParties(result);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { parties, loading, refetch };
}
