import { MockAchievementService } from './mock/MockAchievementService';
import { MockAuthService } from './mock/MockAuthService';
import { MockChallengeService } from './mock/MockChallengeService';
import { MockDrinkLogService } from './mock/MockDrinkLogService';
import { MockLeaderboardService } from './mock/MockLeaderboardService';
import { MockPartyService } from './mock/MockPartyService';
import { MockUserService } from './mock/MockUserService';

// SEAM: this is the single swap point. Once real Supabase-backed implementations
// exist in ./supabase/*, swap them in here — screens only ever import `services`
// from this file, never from `./mock/*` directly, so no screen code changes.
export const services = {
  auth: MockAuthService,
  parties: MockPartyService,
  drinkLogs: MockDrinkLogService,
  leaderboard: MockLeaderboardService,
  achievements: MockAchievementService,
  challenges: MockChallengeService,
  users: MockUserService,
};

export { AgeRestrictedError, EmailInUseError, InvalidCredentialsError } from './mock/MockAuthService';
export { NotAuthorizedError } from './mock/MockPartyService';
export { challengeCatalog, mockDb } from './mock/mockDb';
