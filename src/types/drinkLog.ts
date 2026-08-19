// Spanish schema reference: drink_logs(id, user_id, party_id, tipo_bebida, cantidad, foto_url, timestamp)
export type DrinkType = 'shot' | 'cocktail' | 'beer' | 'wine' | 'other'; // tipo_bebida

export type DrinkLog = {
  id: string;
  userId: string; // user_id
  partyId: string; // party_id
  drinkType: DrinkType; // tipo_bebida
  customLabel?: string; // free-text label when drinkType === 'other'
  quantity: number; // cantidad
  photoUrl?: string; // foto_url
  timestamp: string; // ISO datetime string
};

export type CreateDrinkLogInput = {
  partyId: string;
  drinkType: DrinkType;
  customLabel?: string;
  quantity: number;
  photoUrl?: string;
  timestamp?: string;
};
