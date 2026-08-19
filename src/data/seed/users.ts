import type { User } from '@/types';

export const CURRENT_USER_ID = 'u1';

export const seedUsers: User[] = [
  {
    id: 'u1',
    name: 'Tú',
    email: 'tu@drinkava.app',
    authProvider: 'google',
    birthDate: '1999-04-12',
    createdAt: '2026-01-05T10:00:00.000Z',
    avatarUrl: 'https://i.pravatar.cc/150?u=u1',
  },
  {
    id: 'u2',
    name: 'Camila Ríos',
    email: 'camila@drinkava.app',
    authProvider: 'apple',
    birthDate: '1998-08-22',
    createdAt: '2026-01-05T10:00:00.000Z',
    avatarUrl: 'https://i.pravatar.cc/150?u=u2',
  },
  {
    id: 'u3',
    name: 'Diego Fernández',
    email: 'diego@drinkava.app',
    authProvider: 'google',
    birthDate: '1997-02-14',
    createdAt: '2026-01-05T10:00:00.000Z',
    avatarUrl: 'https://i.pravatar.cc/150?u=u3',
  },
  {
    id: 'u4',
    name: 'Valentina Soto',
    email: 'valentina@drinkava.app',
    authProvider: 'apple',
    birthDate: '2000-11-30',
    createdAt: '2026-01-05T10:00:00.000Z',
    avatarUrl: 'https://i.pravatar.cc/150?u=u4',
  },
  {
    id: 'u5',
    name: 'Mateo Vargas',
    email: 'mateo@drinkava.app',
    authProvider: 'google',
    birthDate: '1996-06-18',
    createdAt: '2026-01-05T10:00:00.000Z',
    avatarUrl: 'https://i.pravatar.cc/150?u=u5',
  },
  {
    id: 'u6',
    name: 'Isabella Cruz',
    email: 'isabella@drinkava.app',
    authProvider: 'google',
    birthDate: '1999-09-09',
    createdAt: '2026-01-05T10:00:00.000Z',
    avatarUrl: 'https://i.pravatar.cc/150?u=u6',
  },
];
