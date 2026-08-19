import type { UserService } from '@/services/interfaces/UserService';
import type { User } from '@/types';

import { delay, mockDb } from './mockDb';

export const MockUserService: UserService = {
  async getProfile(userId: string) {
    await mockDb.ensureLoaded();
    await delay();
    return mockDb.get('users').find((u) => u.id === userId) ?? null;
  },

  async updateProfile(userId: string, patch: Partial<Pick<User, 'name' | 'avatarUrl'>>) {
    await mockDb.ensureLoaded();
    await delay();
    const users = mockDb.get('users').map((u) => (u.id === userId ? { ...u, ...patch } : u));
    mockDb.set('users', users);
    return users.find((u) => u.id === userId)!;
  },

  async listAll() {
    await mockDb.ensureLoaded();
    await delay();
    return mockDb.get('users');
  },
};
