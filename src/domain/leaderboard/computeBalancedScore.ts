import type { ScoreBreakdownItem, ScoreFactorId } from '@/types';

// Product/compliance decision: ranking must NOT be a pure "who drank the most" contest
// (App Store / Play Store are strict about alcohol apps incentivizing excess). There's no
// cap or penalty on raw volume — instead variety, social approval (kudos/comments) and
// attendance are weighted higher per unit, so they naturally outweigh volume alone.
const WEIGHTS = {
  drinkCount: 1,
  variety: 4,
  kudos: 2,
  partiesAttended: 5,
  comments: 1,
  challengePoints: 1,
} as const;

// UI-facing description of the formula above — used by the "how scoring works" table
// on the profile screen. `pointsPerUnit` is null for factors with no fixed per-unit
// value (challengePoints varies per challenge) — the UI shows a different label for
// those. Translated by factorId in ScoringTable/ScoreBreakdownSheet (src/i18n).
export const SCORE_FACTORS: { factorId: ScoreFactorId; pointsPerUnit: number | null }[] = [
  { factorId: 'drinkCount', pointsPerUnit: WEIGHTS.drinkCount },
  { factorId: 'variety', pointsPerUnit: WEIGHTS.variety },
  { factorId: 'kudos', pointsPerUnit: WEIGHTS.kudos },
  { factorId: 'partiesAttended', pointsPerUnit: WEIGHTS.partiesAttended },
  { factorId: 'comments', pointsPerUnit: WEIGHTS.comments },
  { factorId: 'challengePoints', pointsPerUnit: null },
];

export type BalancedScoreInput = {
  drinkCount: number;
  uniqueTypes: number;
  kudosReceived: number;
  partiesAttended: number;
  commentsReceived: number;
  challengePoints: number;
};

export type BalancedScoreResult = {
  score: number;
  breakdown: ScoreBreakdownItem[];
};

export function computeBalancedScore(stats: BalancedScoreInput): BalancedScoreResult {
  const breakdown: ScoreBreakdownItem[] = [
    { factorId: 'drinkCount', contribution: stats.drinkCount * WEIGHTS.drinkCount },
    { factorId: 'variety', contribution: stats.uniqueTypes * WEIGHTS.variety },
    { factorId: 'kudos', contribution: stats.kudosReceived * WEIGHTS.kudos },
    { factorId: 'partiesAttended', contribution: stats.partiesAttended * WEIGHTS.partiesAttended },
    { factorId: 'comments', contribution: stats.commentsReceived * WEIGHTS.comments },
    { factorId: 'challengePoints', contribution: stats.challengePoints * WEIGHTS.challengePoints },
  ];

  const score = Math.max(0, Math.round(breakdown.reduce((sum, item) => sum + item.contribution, 0)));

  return { score, breakdown };
}
