import type { Party, PartyMember } from '@/types';

export const seedParties: Party[] = [
  {
    id: 'p1',
    name: 'Previa Depto de Cami',
    date: '2026-08-18T22:00:00.000Z',
    hostId: 'u2',
    location: 'Depto de Camila',
    status: 'active',
    inviteCode: 'PREV26',
    coverImageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    challengePaceMode: 'aleatorio',
    challengeIntervalMinutes: 20,
    challengeCategories: ['bebida', 'social', 'fisico', 'social_premium'],
    turnsSinceLastChallenge: 0,
    turnsUntilNextChallenge: 5,
  },
  {
    id: 'p2',
    name: 'Cumple de Diego',
    date: '2026-08-02T21:00:00.000Z',
    hostId: 'u3',
    location: 'Terraza Central',
    status: 'finished',
    inviteCode: 'DIEGO25',
    coverImageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    challengePaceMode: 'fijo',
    challengeIntervalMinutes: 30,
    challengeCategories: ['bebida', 'social'],
    turnsSinceLastChallenge: 0,
    turnsUntilNextChallenge: 8,
  },
  {
    id: 'p3',
    name: 'Asado + Fiesta Verano',
    date: '2026-07-19T20:00:00.000Z',
    hostId: 'u1',
    location: 'Casa de Mateo',
    status: 'finished',
    inviteCode: 'ASADO7',
    coverImageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    challengePaceMode: 'fijo',
    challengeIntervalMinutes: 30,
    challengeCategories: ['bebida', 'social', 'fisico'],
    turnsSinceLastChallenge: 0,
    turnsUntilNextChallenge: 8,
  },
];

export const seedPartyMembers: PartyMember[] = [
  // p1 — active (host u2 = admin)
  { partyId: 'p1', userId: 'u1', joinedAt: '2026-08-18T21:50:00.000Z', role: 'guest' },
  { partyId: 'p1', userId: 'u2', joinedAt: '2026-08-18T21:40:00.000Z', role: 'admin' },
  { partyId: 'p1', userId: 'u3', joinedAt: '2026-08-18T21:55:00.000Z', role: 'guest' },
  { partyId: 'p1', userId: 'u4', joinedAt: '2026-08-18T22:05:00.000Z', role: 'guest' },
  // p2 — finished (host u3 = admin)
  { partyId: 'p2', userId: 'u1', joinedAt: '2026-08-02T20:50:00.000Z', role: 'guest' },
  { partyId: 'p2', userId: 'u2', joinedAt: '2026-08-02T20:50:00.000Z', role: 'guest' },
  { partyId: 'p2', userId: 'u3', joinedAt: '2026-08-02T20:45:00.000Z', role: 'admin' },
  { partyId: 'p2', userId: 'u5', joinedAt: '2026-08-02T21:10:00.000Z', role: 'guest' },
  { partyId: 'p2', userId: 'u6', joinedAt: '2026-08-02T21:15:00.000Z', role: 'guest' },
  // p3 — finished (host u1 = admin)
  { partyId: 'p3', userId: 'u1', joinedAt: '2026-07-19T19:50:00.000Z', role: 'admin' },
  { partyId: 'p3', userId: 'u4', joinedAt: '2026-07-19T19:55:00.000Z', role: 'guest' },
  { partyId: 'p3', userId: 'u5', joinedAt: '2026-07-19T20:00:00.000Z', role: 'guest' },
  { partyId: 'p3', userId: 'u6', joinedAt: '2026-07-19T20:10:00.000Z', role: 'guest' },
];
