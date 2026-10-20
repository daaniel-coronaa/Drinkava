import type { FriendService } from '@/services/interfaces/FriendService';
import type { Friendship } from '@/types';

import { delay, mockDb } from './mockDb';

const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

const involves = (f: Friendship, a: string, b: string) =>
  (f.userId === a && f.friendId === b) || (f.userId === b && f.friendId === a);

export const MockFriendService: FriendService = {
  async search(userId, query) {
    await mockDb.ensureLoaded();
    await delay();
    const q = normalize(query);
    if (!q) return [];
    return mockDb.get('users').filter((u) => u.id !== userId && normalize(u.name).includes(q));
  },

  async listFriends(userId) {
    await mockDb.ensureLoaded();
    await delay();
    const ids = new Set(
      mockDb
        .get('friendships')
        .filter((f) => f.userId === userId || f.friendId === userId)
        .map((f) => (f.userId === userId ? f.friendId : f.userId)),
    );
    return mockDb.get('users').filter((u) => ids.has(u.id));
  },

  async add(userId, friendId) {
    await mockDb.ensureLoaded();
    await delay();
    const friendships = mockDb.get('friendships');
    if (userId === friendId || friendships.some((f) => involves(f, userId, friendId))) return;
    mockDb.set('friendships', [...friendships, { userId, friendId, createdAt: new Date().toISOString() }]);
  },

  async remove(userId, friendId) {
    await mockDb.ensureLoaded();
    await delay();
    mockDb.set(
      'friendships',
      mockDb.get('friendships').filter((f) => !involves(f, userId, friendId)),
    );
  },
};
