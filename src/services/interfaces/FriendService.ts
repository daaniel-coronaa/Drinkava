import type { User } from '@/types';

export interface FriendService {
  // Finds people by name (case/accent-insensitive), excluding the user themself.
  // SEAM: mock searches every seed user; a real impl would query a users index.
  search(userId: string, query: string): Promise<User[]>;
  listFriends(userId: string): Promise<User[]>;
  // Friendships are mutual and take effect immediately (no request/accept step yet).
  add(userId: string, friendId: string): Promise<void>;
  remove(userId: string, friendId: string): Promise<void>;
}
