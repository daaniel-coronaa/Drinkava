// Spanish schema reference: achievements(id, user_id, tipo, fecha_obtenido)
export type AchievementKey =
  | 'first_party'
  | 'variety_5'
  | 'variety_10'
  | 'variety_20'
  | 'party_streak_3'
  | 'kudos_rookie'
  | 'kudos_master'
  | 'host_debut'
  | 'super_host'
  | 'photographer'
  | 'commentator'
  | 'social_butterfly'
  | 'night_owl';

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
