/**
 * Narrivo Book Types - React Native/Expo
 */

export type BookType = 'AUDIO' | 'EBOOK' | 'HYBRID';

export type BookSource = 'USER' | 'PUBLIC';

export interface Bookmark {
  id: string;
  type?: 'audio' | 'text';
  position: number; // seconds for audio, character/page for text
  note?: string;
  label?: string;
  timestamp?: number;
  createdAt?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;

  // File paths (file:// URIs for local, https:// for remote)
  audiobookPath?: string;
  ebookPath?: string;

  // Dynamic type based on available files
  type: BookType;

  // Source tracking
  source: BookSource;
  isDownloaded: boolean;

  // Progress
  lastPosition?: number;
  bookmarks?: Bookmark[];

  // Metadata
  duration?: number; // seconds for audiobooks
  pageCount?: number; // for ebooks
}

export enum ViewMode {
  LIBRARY = 'library',
  READER = 'reader',
  PLAYER = 'player',
}

export enum PlayerState {
  IDLE = 'idle',
  LOADING = 'loading',
  PLAYING = 'playing',
  PAUSED = 'paused',
  ERROR = 'error',
}
