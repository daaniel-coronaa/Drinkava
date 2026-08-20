import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { ChallengeService } from '@/services/interfaces/ChallengeService';
import type { Challenge, ChallengeAssignment } from '@/types';
import { generateId } from '@/utils/id';

import { NotAuthorizedError } from './MockPartyService';
import { DEFAULT_DEMO_USER_ID, challengeCatalog, delay, mockDb } from './mockDb';

const MIN_RANDOM_TURNS = 5;
const MAX_RANDOM_TURNS = 20;

const randomTurns = () => Math.floor(Math.random() * (MAX_RANDOM_TURNS - MIN_RANDOM_TURNS + 1)) + MIN_RANDOM_TURNS;
const shuffled = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

function requireParty(partyId: string) {
  const party = mockDb.get('parties').find((p) => p.id === partyId);
  if (!party) throw new Error('PARTY_NOT_FOUND');
  return party;
}

function requireAssignment(assignmentId: string) {
  const assignment = mockDb.get('challengeAssignments').find((a) => a.id === assignmentId);
  if (!assignment) throw new Error('ASSIGNMENT_NOT_FOUND');
  return assignment;
}

function updateAssignment(id: string, patch: Partial<ChallengeAssignment>) {
  const assignments = mockDb.get('challengeAssignments').map((a) => (a.id === id ? { ...a, ...patch } : a));
  mockDb.set('challengeAssignments', assignments);
  return assignments.find((a) => a.id === id)!;
}

// SEAM: real implementation sends a push via Firebase Cloud Messaging from the
// server that created the assignment. This mock is single-device, so it can only
// fire a LOCAL notification, and only when the current demo user is one of the
// targets — it can't reach another user's device.
async function fireChallengeNotification(assignment: ChallengeAssignment, challenge: Challenge) {
  const targetsCurrentUser = assignment.userIdA === DEFAULT_DEMO_USER_ID || assignment.userIdB === DEFAULT_DEMO_USER_ID;
  if (!targetsCurrentUser || Platform.OS === 'web') return;
  try {
    const { granted } = await Notifications.requestPermissionsAsync();
    if (!granted) return;
    await Notifications.scheduleNotificationAsync({
      content: { title: '¡Nuevo reto! 🎉', body: challenge.text },
      trigger: null,
    });
  } catch {
    // Notifications are a nice-to-have here — a failure shouldn't block the assignment.
  }
}

export const MockChallengeService: ChallengeService = {
  async listCatalogForUser(userId: string) {
    await mockDb.ensureLoaded();
    await delay();
    const hasSubscription = !!mockDb.get('users').find((u) => u.id === userId)?.hasActiveSubscription;
    return challengeCatalog.filter((c) => c.category !== 'social_premium' || hasSubscription);
  },

  async listAssignmentsForParty(partyId: string) {
    await mockDb.ensureLoaded();
    await delay();
    return mockDb
      .get('challengeAssignments')
      .filter((a) => a.partyId === partyId)
      .sort((a, b) => (a.sentAt < b.sentAt ? 1 : -1));
  },

  async getPartyChallengeSettings(partyId: string) {
    await mockDb.ensureLoaded();
    const party = requireParty(partyId);
    return {
      paceMode: party.challengePaceMode,
      intervalMinutes: party.challengeIntervalMinutes,
      enabledCategories: party.challengeCategories,
    };
  },

  async updatePartyChallengeSettings(partyId, requestingUserId, settings) {
    await mockDb.ensureLoaded();
    await delay();
    const party = requireParty(partyId);
    if (party.hostId !== requestingUserId) throw new NotAuthorizedError();

    const parties = mockDb.get('parties').map((p) =>
      p.id === partyId
        ? {
            ...p,
            challengePaceMode: settings.paceMode ?? p.challengePaceMode,
            challengeIntervalMinutes: settings.intervalMinutes ?? p.challengeIntervalMinutes,
            challengeCategories: settings.enabledCategories ?? p.challengeCategories,
          }
        : p,
    );
    mockDb.set('parties', parties);
    const updated = parties.find((p) => p.id === partyId)!;
    return {
      paceMode: updated.challengePaceMode,
      intervalMinutes: updated.challengeIntervalMinutes,
      enabledCategories: updated.challengeCategories,
    };
  },

  async maybeTriggerNextChallenge(partyId: string) {
    await mockDb.ensureLoaded();
    const party = requireParty(partyId);
    if (party.status !== 'active') return null;

    if (party.challengePaceMode === 'fijo') {
      const minutesSince = party.lastChallengeFiredAt
        ? (Date.now() - new Date(party.lastChallengeFiredAt).getTime()) / 60000
        : Infinity;
      if (minutesSince < party.challengeIntervalMinutes) return null;
    } else {
      const turnsSince = party.turnsSinceLastChallenge + 1;
      if (turnsSince < party.turnsUntilNextChallenge) {
        mockDb.set(
          'parties',
          mockDb.get('parties').map((p) => (p.id === partyId ? { ...p, turnsSinceLastChallenge: turnsSince } : p)),
        );
        return null;
      }
    }

    const members = mockDb.get('partyMembers').filter((m) => m.partyId === partyId);
    if (members.length === 0) return null;

    const users = mockDb.get('users');
    const candidates = shuffled(challengeCatalog.filter((c) => party.challengeCategories.includes(c.category)));

    let chosen: Challenge | null = null;
    let targetA: string | null = null;
    let targetB: string | null = null;

    for (const candidate of candidates) {
      if (candidate.category === 'fisico') {
        const pool = shuffled(members);
        if (pool.length < 2) continue;
        [targetA, targetB] = [pool[0].userId, pool[1].userId];
        chosen = candidate;
        break;
      }
      const eligibleMembers = members.filter(
        (m) => candidate.category !== 'social_premium' || users.find((u) => u.id === m.userId)?.hasActiveSubscription,
      );
      if (eligibleMembers.length === 0) continue;
      targetA = shuffled(eligibleMembers)[0].userId;
      chosen = candidate;
      break;
    }

    if (!chosen || !targetA) return null;

    const assignment: ChallengeAssignment = {
      id: generateId(),
      partyId,
      userIdA: targetA,
      userIdB: targetB ?? undefined,
      challengeId: chosen.id,
      sentAt: new Date().toISOString(),
      status: 'pendiente',
    };

    mockDb.set('challengeAssignments', [...mockDb.get('challengeAssignments'), assignment]);
    mockDb.set(
      'parties',
      mockDb.get('parties').map((p) =>
        p.id === partyId
          ? { ...p, turnsSinceLastChallenge: 0, turnsUntilNextChallenge: randomTurns(), lastChallengeFiredAt: new Date().toISOString() }
          : p,
      ),
    );

    await fireChallengeNotification(assignment, chosen);

    return assignment;
  },

  async markDone(assignmentId: string, userId: string, photoEvidenceUrl?: string) {
    await mockDb.ensureLoaded();
    await delay();
    const assignment = requireAssignment(assignmentId);
    if (assignment.userIdA !== userId) throw new NotAuthorizedError();
    if (assignment.status !== 'pendiente') return assignment;
    return updateAssignment(assignmentId, { status: 'completado', photoEvidenceUrl });
  },

  async respondToConsent(assignmentId: string, userId: string, accept: boolean) {
    await mockDb.ensureLoaded();
    await delay();
    const assignment = requireAssignment(assignmentId);
    if (assignment.userIdA !== userId && assignment.userIdB !== userId) throw new NotAuthorizedError();
    if (assignment.status !== 'pendiente') return assignment;

    if (!accept) {
      return updateAssignment(assignmentId, { status: 'rechazado' });
    }

    const isA = assignment.userIdA === userId;
    const patch: Partial<ChallengeAssignment> = isA ? { acceptedByA: true } : { acceptedByB: true };
    const acceptedByA = isA ? true : !!assignment.acceptedByA;
    const acceptedByB = isA ? !!assignment.acceptedByB : true;
    if (acceptedByA && acceptedByB) patch.status = 'completado';
    return updateAssignment(assignmentId, patch);
  },

  async skip(assignmentId: string, userId: string) {
    await mockDb.ensureLoaded();
    await delay();
    const assignment = requireAssignment(assignmentId);
    if (assignment.userIdA !== userId && assignment.userIdB !== userId) throw new NotAuthorizedError();
    if (assignment.status !== 'pendiente') return assignment;
    return updateAssignment(assignmentId, { status: 'pasado' });
  },

  async validate(assignmentId: string, requestingUserId: string) {
    await mockDb.ensureLoaded();
    await delay();
    const assignment = requireAssignment(assignmentId);
    const party = requireParty(assignment.partyId);
    if (party.hostId !== requestingUserId) throw new NotAuthorizedError();
    if (assignment.status !== 'completado') return assignment;
    return updateAssignment(assignmentId, { status: 'validado' });
  },

  async reject(assignmentId: string, requestingUserId: string) {
    await mockDb.ensureLoaded();
    await delay();
    const assignment = requireAssignment(assignmentId);
    const party = requireParty(assignment.partyId);
    if (party.hostId !== requestingUserId) throw new NotAuthorizedError();
    return updateAssignment(assignmentId, { status: 'rechazado' });
  },
};
