import type { Achievement, AchievementDefinition } from '@/types';

// SEAM: evaluation runs client-side against the mock db. Real impl should move this
// to a Postgres function / Supabase Edge Function trigger to avoid client-trust issues.
export interface AchievementService {
  listDefinitions(): Promise<AchievementDefinition[]>;
  listForUser(userId: string): Promise<Achievement[]>;
  evaluateAndUnlock(userId: string): Promise<Achievement[]>;
}
