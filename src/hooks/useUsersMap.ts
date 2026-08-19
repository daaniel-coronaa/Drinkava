import { useEffect, useState } from 'react';

import { services } from '@/services';
import type { User } from '@/types';

export function useUsersMap() {
  const [usersById, setUsersById] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    services.users.listAll().then((users) => {
      setUsersById(Object.fromEntries(users.map((u) => [u.id, u])));
      setLoading(false);
    });
  }, []);

  return { usersById, loading };
}
