import type { Challenge, ChallengeAssignment } from '@/types';

export const challengeCatalog: Challenge[] = [
  // bebida
  { id: 'c1', text: 'Toma 1 shot', category: 'bebida', points: 5 },
  { id: 'c2', text: 'Termina tu bebida en 3 tragos', category: 'bebida', points: 8 },

  // social — dinámicos, no genéricos
  { id: 'c3', text: 'Cuenta la mentira más grande que le has dicho a tus papás', category: 'social', points: 10 },
  { id: 'c4', text: '¿Cuál ha sido tu cita más incómoda?', category: 'social', points: 10 },
  { id: 'c5', text: 'Imita a alguien del grupo sin decir quién', category: 'social', points: 8 },
  { id: 'c6', text: 'Enseña la última foto vergonzosa de tu galería', category: 'social', points: 12 },

  // fisico — siempre de doble consentimiento
  { id: 'c7', text: 'Choca los cinco con alguien que no conocías antes de hoy', category: 'fisico', points: 6 },
  { id: 'c8', text: 'Hagan un brindis cruzando los brazos con alguien del grupo', category: 'fisico', points: 6 },

  // social_premium — versión más atrevida, solo con suscripción activa
  { id: 'c9', text: 'Cuenta la confesión más atrevida que nunca le has contado a nadie del grupo', category: 'social_premium', points: 15 },
  { id: 'c10', text: '¿Cuál ha sido la decisión más arriesgada que has tomado por alguien que te gustaba?', category: 'social_premium', points: 15 },
];

export const seedChallengeAssignments: ChallengeAssignment[] = [];
