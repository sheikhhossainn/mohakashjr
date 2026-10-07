import { create } from 'zustand';
import { RankTier, QuizAttemptRecord } from '../content/schema';
import { profileStorage, SavedProfile } from '../services/profileStorage';
import { AppLanguage } from '../i18n/translations';

export type CadetArchetype = 'pilot' | 'astronomer' | 'engineer' | 'explorer';

export interface CadetArchetypeInfo {
  id: CadetArchetype;
  title_bn: string;
  title_en: string;
  badge: string;
  motto_bn: string;
  motto_en: string;
  description_bn: string;
  description_en: string;
  recommendedFocus_bn: string;
  recommendedFocus_en: string;
  accentColor: string;
}

export const ARCHETYPES: Record<CadetArchetype, CadetArchetypeInfo> = {
  pilot: {
    id: 'pilot',
    title_bn: 'রকেট পাইলট ক্যাডেট',
    title_en: 'Rocket Pilot Cadet',
    badge: '🚀',
    motto_bn: 'ঝড়ের গতি, নির্ভীক উড্ডয়ন ও গ্রহজয়',
    motto_en: 'Hypersonic speed, fearless flight & planetary conquest',
    description_bn: 'তুমি উল্কার গতিতে শক্তিশালী রকেট ওড়াতে এবং নিরাপদে মহাকাশযান ল্যান্ড করাতে ভালোবাসো!',
    description_en: 'You love piloting hypersonic rockets and steering safe spacecraft touchdowns on distant worlds!',
    recommendedFocus_bn: 'রকেট চালনা ও চন্দ্রাভিযান',
    recommendedFocus_en: 'Rocket Propulsion & Lunar Landings',
    accentColor: '#FF6B35',
  },
  astronomer: {
    id: 'astronomer',
    title_bn: 'তারা সন্ধানী ক্যাডেট',
    title_en: 'Stargazer Cadet',
    badge: '🔭',
    motto_bn: 'মহাজাগতিক বিস্ময় ও দূর নক্ষত্র দর্শন',
    motto_en: 'Cosmic wonders & deep stellar horizons',
    description_bn: 'তুমি টেলিস্কোপ দিয়ে দূর তারা, নেবুলা, শনির বলয় আর ব্ল্যাকহোলের রহস্য দেখতে ভালোবাসো!',
    description_en: 'You love peering through telescopes to explore distant stars, colorful nebulas, and black holes!',
    recommendedFocus_bn: 'নক্ষত্রমণ্ডল ও গভীর মহাবিশ্ব',
    recommendedFocus_en: 'Constellations & Deep Universe',
    accentColor: '#00F0FF',
  },
  engineer: {
    id: 'engineer',
    title_bn: 'রকেট ও রোভার ইঞ্জিনিয়ার',
    title_en: 'Space Systems Engineer',
    badge: '🛠️',
    motto_bn: 'প্রযুক্তি উদ্ভাবন ও রোবট নির্মাণ',
    motto_en: 'Technological invention & robotic mastery',
    description_bn: 'তুমি মার্স রোভারের রোবটিক হাত, সুপার থ্রাস্টার এবং স্পেস স্টেশন তৈরি করতে ভালোবাসো!',
    description_en: 'You love engineering robotic rover arms, cryogenic thrusters, and orbital space stations!',
    recommendedFocus_bn: 'মার্স রোভার ও রকেট প্রযুক্তি',
    recommendedFocus_en: 'Mars Rovers & Rocket Technology',
    accentColor: '#FFB800',
  },
  explorer: {
    id: 'explorer',
    title_bn: 'ভিনগ্রহের সাহসী অভিযাত্রী',
    title_en: 'Deep Space Explorer',
    badge: '🪐',
    motto_bn: 'রহস্য উন্মোচন ও অচেনা জগতের সন্ধান',
    motto_en: 'Unlocking mysteries & charting the unknown',
    description_bn: 'তুমি অচেনা দূর গ্রহে প্রথম পা রেখে অদ্ভুত স্ফটিক গুহা আর নতুন পৃথিবীর রহস্য খুঁজতে ভালোবাসো!',
    description_en: 'You love stepping onto untamed exoplanets, crystalline caves, and searching for alien mysteries!',
    recommendedFocus_bn: 'সৌরজগতের রহস্য ও বহির্গ্রহ',
    recommendedFocus_en: 'Solar Mysteries & Exoplanets',
    accentColor: '#00E599',
  },
};

export function calculateArchetype(answers: Record<number, number[] | number>): CadetArchetype {
  const tally: Record<CadetArchetype, number> = {
    pilot: 0,
    astronomer: 0,
    engineer: 0,
    explorer: 0,
  };

  const indexMap: CadetArchetype[] = ['pilot', 'astronomer', 'engineer', 'explorer'];

  Object.values(answers).forEach((choice) => {
    if (Array.isArray(choice)) {
      choice.forEach((choiceIdx) => {
        const archetype = indexMap[choiceIdx];
        if (archetype) {
          tally[archetype] += 1;
        }
      });
    } else if (typeof choice === 'number') {
      const archetype = indexMap[choice];
      if (archetype) {
        tally[archetype] += 1;
      }
    }
  });

  let topArchetype: CadetArchetype = 'pilot';
  let maxScore = -1;

  (Object.keys(tally) as CadetArchetype[]).forEach((key) => {
    if (tally[key] > maxScore) {
      maxScore = tally[key];
      topArchetype = key;
    }
  });

  return topArchetype;
}

export interface LevelUpEvent {
  previousRank: RankTier;
  newRank: RankTier;
  unlockedTitle_bn: string;
}

export function getTodayDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export interface AppState {
  // User Profile & Rank
  displayName: string;
  rank: RankTier;
  xp: number;
  completedLessonIds: string[];
  quizAttempts: Record<string, QuizAttemptRecord[]>; // lessonId -> attempts

  // True once saved progress has been read from this device
  isHydrated: boolean;

  // Onboarding & Psychometric Archetype
  hasCompletedOnboarding: boolean;
  cadetArchetype: CadetArchetype;
  psychometricAnswers: Record<number, number[]>;

  // Daily Bonus
  lastBonusClaimDate: string | null;

  // Active Level-Up Celebration
  activeLevelUp: LevelUpEvent | null;

  // Actions
  setDisplayName: (name: string) => void;
  setCadetArchetype: (archetype: CadetArchetype) => void;
  completeCadetOrientation: (name: string, answers: Record<number, number[]>) => void;
  completeOnboarding: (name?: string) => void;
  resetOnboarding: () => void;
  addXP: (amount: number) => void;
  claimDailyBonus: () => boolean;
  completeLesson: (lessonId: string) => void;
  recordQuizAttempt: (attempt: QuizAttemptRecord) => void;
  dismissLevelUp: () => void;
  getRankProgress: () => { current: number; max: number; percentage: number };
  resetProgress: () => void;

  // Local persistence
  loadSavedProgress: () => Promise<void>;
  deleteLocalData: () => Promise<void>;

  // Language & Localization
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => Promise<void>;
}

export const RANK_THRESHOLDS: Record<RankTier, { min: number; max: number; label_bn: string; label_en: string }> = {
  'Cadet': { min: 0, max: 200, label_bn: 'স্পেস ক্যাডেট', label_en: 'Space Cadet' },
  'Astronaut': { min: 201, max: 600, label_bn: 'মহাকাশচারী', label_en: 'Official Astronaut' },
  'Mission Specialist': { min: 601, max: 1200, label_bn: 'মিশন বিশেষজ্ঞ', label_en: 'Mission Specialist' },
  'Commander': { min: 1201, max: 2500, label_bn: 'মহাকাশ কমান্ডার', label_en: 'Flight Commander' },
};

export function calculateRank(xp: number): RankTier {
  if (xp >= 1201) return 'Commander';
  if (xp >= 601) return 'Mission Specialist';
  if (xp >= 201) return 'Astronaut';
  return 'Cadet';
}

export const useAppStore = create<AppState>((set, get) => ({
  displayName: 'জুনিয়র ক্যাডেট',
  rank: 'Cadet',
  xp: 0,
  completedLessonIds: [],
  quizAttempts: {},
  isHydrated: false,
  activeLevelUp: null,
  hasCompletedOnboarding: false,
  cadetArchetype: 'pilot',
  psychometricAnswers: {},
  lastBonusClaimDate: null,
  language: 'bn',

  setLanguage: async (lang: AppLanguage) => {
    set({ language: lang });
    await profileStorage.setStoredLanguage(lang);
  },

  setDisplayName: (name: string) => set({ displayName: name }),
  setCadetArchetype: (archetype: CadetArchetype) => set({ cadetArchetype: archetype }),

  completeCadetOrientation: (name: string, answers: Record<number, number[]>) => {
    const archetype = calculateArchetype(answers);
    const chosenName = name && name.trim().length > 0 ? name.trim() : 'জুনিয়র ক্যাডেট';
    set({
      hasCompletedOnboarding: true,
      displayName: chosenName,
      cadetArchetype: archetype,
      psychometricAnswers: answers,
    });
  },

  completeOnboarding: (name?: string) => {
    set({
      hasCompletedOnboarding: true,
      ...(name && name.trim().length > 0 ? { displayName: name.trim() } : {}),
    });
  },

  resetOnboarding: () => set({ hasCompletedOnboarding: false }),

  claimDailyBonus: () => {
    const today = getTodayDateKey();
    if (get().lastBonusClaimDate === today) {
      return false;
    }
    set({ lastBonusClaimDate: today });
    get().addXP(25);
    return true;
  },

  addXP: (amount: number) => {
    const currentXP = get().xp;
    const currentRank = get().rank;
    const newXP = currentXP + amount;
    const newRank = calculateRank(newXP);

    let levelUpEvent: LevelUpEvent | null = null;
    if (newRank !== currentRank) {
      levelUpEvent = {
        previousRank: currentRank,
        newRank,
        unlockedTitle_bn: RANK_THRESHOLDS[newRank].label_bn,
      };
    }

    set({
      xp: newXP,
      rank: newRank,
      ...(levelUpEvent ? { activeLevelUp: levelUpEvent } : {}),
    });
  },

  completeLesson: (lessonId: string) => {
    const { completedLessonIds, addXP } = get();
    if (!completedLessonIds.includes(lessonId)) {
      set({ completedLessonIds: [...completedLessonIds, lessonId] });
      addXP(20); // +20 XP on lesson completion
    }
  },

  recordQuizAttempt: (attempt: QuizAttemptRecord) => {
    const { quizAttempts, addXP } = get();
    const existing = quizAttempts[attempt.lesson_id] || [];
    set({
      quizAttempts: {
        ...quizAttempts,
        [attempt.lesson_id]: [...existing, attempt],
      },
    });
    if (attempt.xp_earned > 0) {
      addXP(attempt.xp_earned);
    }
  },

  dismissLevelUp: () => set({ activeLevelUp: null }),

  getRankProgress: () => {
    const { xp, rank } = get();
    const threshold = RANK_THRESHOLDS[rank];
    const span = threshold.max - threshold.min;
    const currentInLevel = Math.max(0, xp - threshold.min);
    const percentage = Math.min(100, Math.max(0, (currentInLevel / span) * 100));
    return {
      current: xp,
      max: threshold.max,
      percentage: Math.round(percentage),
    };
  },

  resetProgress: () => {
    set({
      displayName: 'জুনিয়র ক্যাডেট',
      rank: 'Cadet',
      xp: 0,
      completedLessonIds: [],
      quizAttempts: {},
      activeLevelUp: null,
      hasCompletedOnboarding: false,
      cadetArchetype: 'pilot',
      psychometricAnswers: {},
      lastBonusClaimDate: null,
    });
  },

  // ── Local persistence ──────────────────────────────────────────────────────
  loadSavedProgress: async () => {
    try {
      const storedLang = await profileStorage.getStoredLanguage();
      set({ language: storedLang });

      const saved = await profileStorage.loadProfile();
      if (saved) {
        set({
          hasCompletedOnboarding: saved.hasCompletedOnboarding,
          displayName: saved.displayName,
          rank: saved.rank,
          xp: saved.xp,
          completedLessonIds: saved.completedLessonIds || [],
          quizAttempts: saved.quizAttempts || {},
          cadetArchetype: saved.cadetArchetype || 'pilot',
          psychometricAnswers: saved.psychometricAnswers || {},
          lastBonusClaimDate: saved.lastBonusClaimDate || null,
        });
      }
    } catch {
      // Start fresh if storage is unreadable
    }
    set({ isHydrated: true });
  },

  deleteLocalData: async () => {
    // Clear storage first, then reset state, so the save subscriber has nothing to re-write
    set({ isHydrated: false });
    await profileStorage.clearProfile();
    get().resetProgress();
    set({ isHydrated: true });
  },
}));

function pickSavedProfile(state: AppState): SavedProfile {
  return {
    displayName: state.displayName,
    rank: state.rank,
    xp: state.xp,
    completedLessonIds: state.completedLessonIds,
    quizAttempts: state.quizAttempts,
    cadetArchetype: state.cadetArchetype,
    psychometricAnswers: state.psychometricAnswers,
    hasCompletedOnboarding: state.hasCompletedOnboarding,
    lastBonusClaimDate: state.lastBonusClaimDate || undefined,
  };
}

// Save to this device whenever saved fields change (only after the first load,
// so an empty default state never overwrites existing progress).
useAppStore.subscribe((state, prev) => {
  if (!state.isHydrated || !prev.isHydrated) return;
  const changed =
    state.displayName !== prev.displayName ||
    state.rank !== prev.rank ||
    state.xp !== prev.xp ||
    state.completedLessonIds !== prev.completedLessonIds ||
    state.quizAttempts !== prev.quizAttempts ||
    state.cadetArchetype !== prev.cadetArchetype ||
    state.psychometricAnswers !== prev.psychometricAnswers ||
    state.hasCompletedOnboarding !== prev.hasCompletedOnboarding ||
    state.lastBonusClaimDate !== prev.lastBonusClaimDate;
  if (changed) {
    profileStorage.saveProfile(pickSavedProfile(state));
  }
});
