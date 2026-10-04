import AsyncStorage from '@react-native-async-storage/async-storage';
import { RankTier, QuizAttemptRecord } from '../content/schema';
import { CadetArchetype } from '../state/useAppStore';

export interface UserAccount {
  id: string;
  username: string;
  displayName: string;
  passwordHash: string;
  isGuest: boolean;
  cadetArchetype: CadetArchetype;
  rank: RankTier;
  xp: number;
  completedLessonIds: string[];
  quizAttempts: Record<string, QuizAttemptRecord[]>;
  psychometricAnswers: Record<number, number[]>;
  createdAt: string;
  lastLoginAt: string;
}

const STORAGE_USERS_KEY = '@mohakashjr_users_v2';
const STORAGE_SESSION_KEY = '@mohakashjr_session_v2';

// In-memory fallback if storage encounters issues
let memoryUsers: Record<string, UserAccount> = {};
let memoryCurrentSessionId: string | null = null;

// Simple non-cryptographic hash for space cadet app kid authentication
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return 'h_' + Math.abs(hash).toString(36) + '_' + str.length;
}

export const authDatabase = {
  /**
   * Fetch all registered accounts from persistent storage
   */
  async getAllUsers(): Promise<UserAccount[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_USERS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        memoryUsers = parsed;
        return Object.values(parsed);
      }
    } catch {
      // Fallback to memory
    }
    return Object.values(memoryUsers);
  },

  /**
   * Save the full users dictionary to persistent storage
   */
  async _persistUsers(users: Record<string, UserAccount>): Promise<void> {
    memoryUsers = users;
    try {
      await AsyncStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    } catch {
      // Silently fall back to memory
    }
  },

  /**
   * Get user by username (case-insensitive)
   */
  async getUserByUsername(username: string): Promise<UserAccount | null> {
    const users = await this.getAllUsers();
    const normalized = username.trim().toLowerCase();
    const found = users.find((u) => u.username.toLowerCase() === normalized);
    return found || null;
  },

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<UserAccount | null> {
    const users = await this.getAllUsers();
    const found = users.find((u) => u.id === id);
    return found || null;
  },

  /**
   * Register a brand new Cadet account
   */
  async signUp(params: {
    username: string;
    displayName: string;
    password: string;
    cadetArchetype?: CadetArchetype;
    psychometricAnswers?: Record<number, number[]>;
  }): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    const trimmedUsername = params.username.trim();
    const trimmedName = params.displayName.trim();
    const password = params.password.trim();

    if (trimmedUsername.length < 2) {
      return { success: false, error: 'ইউজারনেম কমপক্ষে ২ অক্ষরের হতে হবে।' };
    }
    if (trimmedName.length === 0) {
      return { success: false, error: 'তোমার নাম প্রদান করো।' };
    }
    if (password.length < 3) {
      return { success: false, error: 'পাসওয়ার্ড কমপক্ষে ৩ অক্ষরের হতে হবে।' };
    }

    const existing = await this.getUserByUsername(trimmedUsername);
    if (existing) {
      return { success: false, error: 'এই ইউজারনেমটি ইতিমধ্যে ব্যবহৃত হয়েছে! অন্য একটি কল-সাইন বেছে নাও।' };
    }

    const now = new Date().toISOString();
    const newUser: UserAccount = {
      id: 'cadet_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      username: trimmedUsername.toLowerCase(),
      displayName: trimmedName,
      passwordHash: simpleHash(password),
      isGuest: false,
      cadetArchetype: params.cadetArchetype || 'pilot',
      rank: 'Cadet',
      xp: 0,
      completedLessonIds: [],
      quizAttempts: {},
      psychometricAnswers: params.psychometricAnswers || {},
      createdAt: now,
      lastLoginAt: now,
    };

    const allUsers = { ...memoryUsers, [newUser.id]: newUser };
    await this._persistUsers(allUsers);
    await this.setActiveSession(newUser.id);

    return { success: true, user: newUser };
  },

  /**
   * Login an existing Cadet with username & password
   */
  async login(
    username: string,
    password: string
  ): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername) {
      return { success: false, error: 'ইউজারনেম প্রদান করো।' };
    }
    if (!trimmedPassword) {
      return { success: false, error: 'পাসওয়ার্ড প্রদান করো।' };
    }

    const user = await this.getUserByUsername(trimmedUsername);
    if (!user) {
      return { success: false, error: 'এই ইউজারনেমের কোনো ক্যাডেট অ্যাকাউন্ট পাওয়া যায়নি।' };
    }

    if (user.passwordHash !== simpleHash(trimmedPassword)) {
      return { success: false, error: 'ভুল পাসওয়ার্ড! আবার চেষ্টা করো।' };
    }

    // Update lastLoginAt
    user.lastLoginAt = new Date().toISOString();
    const allUsers = { ...memoryUsers, [user.id]: user };
    await this._persistUsers(allUsers);
    await this.setActiveSession(user.id);

    return { success: true, user };
  },

  /**
   * Create or resume a Guest session
   */
  async loginAsGuest(params?: {
    displayName?: string;
    cadetArchetype?: CadetArchetype;
    psychometricAnswers?: Record<number, number[]>;
  }): Promise<UserAccount> {
    const now = new Date().toISOString();
    const guestUser: UserAccount = {
      id: 'guest_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      username: 'guest_' + Math.floor(1000 + Math.random() * 9000),
      displayName: params?.displayName?.trim() || 'অতিথি ক্যাডেট',
      passwordHash: '',
      isGuest: true,
      cadetArchetype: params?.cadetArchetype || 'pilot',
      rank: 'Cadet',
      xp: 0,
      completedLessonIds: [],
      quizAttempts: {},
      psychometricAnswers: params?.psychometricAnswers || {},
      createdAt: now,
      lastLoginAt: now,
    };

    const allUsers = { ...memoryUsers, [guestUser.id]: guestUser };
    await this._persistUsers(allUsers);
    await this.setActiveSession(guestUser.id);

    return guestUser;
  },

  /**
   * Set active logged-in session ID
   */
  async setActiveSession(userId: string): Promise<void> {
    memoryCurrentSessionId = userId;
    try {
      await AsyncStorage.setItem(STORAGE_SESSION_KEY, userId);
    } catch {
      // Fallback
    }
  },

  /**
   * Retrieve currently active user session
   */
  async getCurrentSession(): Promise<UserAccount | null> {
    try {
      const sessionId = (await AsyncStorage.getItem(STORAGE_SESSION_KEY)) || memoryCurrentSessionId;
      if (!sessionId) return null;
      return await this.getUserById(sessionId);
    } catch {
      if (memoryCurrentSessionId) {
        return this.getUserById(memoryCurrentSessionId);
      }
      return null;
    }
  },

  /**
   * Logout and clear active session
   */
  async logout(): Promise<void> {
    memoryCurrentSessionId = null;
    try {
      await AsyncStorage.removeItem(STORAGE_SESSION_KEY);
    } catch {
      // Fallback
    }
  },

  /**
   * Sync and update user progress back into the database
   */
  async updateProgress(
    userId: string,
    updates: Partial<Pick<UserAccount, 'xp' | 'rank' | 'completedLessonIds' | 'quizAttempts' | 'cadetArchetype' | 'displayName'>>
  ): Promise<void> {
    const users = await this.getAllUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const updatedUser: UserAccount = {
      ...user,
      ...updates,
      lastLoginAt: new Date().toISOString(),
    };

    const newMap = { ...memoryUsers, [userId]: updatedUser };
    await this._persistUsers(newMap);
  },

  /**
   * Reset all data (for testing purposes)
   */
  async _resetAll(): Promise<void> {
    memoryUsers = {};
    memoryCurrentSessionId = null;
    try {
      await AsyncStorage.removeItem(STORAGE_USERS_KEY);
      await AsyncStorage.removeItem(STORAGE_SESSION_KEY);
    } catch {
      // Fallback
    }
  },
};
