import type { CreatePartyInput, Party, PartyMember, PartyStatus } from '@/types';

export interface PartyService {
  list(filter?: PartyStatus): Promise<Party[]>;
  listForUser(userId: string): Promise<Party[]>;
  get(id: string): Promise<Party | null>;
  create(input: CreatePartyInput, hostUserId: string): Promise<Party>;
  join(inviteCode: string, userId: string): Promise<Party>;
  // Only a member with role 'admin' (the host, by default) may change party status —
  // throws NotAuthorizedError otherwise.
  updateStatus(id: string, status: PartyStatus, requestingUserId: string): Promise<Party>;
  listMembers(partyId: string): Promise<PartyMember[]>;
  // Guests can leave a party they joined. Admins can't leave via this method — throws
  // NotAuthorizedError — since a party always needs at least one admin.
  leave(partyId: string, userId: string): Promise<void>;
}
