import type { CreatePartyInput, Party, PartyMember, PartyStatus } from '@/types';

export interface PartyService {
  list(filter?: PartyStatus): Promise<Party[]>;
  listForUser(userId: string): Promise<Party[]>;
  get(id: string): Promise<Party | null>;
  create(input: CreatePartyInput): Promise<Party>;
  join(inviteCode: string): Promise<Party>;
  updateStatus(id: string, status: PartyStatus): Promise<Party>;
  listMembers(partyId: string): Promise<PartyMember[]>;
}
