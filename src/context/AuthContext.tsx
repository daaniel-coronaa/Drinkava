import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { services } from '@/services';
import type { Session } from '@/services/interfaces/AuthService';

type AuthContextValue = {
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  submitBirthDate: (birthDate: string) => Promise<void>;
  acceptTerms: () => Promise<void>;
  signOut: () => Promise<void>;
  updateAvatar: (avatarUrl: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    services.auth.getSession().then((s) => {
      setSession(s);
      setLoading(false);
    });
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const s = await services.auth.signInWithGoogle();
    setSession(s);
  }, []);

  const signInWithApple = useCallback(async () => {
    const s = await services.auth.signInWithApple();
    setSession(s);
  }, []);

  const submitBirthDate = useCallback(async (birthDate: string) => {
    const s = await services.auth.submitBirthDate(birthDate);
    setSession(s);
  }, []);

  const acceptTerms = useCallback(async () => {
    const s = await services.auth.acceptTerms();
    setSession(s);
  }, []);

  const signOut = useCallback(async () => {
    await services.auth.signOut();
    setSession(null);
  }, []);

  const updateAvatar = useCallback(
    async (avatarUrl: string) => {
      if (!session) return;
      const updatedUser = await services.users.updateProfile(session.user.id, { avatarUrl });
      setSession({ ...session, user: updatedUser });
    },
    [session],
  );

  const value = useMemo(
    () => ({ session, loading, signInWithGoogle, signInWithApple, submitBirthDate, acceptTerms, signOut, updateAvatar }),
    [session, loading, signInWithGoogle, signInWithApple, submitBirthDate, acceptTerms, signOut, updateAvatar],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
