import type { ScoreBreakdownItem } from '@/types';

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
// on the profile screen. Keep this in sync with the weights/logic above.
export const SCORE_FACTORS: { label: string; points: string; description: string }[] = [
  { label: 'Bebidas registradas', points: `+${WEIGHTS.drinkCount} c/u`, description: 'Cuenta, pero no es el factor principal — no hay límite de registros.' },
  { label: 'Variedad probada', points: `+${WEIGHTS.variety} c/u`, description: 'Cada tipo de bebida distinto que probaste. El factor con más peso.' },
  { label: 'Kudos recibidos', points: `+${WEIGHTS.kudos} c/u`, description: 'Reconocimiento social de tus amigos en tus registros.' },
  { label: 'Fiestas asistidas', points: `+${WEIGHTS.partiesAttended} c/u`, description: 'Asistencia constante a fiestas (solo ranking global).' },
  { label: 'Comentarios recibidos', points: `+${WEIGHTS.comments} c/u`, description: 'Cada comentario que te dejan en un registro.' },
  { label: 'Retos validados', points: 'según el reto', description: 'Puntos del reto, sumados solo cuando el anfitrión valida que se cumplió.' },
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
    { label: 'Bebidas registradas', contribution: stats.drinkCount * WEIGHTS.drinkCount },
    { label: 'Variedad probada', contribution: stats.uniqueTypes * WEIGHTS.variety },
    { label: 'Kudos recibidos', contribution: stats.kudosReceived * WEIGHTS.kudos },
    { label: 'Fiestas asistidas', contribution: stats.partiesAttended * WEIGHTS.partiesAttended },
    { label: 'Comentarios recibidos', contribution: stats.commentsReceived * WEIGHTS.comments },
    { label: 'Retos validados', contribution: stats.challengePoints * WEIGHTS.challengePoints },
  ];

  const score = Math.max(0, Math.round(breakdown.reduce((sum, item) => sum + item.contribution, 0)));

  return { score, breakdown };
}
