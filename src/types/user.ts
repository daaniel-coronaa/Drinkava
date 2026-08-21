// Spanish schema reference: users(id, nombre, foto, email, auth_provider, fecha_nacimiento)
export type AuthProvider = 'google' | 'apple' | 'email';

export type User = {
  id: string;
  name: string; // nombre
  avatarUrl?: string; // foto
  email: string;
  authProvider: AuthProvider; // auth_provider
  birthDate: string; // fecha_nacimiento — ISO date string
  createdAt: string;
  // SEAM: mock-only flag standing in for a real subscriptions/billing system, so the
  // social_premium challenge category's access gate can be built and tested now.
  hasActiveSubscription: boolean;
};
