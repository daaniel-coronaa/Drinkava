import type { AchievementKey, DrinkLog, Kudos, Party, PartyMember } from '@/types';

export type AchievementSnapshot = {
  drinkLogs: DrinkLog[];
  partyMembers: PartyMember[];
  parties: Party[];
  kudos: Kudos[];
};

const STREAK_WINDOW_DAYS = 30;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function hasPartyStreak(distinctDates: number[]) {
  if (distinctDates.length < 3) return false;
  const sorted = [...distinctDates].sort((a, b) => a - b);
  for (let i = 0; i + 2 < sorted.length; i++) {
    if ((sorted[i + 2] - sorted[i]) / MS_PER_DAY <= STREAK_WINDOW_DAYS) return true;
  }
  return false;
}

// Pure, snapshot-based so it can later move to a Postgres function / Edge Function
// trigger without changing the decision logic.
export function evaluateQualifyingAchievements(userId: string, snapshot: AchievementSnapshot): AchievementKey[] {
  const myMemberships = snapshot.partyMembers.filter((m) => m.userId === userId);
  const myLogs = snapshot.drinkLogs.filter((l) => l.userId === userId);
  const myLogIds = new Set(myLogs.map((l) => l.id));
  const kudosReceived = snapshot.kudos.filter((k) => myLogIds.has(k.drinkLogId)).length;

  const qualifying: AchievementKey[] = [];

  if (myMemberships.length >= 1) qualifying.push('first_party');

  const uniqueDrinks = new Set(
    myLogs.map((l) => (l.drinkType === 'other' ? `other:${l.customLabel ?? ''}` : l.drinkType)),
  );
  if (uniqueDrinks.size >= 10) qualifying.push('variety_10');

  const partyDates = myMemberships
    .map((m) => snapshot.parties.find((p) => p.id === m.partyId)?.date)
    .filter((d): d is string => !!d)
    .map((d) => new Date(d).getTime());
  if (hasPartyStreak([...new Set(partyDates)])) qualifying.push('party_streak_3');

  if (kudosReceived >= 25) qualifying.push('kudos_master');

  const hostedParties = snapshot.parties.filter((p) => p.hostId === userId);
  const hostedWithEnoughGuests = hostedParties.some(
    (p) => snapshot.partyMembers.filter((m) => m.partyId === p.id).length >= 5,
  );
  if (hostedWithEnoughGuests) qualifying.push('host_debut');

  return qualifying;
}
