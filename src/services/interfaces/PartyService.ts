import type { CreatePartyInput, Party, PartyMember, PartyStatus } from '@/types';

export interface PartyService {
  list(filter?: PartyStatus): Promise<Party[]>;
  listForUser(userId: string): Promise<Party[]>;
  get(id: string): Promise<Party | null>;
  create(input: CreatePartyInput): Promise<Party>;
  join(inviteCode: string): Promise<Party>;
  // Only a member with role 'admin' (the host, by default) may change party status —
  // throws NotAuthorizedError otherwise.
  updateStatus(id: string, status: PartyStatus, requestingUserId: string): Promise<Party>;
  listMembers(partyId: string): Promise<PartyMember[]>;
}
