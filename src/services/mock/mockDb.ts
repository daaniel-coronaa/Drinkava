import AsyncStorage from '@react-native-async-storage/async-storage';

import { achievementDefinitions, seedAchievements } from '@/data/seed/achievementDefinitions';
import { seedDrinkLogs } from '@/data/seed/drinkLogs';
import { seedComments, seedKudos } from '@/data/seed/kudosAndComments';
import { seedParties, seedPartyMembers } from '@/data/seed/parties';
import { CURRENT_USER_ID, seedUsers } from '@/data/seed/users';
import type { Achievement, Comment, DrinkLog, Kudos, Party, PartyMember, User } from '@/types';

const STORAGE_KEY = 'drinkava:mockDb:v1';

export type MockSession = {
  userId: string | null;
  ageVerified: boolean;
  tosAccepted: boolean;
};

type OnboardingRecord = { ageVerified: boolean; tosAccepted: boolean; birthDate?: string };

type Snapshot = {
  users: User[];
  parties: Party[];
  partyMembers: PartyMember[];
  drinkLogs: DrinkLog[];
  kudos: Kudos[];
  comments: Comment[];
  achievements: Achievement[];
  session: MockSession;
  // Onboarding (age verification / ToS acceptance) persists per user across sign-outs,
  // so a returning user isn't sent through the age-gate/ToS screens every sign-in.
  onboardingByUser: Record<string, OnboardingRecord>;
};

function freshSnapshot(): Snapshot {
  return {
    users: [...seedUsers],
    parties: [...seedParties],
    partyMembers: [...seedPartyMembers],
    drinkLogs: [...seedDrinkLogs],
    kudos: [...seedKudos],
    comments: [...seedComments],
    achievements: [...seedAchievements],
    session: { userId: null, ageVerified: false, tosAccepted: false },
    onboardingByUser: {},
  };
}

class MockDb {
  private data: Snapshot = freshSnapshot();
  private loaded = false;
  private loadingPromise: Promise<void> | null = null;
  private persistTimer: ReturnType<typeof setTimeout> | null = null;

  async ensureLoaded() {
    if (this.loaded) return;
    if (!this.loadingPromise) {
      this.loadingPromise = AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
        if (raw) {
          try {
            this.data = { ...freshSnapshot(), ...JSON.parse(raw) };
          } catch {
            this.data = freshSnapshot();
          }
        }
        this.loaded = true;
      });
    }
    await this.loadingPromise;
  }

  get<K extends keyof Snapshot>(key: K): Snapshot[K] {
    return this.data[key];
  }

  set<K extends keyof Snapshot>(key: K, value: Snapshot[K]) {
    this.data = { ...this.data, [key]: value };
    this.schedulePersist();
  }

  private schedulePersist() {
    if (this.persistTimer) clearTimeout(this.persistTimer);
    this.persistTimer = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.data)).catch(() => {});
    }, 300);
  }

  async reset() {
    this.data = freshSnapshot();
    this.loaded = true;
    await AsyncStorage.removeItem(STORAGE_KEY);
  }
}

export const mockDb = new MockDb();
export const achievementCatalog = achievementDefinitions;
export const DEFAULT_DEMO_USER_ID = CURRENT_USER_ID;

// Simulated network latency so loading states get exercised now and behavior
// doesn't change once real async Supabase calls replace these.
export const delay = (min = 150, max = 400) =>
  new Promise((resolve) => setTimeout(resolve, min + Math.random() * (max - min)));
