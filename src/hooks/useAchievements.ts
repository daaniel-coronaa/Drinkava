import { useCallback, useEffect, useState } from 'react';

import { services } from '@/services';
import type { Achievement, AchievementDefinition } from '@/types';

export function useAchievements(userId: string | undefined) {
  const [definitions, setDefinitions] = useState<AchievementDefinition[]>([]);
  const [unlocked, setUnlocked] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const [defs, mine] = await Promise.all([
      services.achievements.listDefinitions(),
      services.achievements.listForUser(userId),
    ]);
    setDefinitions(defs);
    setUnlocked(mine);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { definitions, unlocked, loading, refetch };
}
