import type { Achievement, AchievementDefinition } from '@/types';

export const achievementDefinitions: AchievementDefinition[] = [
  { key: 'first_party', icon: 'party-popper' },
  { key: 'variety_5', icon: 'compass-outline' },
  { key: 'variety_10', icon: 'glass-cocktail' },
  { key: 'variety_20', icon: 'glass-flute' },
  { key: 'party_streak_3', icon: 'fire' },
  { key: 'kudos_rookie', icon: 'heart-outline' },
  { key: 'kudos_master', icon: 'thumb-up' },
  { key: 'host_debut', icon: 'crown' },
  { key: 'super_host', icon: 'star-circle' },
  { key: 'photographer', icon: 'camera' },
  { key: 'commentator', icon: 'comment-text-multiple' },
  { key: 'social_butterfly', icon: 'account-group' },
  { key: 'night_owl', icon: 'weather-night' },
];

export const seedAchievements: Achievement[] = [
  { id: 'a1', userId: 'u1', achievementKey: 'first_party', unlockedAt: '2026-07-19T20:30:00.000Z' },
];
