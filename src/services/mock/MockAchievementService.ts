import { evaluateQualifyingAchievements } from '@/domain/achievements/evaluateAchievements';
import type { AchievementService } from '@/services/interfaces/AchievementService';
import type { Achievement } from '@/types';
import { generateId } from '@/utils/id';

import { achievementCatalog, delay, mockDb } from './mockDb';

export const MockAchievementService: AchievementService = {
  async listDefinitions() {
    return achievementCatalog;
  },

  async listForUser(userId: string) {
    await mockDb.ensureLoaded();
    await delay();
    return mockDb.get('achievements').filter((a) => a.userId === userId);
  },

  async evaluateAndUnlock(userId: string) {
    await mockDb.ensureLoaded();
    const qualifying = evaluateQualifyingAchievements(userId, {
      drinkLogs: mockDb.get('drinkLogs'),
      partyMembers: mockDb.get('partyMembers'),
      parties: mockDb.get('parties'),
      kudos: mockDb.get('kudos'),
      comments: mockDb.get('comments'),
    });

    const existing = mockDb.get('achievements').filter((a) => a.userId === userId);
    const existingKeys = new Set(existing.map((a) => a.achievementKey));
    const newlyUnlocked: Achievement[] = qualifying
      .filter((key) => !existingKeys.has(key))
      .map((key) => ({ id: generateId(), userId, achievementKey: key, unlockedAt: new Date().toISOString() }));

    if (newlyUnlocked.length > 0) {
      mockDb.set('achievements', [...mockDb.get('achievements'), ...newlyUnlocked]);
    }
    return newlyUnlocked;
  },
};
