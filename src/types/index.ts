export interface SyncSegment {
  start: number;
  end: number;
  text: string;
}

export interface Bookmark {
  id: string;
  type: 'audio' | 'text';
  position: number;
  note?: string;
  timestamp: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  // Changed from URL to path for Android file URIs
  audiobookPath: string | null;
  ebookPath: string | null;
  syncData?: SyncSegment[];
  duration: number;
  color: string;
  type: 'AUDIO' | 'EBOOK' | 'HYBRID';
  isDownloaded: boolean;
  source: 'USER' | 'PUBLIC';
  lastPosition?: number;
  bookmarks?: Bookmark[];
}

export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  currentBookId: string | null;
  playbackRate: number;
}

export enum ViewMode {
  LIBRARY = 'LIBRARY',
  READER = 'READER',
  READ_ALONG = 'READ_ALONG',
  SETTINGS = 'SETTINGS'
}
