import type { LeaderboardEntry } from '@/types';

export interface LeaderboardService {
  getPartyLeaderboard(partyId: string): Promise<LeaderboardEntry[]>;
  getGlobalLeaderboard(userId: string): Promise<LeaderboardEntry[]>;
}
