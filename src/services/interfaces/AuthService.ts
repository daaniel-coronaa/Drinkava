import type { AuthProvider, User } from '@/types';

export type Session = {
  user: User;
  ageVerified: boolean;
  tosAccepted: boolean;
};

// Real Google profile (name/email/photo) obtained client-side via expo-auth-session —
// see src/hooks/useGoogleSignIn.ts. AuthService only handles what happens with it
// afterward (find-or-create the app user, start a session).
export type GoogleProfile = {
  providerId: string;
  email: string;
  name: string;
  avatarUrl?: string;
};

export type EmailCredentials = { email: string; password: string };
export type EmailRegistration = EmailCredentials & { name: string };

// SEAM: signInWithApple still mocks the provider round-trip (real Apple Sign-In needs
// expo-apple-authentication, native-only). registerWithEmail/signInWithEmail are mock-only
// by nature here: with no real backend, credentials only ever live in local mock storage —
// swap for Supabase Auth (or similar) before this ships to real users.
export interface AuthService {
  getSession(): Promise<Session | null>;
  signInWithGoogle(profile: GoogleProfile): Promise<Session>;
  signInWithApple(): Promise<Session>;
  registerWithEmail(input: EmailRegistration): Promise<Session>;
  signInWithEmail(input: EmailCredentials): Promise<Session>;
  submitBirthDate(birthDate: string): Promise<Session>;
  acceptTerms(): Promise<Session>;
  signOut(): Promise<void>;
}

export type { AuthProvider };
