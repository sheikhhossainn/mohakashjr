import AsyncStorage from '@react-native-async-storage/async-storage';
import { RankTier, QuizAttemptRecord } from '../content/schema';
import type { CadetArchetype } from '../state/useAppStore';

/**
 * Everything the app remembers about the student, kept on this device only.
 * There are no accounts: one device, one profile.
 */
export interface SavedProfile {
  displayName: string;
  rank: RankTier;
  xp: number;
  completedLessonIds: string[];
  completedMissions: string[];
  quizAttempts: Record<string, QuizAttemptRecord[]>;
  cadetArchetype: CadetArchetype;
  psychometricAnswers: Record<number, number[]>;
  hasCompletedOnboarding: boolean;
  lastBonusClaimDate?: string;
}

const STORAGE_PROFILE_KEY = '@mohakashjr_profile_v1';
const STORAGE_LANGUAGE_KEY = '@mohakashjr_language';

// In-memory fallback if storage encounters issues
let memoryProfile: SavedProfile | null = null;
let memoryLanguage: 'bn' | 'en' = 'bn';

export const profileStorage = {
  async loadProfile(): Promise<SavedProfile | null> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_PROFILE_KEY);
      if (raw) {
        memoryProfile = JSON.parse(raw) as SavedProfile;
      }
    } catch {
      // Fall back to memory
    }
    return memoryProfile;
  },

  async saveProfile(profile: SavedProfile): Promise<void> {
    memoryProfile = profile;
    try {
      await AsyncStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // Silently fall back to memory
    }
  },

  /** Delete all progress stored on this device. The language preference is kept. */
  async clearProfile(): Promise<void> {
    memoryProfile = null;
    try {
      await AsyncStorage.removeItem(STORAGE_PROFILE_KEY);
    } catch {
      // Fallback
    }
  },

  async getStoredLanguage(): Promise<'bn' | 'en'> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_LANGUAGE_KEY);
      if (raw === 'en' || raw === 'bn') {
        memoryLanguage = raw;
        return raw;
      }
    } catch {
      // Fallback
    }
    return memoryLanguage;
  },

  async setStoredLanguage(lang: 'bn' | 'en'): Promise<void> {
    memoryLanguage = lang;
    try {
      await AsyncStorage.setItem(STORAGE_LANGUAGE_KEY, lang);
    } catch {
      // Fallback
    }
  },
};

export const getStoredLanguage = profileStorage.getStoredLanguage.bind(profileStorage);
export const setStoredLanguage = profileStorage.setStoredLanguage.bind(profileStorage);
