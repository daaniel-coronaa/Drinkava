import type { Achievement, AchievementDefinition } from '@/types';

export const achievementDefinitions: AchievementDefinition[] = [
  { key: 'first_party', title: 'Primera Fiesta', description: 'Asististe a tu primera fiesta.', icon: 'party-popper' },
  { key: 'variety_5', title: 'Curioso', description: 'Probaste 5 tragos distintos.', icon: 'compass-outline' },
  { key: 'variety_10', title: 'Explorador', description: 'Probaste 10 tragos distintos.', icon: 'glass-cocktail' },
  { key: 'variety_20', title: 'Sommelier', description: 'Probaste 20 tragos distintos.', icon: 'glass-flute' },
  { key: 'party_streak_3', title: 'En Racha', description: 'Asististe a fiestas en 3 fechas distintas en 30 días.', icon: 'fire' },
  { key: 'kudos_rookie', title: 'Simpático', description: 'Recibiste 5 kudos en total.', icon: 'heart-outline' },
  { key: 'kudos_master', title: 'Favorito de la Fiesta', description: 'Recibiste 25 kudos en total.', icon: 'thumb-up' },
  { key: 'host_debut', title: 'El Anfitrión', description: 'Organizaste una fiesta con 5+ invitados.', icon: 'crown' },
  { key: 'super_host', title: 'Anfitrión Estrella', description: 'Organizaste 3 fiestas.', icon: 'star-circle' },
  { key: 'photographer', title: 'Fotógrafo de Fiestas', description: 'Subiste 5 fotos de tragos.', icon: 'camera' },
  { key: 'commentator', title: 'El Comentarista', description: 'Dejaste 10 comentarios.', icon: 'comment-text-multiple' },
  { key: 'social_butterfly', title: 'Mariposa Social', description: 'Diste kudos a 15 registros distintos.', icon: 'account-group' },
  { key: 'night_owl', title: 'Ave Nocturna', description: 'Registraste un trago después de medianoche.', icon: 'weather-night' },
];

export const seedAchievements: Achievement[] = [
  { id: 'a1', userId: 'u1', achievementKey: 'first_party', unlockedAt: '2026-07-19T20:30:00.000Z' },
];
