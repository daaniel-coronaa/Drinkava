import * as Crypto from 'expo-crypto';

import type { AuthService, EmailCredentials, EmailRegistration, GoogleProfile, Session } from '@/services/interfaces/AuthService';
import type { User } from '@/types';
import { generateId } from '@/utils/id';
import { isAdult } from '@/utils/date';

import { DEFAULT_DEMO_USER_ID, delay, mockDb } from './mockDb';

export class AgeRestrictedError extends Error {
  constructor() {
    super('AGE_RESTRICTED');
  }
}

export class EmailInUseError extends Error {
  constructor() {
    super('EMAIL_IN_USE');
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('INVALID_CREDENTIALS');
  }
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

// Mock-only password storage: SHA-256 of the raw password, no salt/pepper/KDF. Good
// enough to avoid keeping plaintext around in this local-only prototype; nowhere near
// what a real backend should use (bcrypt/argon2 + salt) once this ships for real.
const hashPassword = (password: string) => Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);

function startSessionFor(user: User): Session {
  const onboarding = mockDb.get('onboardingByUser')[user.id];
  mockDb.set('session', {
    userId: user.id,
    ageVerified: onboarding?.ageVerified ?? false,
    tosAccepted: onboarding?.tosAccepted ?? false,
  });
  return buildSession()!;
}

function buildSession(): Session | null {
  const session = mockDb.get('session');
  if (!session.userId) return null;
  const user = mockDb.get('users').find((u) => u.id === session.userId);
  if (!user) return null;
  return { user, ageVerified: session.ageVerified, tosAccepted: session.tosAccepted };
}

function updateOnboarding(userId: string, patch: { ageVerified?: boolean; tosAccepted?: boolean; birthDate?: string }) {
  const existing = mockDb.get('onboardingByUser')[userId] ?? { ageVerified: false, tosAccepted: false };
  mockDb.set('onboardingByUser', { ...mockDb.get('onboardingByUser'), [userId]: { ...existing, ...patch } });
}

// SEAM: signInWithGoogle already takes a real Google profile (see useGoogleSignIn) —
// what's left mock here is find-or-create + local session bookkeeping, which is what
// a real backend (e.g. Supabase Auth) would take over. signInWithApple still needs a
// real expo-apple-authentication swap (native-only, out of scope for the web preview).
export const MockAuthService: AuthService = {
  async getSession() {
    await mockDb.ensureLoaded();
    return buildSession();
  },

  async signInWithGoogle(profile: GoogleProfile) {
    await delay();
    await mockDb.ensureLoaded();
    const email = normalizeEmail(profile.email);
    const users = mockDb.get('users');
    const existing = users.find((u) => normalizeEmail(u.email) === email);

    let user: User;
    if (existing) {
      // Keep name/photo in sync with the real Google account on every sign-in.
      user = { ...existing, name: profile.name, avatarUrl: profile.avatarUrl ?? existing.avatarUrl };
      mockDb.set('users', users.map((u) => (u.id === existing.id ? user : u)));
    } else {
      user = {
        id: generateId(),
        name: profile.name,
        email: profile.email,
        authProvider: 'google',
        birthDate: '',
        createdAt: new Date().toISOString(),
        avatarUrl: profile.avatarUrl,
        hasActiveSubscription: false,
      };
      mockDb.set('users', [...users, user]);
    }
    return startSessionFor(user);
  },

  async signInWithApple() {
    await delay();
    await mockDb.ensureLoaded();
    const user = mockDb.get('users').find((u) => u.id === DEFAULT_DEMO_USER_ID)!;
    return startSessionFor(user);
  },

  async registerWithEmail({ email, password, name }: EmailRegistration) {
    await delay();
    await mockDb.ensureLoaded();
    const normalized = normalizeEmail(email);
    const users = mockDb.get('users');
    if (users.some((u) => normalizeEmail(u.email) === normalized)) {
      throw new EmailInUseError();
    }

    const user: User = {
      id: generateId(),
      name: name.trim(),
      email: email.trim(),
      authProvider: 'email',
      birthDate: '',
      createdAt: new Date().toISOString(),
      hasActiveSubscription: false,
    };
    mockDb.set('users', [...users, user]);
    mockDb.set('passwordHashByEmail', { ...mockDb.get('passwordHashByEmail'), [normalized]: await hashPassword(password) });
    return startSessionFor(user);
  },

  async signInWithEmail({ email, password }: EmailCredentials) {
    await delay();
    await mockDb.ensureLoaded();
    const normalized = normalizeEmail(email);
    const user = mockDb.get('users').find((u) => normalizeEmail(u.email) === normalized);
    const storedHash = mockDb.get('passwordHashByEmail')[normalized];
    if (!user || !storedHash || storedHash !== (await hashPassword(password))) {
      throw new InvalidCredentialsError();
    }
    return startSessionFor(user);
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
    updateOnboarding(session.userId, { ageVerified: true, birthDate });
    return buildSession()!;
  },

  async acceptTerms() {
    await delay();
    const session = mockDb.get('session');
    if (!session.userId) throw new Error('NOT_AUTHENTICATED');
    mockDb.set('session', { ...session, tosAccepted: true });
    updateOnboarding(session.userId, { tosAccepted: true });
    return buildSession()!;
  },

  async signOut() {
    await delay();
    mockDb.set('session', { userId: null, ageVerified: false, tosAccepted: false });
  },
};
