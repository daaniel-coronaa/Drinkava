import type { ScoreBreakdownItem } from '@/types';

// Product/compliance decision: ranking must NOT be a pure "who drank the most" contest
// (App Store / Play Store are strict about alcohol apps incentivizing excess). Volume
// contributes, but variety, social approval (kudos/comments) and attendance are
// weighted higher, and a penalty kicks in once raw volume outpaces variety.
const WEIGHTS = {
  drinkCount: 1,
  variety: 4,
  kudos: 2,
  partiesAttended: 5,
  comments: 1,
} as const;

// Drinks beyond this count (per evaluated scope) stop adding base "volume" points.
const VOLUME_CAP = 10;
// Once drinkCount exceeds max(uniqueTypes * this, VOLUME_CAP), excess drinks are penalized.
const VARIETY_ALLOWANCE_MULTIPLE = 3;
const PENALTY_WEIGHT = 3;

export type BalancedScoreInput = {
  drinkCount: number;
  uniqueTypes: number;
  kudosReceived: number;
  partiesAttended: number;
  commentsReceived: number;
};

export type BalancedScoreResult = {
  score: number;
  breakdown: ScoreBreakdownItem[];
};

export function computeBalancedScore(stats: BalancedScoreInput): BalancedScoreResult {
  const cappedDrinkCount = Math.min(stats.drinkCount, VOLUME_CAP);
  const varietyAllowance = Math.max(stats.uniqueTypes * VARIETY_ALLOWANCE_MULTIPLE, VOLUME_CAP);
  const excessDrinks = Math.max(0, stats.drinkCount - varietyAllowance);

  const breakdown: ScoreBreakdownItem[] = [
    { label: 'Bebidas registradas', contribution: cappedDrinkCount * WEIGHTS.drinkCount },
    { label: 'Variedad probada', contribution: stats.uniqueTypes * WEIGHTS.variety },
    { label: 'Kudos recibidos', contribution: stats.kudosReceived * WEIGHTS.kudos },
    { label: 'Fiestas asistidas', contribution: stats.partiesAttended * WEIGHTS.partiesAttended },
    { label: 'Comentarios recibidos', contribution: stats.commentsReceived * WEIGHTS.comments },
  ];

  if (excessDrinks > 0) {
    breakdown.push({ label: 'Ajuste por exceso de volumen', contribution: -(excessDrinks * PENALTY_WEIGHT) });
  }

  const score = Math.max(0, Math.round(breakdown.reduce((sum, item) => sum + item.contribution, 0)));

  return { score, breakdown };
}
