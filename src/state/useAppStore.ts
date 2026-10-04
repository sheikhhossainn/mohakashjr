import { create } from 'zustand';
import { RankTier, QuizAttemptRecord } from '../content/schema';
import { authDatabase, UserAccount } from '../services/authDatabase';
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

export interface AppState {
  // User Profile & Rank
  displayName: string;
  rank: RankTier;
  xp: number;
  completedLessonIds: string[];
  quizAttempts: Record<string, QuizAttemptRecord[]>; // lessonId -> attempts

  // Account & Authentication
  currentUser: UserAccount | null;
  isGuest: boolean;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  authError: string | null;

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

  // Auth & Database Actions
  initializeSession: () => Promise<boolean>;
  signUpUser: (params: {
    username: string;
    displayName: string;
    password: string;
    cadetArchetype?: CadetArchetype;
    psychometricAnswers?: Record<number, number[]>;
  }) => Promise<{ success: boolean; error?: string }>;
  loginUser: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  continueAsGuest: (displayName?: string, archetype?: CadetArchetype, answers?: Record<number, number[]>) => Promise<void>;
  logoutUser: () => Promise<void>;
  syncCurrentProgressToDb: () => Promise<void>;

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
  currentUser: null,
  isGuest: false,
  isAuthenticated: false,
  isAuthLoading: false,
  authError: null,
  activeLevelUp: null,
  hasCompletedOnboarding: false,
  cadetArchetype: 'pilot',
  psychometricAnswers: {},
  language: 'bn',

  setLanguage: async (lang: AppLanguage) => {
    set({ language: lang });
    await authDatabase.setStoredLanguage(lang);
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

  resetOnboarding: () => set({ hasCompletedOnboarding: false, isAuthenticated: false }),

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

    // Sync to database
    get().syncCurrentProgressToDb();
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
    } else {
      get().syncCurrentProgressToDb();
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
      currentUser: null,
      isGuest: false,
      isAuthenticated: false,
      activeLevelUp: null,
      hasCompletedOnboarding: false,
      cadetArchetype: 'pilot',
      psychometricAnswers: {},
    });
  },

  // ── Database & Auth Actions ────────────────────────────────────────────────
  initializeSession: async () => {
    set({ isAuthLoading: true });
    try {
      const storedLang = await authDatabase.getStoredLanguage();
      set({ language: storedLang });

      const sessionUser = await authDatabase.getCurrentSession();
      if (sessionUser) {
        set({
          currentUser: sessionUser,
          isGuest: sessionUser.isGuest,
          isAuthenticated: true,
          hasCompletedOnboarding: true,
          displayName: sessionUser.displayName,
          rank: sessionUser.rank,
          xp: sessionUser.xp,
          completedLessonIds: sessionUser.completedLessonIds || [],
          quizAttempts: sessionUser.quizAttempts || {},
          cadetArchetype: sessionUser.cadetArchetype || 'pilot',
          psychometricAnswers: sessionUser.psychometricAnswers || {},
          isAuthLoading: false,
        });
        return true;
      }
    } catch {
      // Ignore
    }
    set({ isAuthLoading: false });
    return false;
  },

  signUpUser: async (params) => {
    set({ isAuthLoading: true, authError: null });
    const res = await authDatabase.signUp({
      username: params.username,
      displayName: params.displayName,
      password: params.password,
      cadetArchetype: params.cadetArchetype || get().cadetArchetype,
      psychometricAnswers: params.psychometricAnswers || get().psychometricAnswers,
    });

    if (res.success && res.user) {
      set({
        currentUser: res.user,
        isGuest: false,
        isAuthenticated: true,
        hasCompletedOnboarding: true,
        displayName: res.user.displayName,
        rank: res.user.rank,
        xp: res.user.xp,
        completedLessonIds: res.user.completedLessonIds,
        quizAttempts: res.user.quizAttempts,
        cadetArchetype: res.user.cadetArchetype,
        psychometricAnswers: res.user.psychometricAnswers,
        isAuthLoading: false,
        authError: null,
      });
      return { success: true };
    } else {
      set({ isAuthLoading: false, authError: res.error || 'নিবন্ধন ব্যর্থ হয়েছে।' });
      return { success: false, error: res.error };
    }
  },

  loginUser: async (username, password) => {
    set({ isAuthLoading: true, authError: null });
    const res = await authDatabase.login(username, password);

    if (res.success && res.user) {
      set({
        currentUser: res.user,
        isGuest: res.user.isGuest,
        isAuthenticated: true,
        hasCompletedOnboarding: true,
        displayName: res.user.displayName,
        rank: res.user.rank,
        xp: res.user.xp,
        completedLessonIds: res.user.completedLessonIds || [],
        quizAttempts: res.user.quizAttempts || {},
        cadetArchetype: res.user.cadetArchetype || 'pilot',
        psychometricAnswers: res.user.psychometricAnswers || {},
        isAuthLoading: false,
        authError: null,
      });
      return { success: true };
    } else {
      set({ isAuthLoading: false, authError: res.error || 'লগইন ব্যর্থ হয়েছে।' });
      return { success: false, error: res.error };
    }
  },

  continueAsGuest: async (displayName, archetype, answers) => {
    set({ isAuthLoading: true });
    const chosenArchetype = archetype || get().cadetArchetype;
    const chosenAnswers = answers || get().psychometricAnswers;
    const chosenName = displayName?.trim() || get().displayName || 'অতিথি ক্যাডেট';

    const guestUser = await authDatabase.loginAsGuest({
      displayName: chosenName,
      cadetArchetype: chosenArchetype,
      psychometricAnswers: chosenAnswers,
    });

    set({
      currentUser: guestUser,
      isGuest: true,
      isAuthenticated: true,
      hasCompletedOnboarding: true,
      displayName: guestUser.displayName,
      rank: guestUser.rank,
      xp: guestUser.xp,
      completedLessonIds: [],
      quizAttempts: {},
      cadetArchetype: guestUser.cadetArchetype,
      psychometricAnswers: guestUser.psychometricAnswers,
      isAuthLoading: false,
      authError: null,
    });
  },

  logoutUser: async () => {
    await authDatabase.logout();
    set({
      currentUser: null,
      isAuthenticated: false,
      isGuest: false,
      hasCompletedOnboarding: false,
      xp: 0,
      rank: 'Cadet',
      completedLessonIds: [],
      quizAttempts: {},
      displayName: 'জুনিয়র ক্যাডেট',
    });
  },

  syncCurrentProgressToDb: async () => {
    const user = get().currentUser;
    if (user) {
      await authDatabase.updateProgress(user.id, {
        xp: get().xp,
        rank: get().rank,
        completedLessonIds: get().completedLessonIds,
        quizAttempts: get().quizAttempts,
        cadetArchetype: get().cadetArchetype,
        displayName: get().displayName,
      });
    }
  },
}));
