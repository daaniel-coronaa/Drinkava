// Spanish schema reference: challenges(id, texto, categoria, puntos)
export type ChallengeCategory = 'bebida' | 'social' | 'fisico' | 'social_premium';

export type Challenge = {
  id: string;
  text: string; // texto
  category: ChallengeCategory; // categoria
  points: number; // puntos
};

// Spanish schema reference: challenge_assignments(id, party_id, user_id_a, user_id_b,
// challenge_id, timestamp_enviado, estado, foto_evidencia_url)
export type ChallengeAssignmentStatus = 'pendiente' | 'completado' | 'validado' | 'rechazado' | 'pasado';

export type ChallengeAssignment = {
  id: string;
  partyId: string; // party_id
  userIdA: string; // user_id_a
  userIdB?: string; // user_id_b — only set for categoria 'fisico'
  challengeId: string; // challenge_id
  sentAt: string; // timestamp_enviado
  status: ChallengeAssignmentStatus; // estado
  photoEvidenceUrl?: string; // foto_evidencia_url
  // Double-consent tracking for 'fisico' challenges — not itself a column in the
  // brief's schema list, but required to implement "solo pasa a completado si ambos
  // aceptan explícitamente" without either side being able to force it unilaterally.
  acceptedByA?: boolean;
  acceptedByB?: boolean;
};

export type ChallengePaceMode = 'fijo' | 'aleatorio';

export type PartyChallengeSettings = {
  paceMode: ChallengePaceMode; // modo_ritmo_retos
  intervalMinutes: number; // intervalo_minutos — used when paceMode === 'fijo'
  enabledCategories: ChallengeCategory[]; // categories the host has turned on for this party
};
