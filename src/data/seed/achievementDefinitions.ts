import type { Achievement, AchievementDefinition } from '@/types';

export const achievementDefinitions: AchievementDefinition[] = [
  { key: 'first_party', title: 'Primera Fiesta', description: 'Asististe a tu primera fiesta.', icon: 'party-popper' },
  { key: 'variety_10', title: 'Explorador', description: 'Probaste 10 tragos distintos.', icon: 'glass-cocktail' },
  { key: 'party_streak_3', title: 'En Racha', description: 'Asististe a fiestas en 3 fechas distintas en 30 días.', icon: 'fire' },
  { key: 'kudos_master', title: 'Favorito de la Fiesta', description: 'Recibiste 25 kudos en total.', icon: 'thumb-up' },
  { key: 'host_debut', title: 'El Anfitrión', description: 'Organizaste una fiesta con 5+ invitados.', icon: 'crown' },
];

export const seedAchievements: Achievement[] = [
  { id: 'a1', userId: 'u1', achievementKey: 'first_party', unlockedAt: '2026-07-19T20:30:00.000Z' },
];
