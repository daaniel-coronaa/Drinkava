import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { services } from '@/services';
import type { ChallengeAssignment, DrinkLog, Party, PartyMember, User } from '@/types';

export function useParty(partyId: string | undefined) {
  const [party, setParty] = useState<Party | null>(null);
  const [members, setMembers] = useState<PartyMember[]>([]);
  const [memberUsers, setMemberUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<DrinkLog[]>([]);
  const [challengeAssignments, setChallengeAssignments] = useState<ChallengeAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async ({ silent = false }: { silent?: boolean } = {}) => {
    if (!partyId) return;
    if (!silent) setLoading(true);
    const [p, m, l, c] = await Promise.all([
      services.parties.get(partyId),
      services.parties.listMembers(partyId),
      services.drinkLogs.listByParty(partyId),
      services.challenges.listAssignmentsForParty(partyId),
    ]);
    setParty(p);
    setMembers(m);
    setLogs(l);
    setChallengeAssignments(c);
    const users = await Promise.all(m.map((member) => services.users.getProfile(member.userId)));
    setMemberUsers(users.filter((u): u is User => !!u));
    setLoading(false);
  }, [partyId]);

  // Refresh whenever the screen regains focus (e.g. back from logging a drink) — silently,
  // so returning to a screen never flashes a loading spinner.
  useFocusEffect(
    useCallback(() => {
      refetch({ silent: true });
    }, [refetch]),
  );

  return { party, members, memberUsers, logs, challengeAssignments, loading, refetch };
}
