/**
 * Narrivo Pro Store
 *
 * Manages Pro/Premium status with one-time purchase.
 * Persisted via AsyncStorage.
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PRO_STORAGE_KEY = 'narrivo_pro_status';

interface ProState {
  isPro: boolean;
  purchaseDate: string | null;
  isLoading: boolean;

  // Actions
  loadProStatus: () => Promise<void>;
  unlockPro: () => void;
  resetPro: () => void; // For testing/refunds
}

/**
 * Pro Features List (for reference):
 *
 * FREE:
 * - Library management
 * - Import own files
 * - Basic audio playback (no speed control)
 * - Basic EPUB reading
 * - Public domain downloads
 * - 1 bookmark per book
 *
 * PRO:
 * - Read-Along mode
 * - Unlimited bookmarks
 * - Sleep timer
 * - Playback speed control (0.75x - 2x)
 * - Background audio / lock screen
 * - Chapter navigation in Read-Along
 */

export const PRO_FEATURES = {
  READ_ALONG: 'read_along',
  UNLIMITED_BOOKMARKS: 'unlimited_bookmarks',
  SLEEP_TIMER: 'sleep_timer',
  PLAYBACK_SPEED: 'playback_speed',
  CHAPTER_NAVIGATION: 'chapter_navigation',
} as const;

export type ProFeature = typeof PRO_FEATURES[keyof typeof PRO_FEATURES];

export const useProStore = create<ProState>((set) => ({
  isPro: false,
  purchaseDate: null,
  isLoading: true,

  loadProStatus: async () => {
    try {
      const stored = await AsyncStorage.getItem(PRO_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        set({
          isPro: data.isPro || false,
          purchaseDate: data.purchaseDate || null,
          isLoading: false
        });
      } else {
        set({ isLoading: false });
      }
    } catch (e) {
      console.error('Failed to load pro status:', e);
      set({ isLoading: false });
    }
  },

  unlockPro: () => {
    const purchaseDate = new Date().toISOString();
    set({ isPro: true, purchaseDate });
    AsyncStorage.setItem(PRO_STORAGE_KEY, JSON.stringify({
      isPro: true,
      purchaseDate
    }));
  },

  resetPro: () => {
    set({ isPro: false, purchaseDate: null });
    AsyncStorage.removeItem(PRO_STORAGE_KEY);
  },
}));

/**
 * Helper hook to check if a specific feature is available
 */
export const useHasFeature = (feature: ProFeature): boolean => {
  const isPro = useProStore((s) => s.isPro);
  return isPro;
};

/**
 * Maximum bookmarks for free users
 */
export const FREE_BOOKMARK_LIMIT = 1;
