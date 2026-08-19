export type ScoreBreakdownItem = {
  label: string;
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
};
