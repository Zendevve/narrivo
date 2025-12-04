// Web-compatible storage using localStorage
// For React Native, swap with @react-native-async-storage/async-storage
const storage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('Storage setItem failed:', e);
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Storage removeItem failed:', e);
    }
  },
  multiRemove: (keys: string[]): void => {
    keys.forEach((key) => storage.removeItem(key));
  },
};

import { Bookmark } from '../types';

const KEYS = {
  BOOKMARKS: 'narrivo_bookmarks_',
  POSITION: 'narrivo_position_',
  SETTINGS: 'narrivo_settings',
};

/**
 * Save a bookmark for a specific book
 */
export const saveBookmark = (bookId: string, bookmark: Bookmark): void => {
  try {
    const key = `${KEYS.BOOKMARKS}${bookId}`;
    const existing = storage.getItem(key);
    const bookmarks: Bookmark[] = existing ? JSON.parse(existing) : [];
    bookmarks.push(bookmark);
    storage.setItem(key, JSON.stringify(bookmarks));
  } catch (error) {
    console.error('Failed to save bookmark:', error);
  }
};

/**
 * Get all bookmarks for a book
 */
export const getBookmarks = (bookId: string): Bookmark[] => {
  try {
    const key = `${KEYS.BOOKMARKS}${bookId}`;
    const data = storage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get bookmarks:', error);
    return [];
  }
};

/**
 * Save last playback/read position
 */
export const saveLastPosition = (bookId: string, position: number): void => {
  try {
    const key = `${KEYS.POSITION}${bookId}`;
    storage.setItem(key, position.toString());
  } catch (error) {
    console.error('Failed to save position:', error);
  }
};

/**
 * Get last position
 */
export const getLastPosition = (bookId: string): number => {
  try {
    const key = `${KEYS.POSITION}${bookId}`;
    const pos = storage.getItem(key);
    return pos ? parseFloat(pos) : 0;
  } catch (error) {
    console.error('Failed to get position:', error);
    return 0;
  }
};

/**
 * Clear all data for a book (used when deleting)
 */
export const clearBookData = (bookId: string): void => {
  try {
    storage.multiRemove([
      `${KEYS.BOOKMARKS}${bookId}`,
      `${KEYS.POSITION}${bookId}`
    ]);
  } catch (error) {
    console.error('Failed to clear book data:', error);
  }
};
