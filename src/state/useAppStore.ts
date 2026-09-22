import { create } from 'zustand';
import { RankTier, QuizAttemptRecord } from '../content/schema';

export type CadetArchetype = 'pilot' | 'astronomer' | 'engineer' | 'explorer';

export interface CadetArchetypeInfo {
  id: CadetArchetype;
  title_bn: string;
  badge: string;
  motto_bn: string;
  description_bn: string;
  recommendedFocus_bn: string;
  accentColor: string;
}

export const ARCHETYPES: Record<CadetArchetype, CadetArchetypeInfo> = {
  pilot: {
    id: 'pilot',
    title_bn: 'রকেট পাইলট ক্যাডেট',
    badge: '🚀',
    motto_bn: 'ঝড়ের গতি, নির্ভীক উড্ডয়ন ও গ্রহজয়',
    description_bn: 'তুমি উল্কার গতিতে শক্তিশালী রকেট ওড়াতে এবং নিরাপদে মহাকাশযান ল্যান্ড করাতে ভালোবাসো!',
    recommendedFocus_bn: 'রকেট চালনা ও চন্দ্রাভিযান',
    accentColor: '#FF6B35',
  },
  astronomer: {
    id: 'astronomer',
    title_bn: 'তারা সন্ধানী ক্যাডেট',
    badge: '🔭',
    motto_bn: 'মহাজাগতিক বিস্ময় ও দূর নক্ষত্র দর্শন',
    description_bn: 'তুমি টেলিস্কোপ দিয়ে দূর তারা, নেবুলা, শনির বলয় আর ব্ল্যাকহোলের রহস্য দেখতে ভালোবাসো!',
    recommendedFocus_bn: 'নক্ষত্রমণ্ডল ও গভীর মহাবিশ্ব',
    accentColor: '#00F0FF',
  },
  engineer: {
    id: 'engineer',
    title_bn: 'রকেট ও রোভার ইঞ্জিনিয়ার',
    badge: '🛠️',
    motto_bn: 'প্রযুক্তি উদ্ভাবন ও রোবট নির্মাণ',
    description_bn: 'তুমি মার্স রোভারের রোবটিক হাত, সুপার থ্রাস্টার এবং স্পেস স্টেশন তৈরি করতে ভালোবাসো!',
    recommendedFocus_bn: 'মার্স রোভার ও রকেট প্রযুক্তি',
    accentColor: '#FFB800',
  },
  explorer: {
    id: 'explorer',
    title_bn: 'ভিনগ্রহের সাহসী অভিযাত্রী',
    badge: '🪐',
    motto_bn: 'রহস্য উন্মোচন ও অচেনা জগতের সন্ধান',
    description_bn: 'তুমি অচেনা দূর গ্রহে প্রথম পা রেখে অদ্ভুত স্ফটিক গুহা আর নতুন পৃথিবীর রহস্য খুঁজতে ভালোবাসো!',
    recommendedFocus_bn: 'সৌরজগতের রহস্য ও বহির্গ্রহ',
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

export interface AppState {
  // User Profile & Rank
  displayName: string;
  rank: RankTier;
  xp: number;
  completedLessonIds: string[];
  quizAttempts: Record<string, QuizAttemptRecord[]>; // lessonId -> attempts

  // Onboarding & Psychometric Archetype
  hasCompletedOnboarding: boolean;
  cadetArchetype: CadetArchetype;
  psychometricAnswers: Record<number, number[]>;

  // Active Level-Up Celebration
  activeLevelUp: LevelUpEvent | null;

  // Actions
  setDisplayName: (name: string) => void;
  setCadetArchetype: (archetype: CadetArchetype) => void;
  completeCadetOrientation: (name: string, answers: Record<number, number[]>) => void;
  completeOnboarding: (name?: string) => void;
  resetOnboarding: () => void;
  addXP: (amount: number) => void;
  completeLesson: (lessonId: string) => void;
  recordQuizAttempt: (attempt: QuizAttemptRecord) => void;
  dismissLevelUp: () => void;
  getRankProgress: () => { current: number; max: number; percentage: number };
  resetProgress: () => void;
}

export const RANK_THRESHOLDS: Record<RankTier, { min: number; max: number; label_bn: string }> = {
  'Cadet': { min: 0, max: 200, label_bn: 'স্পেস ক্যাডেট' },
  'Astronaut': { min: 201, max: 600, label_bn: 'মহাকাশচারী' },
  'Mission Specialist': { min: 601, max: 1200, label_bn: 'মিশন বিশেষজ্ঞ' },
  'Commander': { min: 1201, max: 2500, label_bn: 'মহাকাশ কমান্ডার' },
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
  activeLevelUp: null,
  hasCompletedOnboarding: false,
  cadetArchetype: 'pilot',
  psychometricAnswers: {},

  setDisplayName: (name: string) => set({ displayName: name }),
  setCadetArchetype: (archetype: CadetArchetype) => set({ cadetArchetype: archetype }),

  completeCadetOrientation: (name: string, answers: Record<number, number[]>) => {
    const archetype = calculateArchetype(answers);
    set({
      hasCompletedOnboarding: true,
      displayName: name && name.trim().length > 0 ? name.trim() : 'জুনিয়র ক্যাডেট',
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
    });
  },
}));
