// Spanish schema reference: achievements(id, user_id, tipo, fecha_obtenido)
export type AchievementKey = 'first_party' | 'variety_10' | 'party_streak_3' | 'kudos_master' | 'host_debut';

export type AchievementDefinition = {
  key: AchievementKey;
  title: string;
  description: string;
  icon: string; // @expo/vector-icons name
};

export type Achievement = {
  id: string;
  userId: string; // user_id
  achievementKey: AchievementKey; // tipo
  unlockedAt: string; // fecha_obtenido
};
