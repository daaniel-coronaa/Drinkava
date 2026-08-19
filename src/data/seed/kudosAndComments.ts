import type { Comment, Kudos } from '@/types';

export const seedKudos: Kudos[] = [
  { id: 'k1', drinkLogId: 'd1', userId: 'u2', createdAt: '2026-08-18T22:12:00.000Z' },
  { id: 'k2', drinkLogId: 'd1', userId: 'u3', createdAt: '2026-08-18T22:13:00.000Z' },
  { id: 'k3', drinkLogId: 'd2', userId: 'u1', createdAt: '2026-08-18T22:16:00.000Z' },
  { id: 'k4', drinkLogId: 'd7', userId: 'u1', createdAt: '2026-08-02T21:32:00.000Z' },
  { id: 'k5', drinkLogId: 'd7', userId: 'u2', createdAt: '2026-08-02T21:33:00.000Z' },
  { id: 'k6', drinkLogId: 'd7', userId: 'u5', createdAt: '2026-08-02T21:35:00.000Z' },
  { id: 'k7', drinkLogId: 'd9', userId: 'u3', createdAt: '2026-08-02T21:52:00.000Z' },
  { id: 'k8', drinkLogId: 'd14', userId: 'u4', createdAt: '2026-07-19T20:32:00.000Z' },
];

export const seedComments: Comment[] = [
  { id: 'c1', drinkLogId: 'd1', userId: 'u2', text: '🍻 salud!', createdAt: '2026-08-18T22:12:30.000Z' },
  { id: 'c2', drinkLogId: 'd7', userId: 'u1', text: 'Feliz cumple crack 🎉', createdAt: '2026-08-02T21:32:30.000Z' },
  { id: 'c3', drinkLogId: 'd9', userId: 'u6', text: 'esa piña colada se ve increíble', createdAt: '2026-08-02T21:53:00.000Z' },
];
