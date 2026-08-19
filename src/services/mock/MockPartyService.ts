import type { PartyService } from '@/services/interfaces/PartyService';
import type { CreatePartyInput, Party, PartyStatus } from '@/types';
import { generateId, generateInviteCode } from '@/utils/id';

import { DEFAULT_DEMO_USER_ID, delay, mockDb } from './mockDb';

export class NotAuthorizedError extends Error {
  constructor() {
    super('NOT_AUTHORIZED');
  }
}

export const MockPartyService: PartyService = {
  async list(filter?: PartyStatus) {
    await mockDb.ensureLoaded();
    await delay();
    const parties = mockDb.get('parties');
    const filtered = filter ? parties.filter((p) => p.status === filter) : parties;
    return [...filtered].sort((a, b) => (a.date < b.date ? 1 : -1));
  },

  async listForUser(userId: string) {
    await mockDb.ensureLoaded();
    await delay();
    const partyIds = new Set(
      mockDb
        .get('partyMembers')
        .filter((m) => m.userId === userId)
        .map((m) => m.partyId),
    );
    return mockDb
      .get('parties')
      .filter((p) => partyIds.has(p.id))
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  },

  async get(id: string) {
    await mockDb.ensureLoaded();
    await delay();
    return mockDb.get('parties').find((p) => p.id === id) ?? null;
  },

  async create(input: CreatePartyInput) {
    await mockDb.ensureLoaded();
    await delay();
    const party: Party = {
      id: generateId(),
      name: input.name,
      date: input.date,
      hostId: DEFAULT_DEMO_USER_ID,
      location: input.location,
      coverImageUrl: input.coverImageUrl,
      status: 'active',
      inviteCode: generateInviteCode(),
    };
    mockDb.set('parties', [...mockDb.get('parties'), party]);
    mockDb.set('partyMembers', [
      ...mockDb.get('partyMembers'),
      { partyId: party.id, userId: DEFAULT_DEMO_USER_ID, joinedAt: new Date().toISOString(), role: 'admin' },
    ]);
    return party;
  },

  async join(inviteCode: string) {
    await mockDb.ensureLoaded();
    await delay();
    const party = mockDb.get('parties').find((p) => p.inviteCode.toUpperCase() === inviteCode.trim().toUpperCase());
    if (!party) throw new Error('PARTY_NOT_FOUND');

    const already = mockDb
      .get('partyMembers')
      .some((m) => m.partyId === party.id && m.userId === DEFAULT_DEMO_USER_ID);
    if (!already) {
      mockDb.set('partyMembers', [
        ...mockDb.get('partyMembers'),
        { partyId: party.id, userId: DEFAULT_DEMO_USER_ID, joinedAt: new Date().toISOString(), role: 'guest' },
      ]);
    }
    return party;
  },

  async updateStatus(id: string, status: PartyStatus, requestingUserId: string) {
    await mockDb.ensureLoaded();
    await delay();
    const requester = mockDb
      .get('partyMembers')
      .find((m) => m.partyId === id && m.userId === requestingUserId);
    if (!requester || requester.role !== 'admin') throw new NotAuthorizedError();

    const parties = mockDb.get('parties').map((p) => (p.id === id ? { ...p, status } : p));
    mockDb.set('parties', parties);
    return parties.find((p) => p.id === id)!;
  },

  async listMembers(partyId: string) {
    await mockDb.ensureLoaded();
    await delay();
    return mockDb.get('partyMembers').filter((m) => m.partyId === partyId);
  },
};
