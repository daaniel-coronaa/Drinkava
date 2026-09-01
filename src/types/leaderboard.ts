export type ScoreFactorId = 'drinkCount' | 'variety' | 'kudos' | 'partiesAttended' | 'comments' | 'challengePoints';

export type ScoreBreakdownItem = {
  factorId: ScoreFactorId;
  contribution: number;
};

export type LeaderboardEntry = {
  userId: string;
  rank: number;
  score: number;
  breakdown: ScoreBreakdownItem[];
  drinkCount: number;
  uniqueTypes: number;
  kudosReceived: number;
  partiesAttended: number;
  challengePoints: number;
};
