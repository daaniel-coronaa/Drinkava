import type { Friendship } from '@/types';

// The demo user starts out friends with the two people who run the seeded party; the
// others can be found through the search to try adding someone new.
export const seedFriendships: Friendship[] = [
  { userId: 'u1', friendId: 'u2', createdAt: '2026-01-06T10:00:00.000Z' },
  { userId: 'u1', friendId: 'u3', createdAt: '2026-01-07T10:00:00.000Z' },
];
