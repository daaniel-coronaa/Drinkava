import { computeBalancedScore } from '@/domain/leaderboard/computeBalancedScore';
import type { LeaderboardService } from '@/services/interfaces/LeaderboardService';
import type { DrinkLog, LeaderboardEntry } from '@/types';

import { delay, mockDb } from './mockDb';

function uniqueTypeCount(logs: DrinkLog[]) {
  return new Set(logs.map((l) => (l.drinkType === 'other' ? `other:${l.customLabel ?? ''}` : l.drinkType))).size;
}

function rankEntries(entries: Omit<LeaderboardEntry, 'rank'>[]): LeaderboardEntry[] {
  return [...entries]
    .sort((a, b) => b.score - a.score)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

export const MockLeaderboardService: LeaderboardService = {
  async getPartyLeaderboard(partyId: string) {
    await mockDb.ensureLoaded();
    await delay();

    const members = mockDb.get('partyMembers').filter((m) => m.partyId === partyId);
    const partyLogs = mockDb.get('drinkLogs').filter((d) => d.partyId === partyId);
    const kudos = mockDb.get('kudos');
    const comments = mockDb.get('comments');

    const entries = members.map((member) => {
      const userLogs = partyLogs.filter((l) => l.userId === member.userId);
      const userLogIds = new Set(userLogs.map((l) => l.id));
      const kudosReceived = kudos.filter((k) => userLogIds.has(k.drinkLogId)).length;
      const commentsReceived = comments.filter((c) => userLogIds.has(c.drinkLogId)).length;
      const drinkCount = userLogs.reduce((sum, l) => sum + l.quantity, 0);
      const uniqueTypes = uniqueTypeCount(userLogs);

      const { score, breakdown } = computeBalancedScore({
        drinkCount,
        uniqueTypes,
        kudosReceived,
        partiesAttended: 0,
        commentsReceived,
      });

      return { userId: member.userId, score, breakdown, drinkCount, uniqueTypes, kudosReceived, partiesAttended: 0 };
    });

    return rankEntries(entries);
  },

  async getGlobalLeaderboard(userId: string) {
    await mockDb.ensureLoaded();
    await delay();

    const myPartyIds = new Set(
      mockDb
        .get('partyMembers')
        .filter((m) => m.userId === userId)
        .map((m) => m.partyId),
    );
    const friendIds = new Set(
      mockDb
        .get('partyMembers')
        .filter((m) => myPartyIds.has(m.partyId))
        .map((m) => m.userId),
    );

    const allLogs = mockDb.get('drinkLogs');
    const kudos = mockDb.get('kudos');
    const comments = mockDb.get('comments');
    const allMembers = mockDb.get('partyMembers');

    const entries = Array.from(friendIds).map((id) => {
      const userLogs = allLogs.filter((l) => l.userId === id);
      const userLogIds = new Set(userLogs.map((l) => l.id));
      const kudosReceived = kudos.filter((k) => userLogIds.has(k.drinkLogId)).length;
      const commentsReceived = comments.filter((c) => userLogIds.has(c.drinkLogId)).length;
      const drinkCount = userLogs.reduce((sum, l) => sum + l.quantity, 0);
      const uniqueTypes = uniqueTypeCount(userLogs);
      const partiesAttended = new Set(allMembers.filter((m) => m.userId === id).map((m) => m.partyId)).size;

      const { score, breakdown } = computeBalancedScore({
        drinkCount,
        uniqueTypes,
        kudosReceived,
        partiesAttended,
        commentsReceived,
      });

      return { userId: id, score, breakdown, drinkCount, uniqueTypes, kudosReceived, partiesAttended };
    });

    return rankEntries(entries);
  },
};
