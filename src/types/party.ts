// Spanish schema reference: parties(id, nombre, fecha, host_id, ubicación, estado)
// party_members(party_id, user_id)
export type PartyStatus = 'active' | 'finished'; // estado

export type Party = {
  id: string;
  name: string; // nombre
  date: string; // fecha — ISO datetime string
  hostId: string; // host_id
  location?: string; // ubicación
  status: PartyStatus; // estado
  coverImageUrl?: string;
  inviteCode: string;
};

export type PartyMember = {
  partyId: string; // party_id
  userId: string; // user_id
  joinedAt: string;
};

export type CreatePartyInput = {
  name: string;
  date: string;
  location?: string;
  coverImageUrl?: string;
};
