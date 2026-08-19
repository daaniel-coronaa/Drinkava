import { useCallback, useEffect, useState } from 'react';

import { services } from '@/services';
import type { DrinkLog } from '@/types';

export function useFeed(userId: string | undefined) {
  const [logs, setLogs] = useState<DrinkLog[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const result = await services.drinkLogs.listFeed(userId);
    setLogs(result);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { logs, loading, refetch };
}
