import type { AuthService, Session } from '@/services/interfaces/AuthService';
import { isAdult } from '@/utils/date';

import { DEFAULT_DEMO_USER_ID, delay, mockDb } from './mockDb';

export class AgeRestrictedError extends Error {
  constructor() {
    super('AGE_RESTRICTED');
  }
}

function buildSession(): Session | null {
  const session = mockDb.get('session');
  if (!session.userId) return null;
  const user = mockDb.get('users').find((u) => u.id === session.userId);
  if (!user) return null;
  return { user, ageVerified: session.ageVerified, tosAccepted: session.tosAccepted };
}

// SEAM: replace mocked delay + fake session with expo-auth-session (Google) /
// expo-apple-authentication (Apple), backed by Supabase Auth.
export const MockAuthService: AuthService = {
  async getSession() {
    await mockDb.ensureLoaded();
    return buildSession();
  },

  async signInWithGoogle() {
    await delay();
    mockDb.set('session', { userId: DEFAULT_DEMO_USER_ID, ageVerified: false, tosAccepted: false });
    return buildSession()!;
  },

  async signInWithApple() {
    await delay();
    mockDb.set('session', { userId: DEFAULT_DEMO_USER_ID, ageVerified: false, tosAccepted: false });
    return buildSession()!;
  },

  async submitBirthDate(birthDate: string) {
    await delay();
    if (!isAdult(birthDate)) {
      throw new AgeRestrictedError();
    }
    const session = mockDb.get('session');
    if (!session.userId) throw new Error('NOT_AUTHENTICATED');

    const users = mockDb.get('users').map((u) => (u.id === session.userId ? { ...u, birthDate } : u));
    mockDb.set('users', users);
    mockDb.set('session', { ...session, ageVerified: true });
    return buildSession()!;
  },

  async acceptTerms() {
    await delay();
    const session = mockDb.get('session');
    if (!session.userId) throw new Error('NOT_AUTHENTICATED');
    mockDb.set('session', { ...session, tosAccepted: true });
    return buildSession()!;
  },

  async signOut() {
    await delay();
    mockDb.set('session', { userId: null, ageVerified: false, tosAccepted: false });
  },
};
