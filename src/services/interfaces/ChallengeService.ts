import type { Challenge, ChallengeAssignment, PartyChallengeSettings } from '@/types';

// SEAM: this whole service simulates what would be server-side logic and
// authorization in a real backend (Supabase Edge Function / API route). The mock
// enforces host-only validate/reject and the social_premium access gate the same
// way it would be enforced server-side — screens cannot bypass it by hiding a
// button, the service itself refuses the action.
export interface ChallengeService {
  // Catalog, already filtered for the requesting user (excludes social_premium
  // unless they have an active subscription — filtered here, not just in the UI).
  listCatalogForUser(userId: string): Promise<Challenge[]>;

  listAssignmentsForParty(partyId: string): Promise<ChallengeAssignment[]>;

  getPartyChallengeSettings(partyId: string): Promise<PartyChallengeSettings>;

  // Host-only — throws NotAuthorizedError otherwise.
  updatePartyChallengeSettings(
    partyId: string,
    requestingUserId: string,
    settings: Partial<PartyChallengeSettings>,
  ): Promise<PartyChallengeSettings>;

  // Called after a "turn" event (a drink logged, or an assignment resolved) —
  // evaluates the party's pace mode and, if due, assigns a new random challenge and
  // fires a (local, mocked) push notification to the target user(s). Returns the
  // new assignment, or null if it wasn't time yet / nothing eligible to assign.
  maybeTriggerNextChallenge(partyId: string): Promise<ChallengeAssignment | null>;

  // Single-target challenges (bebida/social/social_premium): the assigned user
  // self-reports completion, optionally attaching photo evidence.
  markDone(assignmentId: string, userId: string, photoEvidenceUrl?: string): Promise<ChallengeAssignment>;

  // 'fisico' challenges: each side accepts or rejects independently. Only flips to
  // 'completado' once both have explicitly accepted; either rejecting cancels it
  // immediately — never a unilateral action by one user onto the other.
  respondToConsent(assignmentId: string, userId: string, accept: boolean): Promise<ChallengeAssignment>;

  // The assigned user(s) can skip a pending challenge instead of doing it.
  skip(assignmentId: string, userId: string): Promise<ChallengeAssignment>;

  // Host-only — throws NotAuthorizedError otherwise. Awards the challenge's points
  // to the ranking only on validation.
  validate(assignmentId: string, requestingUserId: string): Promise<ChallengeAssignment>;
  reject(assignmentId: string, requestingUserId: string): Promise<ChallengeAssignment>;
}
