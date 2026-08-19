import type { DrinkLogService } from '@/services/interfaces/DrinkLogService';
import type { Comment, CreateDrinkLogInput, DrinkLog } from '@/types';
import { generateId } from '@/utils/id';

import { DEFAULT_DEMO_USER_ID, delay, mockDb } from './mockDb';

function sortByTimestampDesc(logs: DrinkLog[]) {
  return [...logs].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
}

// SEAM: photoUrl is a local file URI here. Real impl uploads to Supabase Storage
// and stores the resulting signed URL; this is also where Phase 2 AI photo
// validation (Claude/GPT-4V) would hook in before/after upload.
export const MockDrinkLogService: DrinkLogService = {
  async listByParty(partyId: string) {
    await mockDb.ensureLoaded();
    await delay();
    return sortByTimestampDesc(mockDb.get('drinkLogs').filter((d) => d.partyId === partyId));
  },

  async listByUser(userId: string) {
    await mockDb.ensureLoaded();
    await delay();
    return sortByTimestampDesc(mockDb.get('drinkLogs').filter((d) => d.userId === userId));
  },

  async create(input: CreateDrinkLogInput) {
    await mockDb.ensureLoaded();
    await delay();
    const log: DrinkLog = {
      id: generateId(),
      userId: DEFAULT_DEMO_USER_ID,
      partyId: input.partyId,
      drinkType: input.drinkType,
      customLabel: input.customLabel,
      quantity: input.quantity,
      photoUrl: input.photoUrl,
      timestamp: input.timestamp ?? new Date().toISOString(),
    };
    mockDb.set('drinkLogs', [...mockDb.get('drinkLogs'), log]);
    return log;
  },

  async addKudos(drinkLogId: string, userId: string) {
    await mockDb.ensureLoaded();
    await delay(80, 200);
    const existing = mockDb.get('kudos').some((k) => k.drinkLogId === drinkLogId && k.userId === userId);
    if (existing) return;
    mockDb.set('kudos', [
      ...mockDb.get('kudos'),
      { id: generateId(), drinkLogId, userId, createdAt: new Date().toISOString() },
    ]);
  },

  async removeKudos(drinkLogId: string, userId: string) {
    await mockDb.ensureLoaded();
    await delay(80, 200);
    mockDb.set(
      'kudos',
      mockDb.get('kudos').filter((k) => !(k.drinkLogId === drinkLogId && k.userId === userId)),
    );
  },

  async listKudos(drinkLogId: string) {
    await mockDb.ensureLoaded();
    return mockDb
      .get('kudos')
      .filter((k) => k.drinkLogId === drinkLogId)
      .map((k) => k.userId);
  },

  async addComment(drinkLogId: string, userId: string, text: string) {
    await mockDb.ensureLoaded();
    await delay();
    const comment: Comment = { id: generateId(), drinkLogId, userId, text, createdAt: new Date().toISOString() };
    mockDb.set('comments', [...mockDb.get('comments'), comment]);
    return comment;
  },

  async listComments(drinkLogId: string) {
    await mockDb.ensureLoaded();
    return mockDb
      .get('comments')
      .filter((c) => c.drinkLogId === drinkLogId)
      .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
  },
};
