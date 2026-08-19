import type { User } from '@/types';

export interface UserService {
  getProfile(userId: string): Promise<User | null>;
  updateProfile(userId: string, patch: Partial<Pick<User, 'name' | 'avatarUrl'>>): Promise<User>;
  // SEAM: mock returns every seed user (closed demo friend group). Real impl should
  // scope this to the user's actual friends/contacts.
  listAll(): Promise<User[]>;
}
