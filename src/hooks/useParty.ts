import { useCallback, useEffect, useState } from 'react';

import { services } from '@/services';
import type { ChallengeAssignment, DrinkLog, Party, PartyMember, User } from '@/types';

export function useParty(partyId: string | undefined) {
  const [party, setParty] = useState<Party | null>(null);
  const [members, setMembers] = useState<PartyMember[]>([]);
  const [memberUsers, setMemberUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<DrinkLog[]>([]);
  const [challengeAssignments, setChallengeAssignments] = useState<ChallengeAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!partyId) return;
    setLoading(true);
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

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { party, members, memberUsers, logs, challengeAssignments, loading, refetch };
}
