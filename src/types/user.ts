// Spanish schema reference: users(id, nombre, foto, email, auth_provider, fecha_nacimiento)
export type AuthProvider = 'google' | 'apple';

export type User = {
  id: string;
  name: string; // nombre
  avatarUrl?: string; // foto
  email: string;
  authProvider: AuthProvider; // auth_provider
  birthDate: string; // fecha_nacimiento — ISO date string
  createdAt: string;
};
