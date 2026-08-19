import type { DrinkLog } from '@/types';

export const seedDrinkLogs: DrinkLog[] = [
  // Party p1 — active, in progress
  { id: 'd1', userId: 'u1', partyId: 'p1', drinkType: 'beer', quantity: 1, timestamp: '2026-08-18T22:10:00.000Z' },
  { id: 'd2', userId: 'u2', partyId: 'p1', drinkType: 'cocktail', customLabel: 'Mojito', quantity: 1, timestamp: '2026-08-18T22:15:00.000Z' },
  { id: 'd3', userId: 'u3', partyId: 'p1', drinkType: 'shot', quantity: 2, timestamp: '2026-08-18T22:20:00.000Z' },
  { id: 'd4', userId: 'u1', partyId: 'p1', drinkType: 'cocktail', customLabel: 'Margarita', quantity: 1, timestamp: '2026-08-18T22:40:00.000Z' },
  { id: 'd5', userId: 'u4', partyId: 'p1', drinkType: 'wine', quantity: 1, timestamp: '2026-08-18T22:45:00.000Z' },
  { id: 'd6', userId: 'u2', partyId: 'p1', drinkType: 'beer', quantity: 1, timestamp: '2026-08-18T23:00:00.000Z' },

  // Party p2 — finished, Diego's birthday
  { id: 'd7', userId: 'u3', partyId: 'p2', drinkType: 'shot', quantity: 3, timestamp: '2026-08-02T21:30:00.000Z' },
  { id: 'd8', userId: 'u1', partyId: 'p2', drinkType: 'beer', quantity: 2, timestamp: '2026-08-02T21:40:00.000Z' },
  { id: 'd9', userId: 'u2', partyId: 'p2', drinkType: 'cocktail', customLabel: 'Piña Colada', quantity: 1, timestamp: '2026-08-02T21:50:00.000Z' },
  { id: 'd10', userId: 'u5', partyId: 'p2', drinkType: 'wine', quantity: 2, timestamp: '2026-08-02T22:00:00.000Z' },
  { id: 'd11', userId: 'u6', partyId: 'p2', drinkType: 'other', customLabel: 'Sangría', quantity: 1, timestamp: '2026-08-02T22:15:00.000Z' },
  { id: 'd12', userId: 'u1', partyId: 'p2', drinkType: 'cocktail', customLabel: 'Cuba Libre', quantity: 1, timestamp: '2026-08-02T22:30:00.000Z' },
  { id: 'd13', userId: 'u3', partyId: 'p2', drinkType: 'beer', quantity: 1, timestamp: '2026-08-02T23:00:00.000Z' },

  // Party p3 — finished, asado
  { id: 'd14', userId: 'u1', partyId: 'p3', drinkType: 'beer', quantity: 3, timestamp: '2026-07-19T20:30:00.000Z' },
  { id: 'd15', userId: 'u4', partyId: 'p3', drinkType: 'wine', quantity: 1, timestamp: '2026-07-19T20:45:00.000Z' },
  { id: 'd16', userId: 'u5', partyId: 'p3', drinkType: 'shot', quantity: 1, timestamp: '2026-07-19T21:00:00.000Z' },
  { id: 'd17', userId: 'u6', partyId: 'p3', drinkType: 'cocktail', customLabel: 'Aperol Spritz', quantity: 1, timestamp: '2026-07-19T21:20:00.000Z' },
  { id: 'd18', userId: 'u1', partyId: 'p3', drinkType: 'beer', quantity: 1, timestamp: '2026-07-19T21:45:00.000Z' },
];
