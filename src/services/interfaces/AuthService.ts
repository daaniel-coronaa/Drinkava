import type { AuthProvider, User } from '@/types';

export type Session = {
  user: User;
  ageVerified: boolean;
  tosAccepted: boolean;
};

// SEAM: real implementation swaps mocked delay+session for expo-auth-session (Google)
// and expo-apple-authentication (Apple), backed by Supabase Auth.
export interface AuthService {
  getSession(): Promise<Session | null>;
  signInWithGoogle(): Promise<Session>;
  signInWithApple(): Promise<Session>;
  submitBirthDate(birthDate: string): Promise<Session>;
  acceptTerms(): Promise<Session>;
  signOut(): Promise<void>;
}

export type { AuthProvider };
