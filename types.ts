export interface SyncSegment {
  start: number;
  end: number;
  text: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  audioUrl: string | null;
  textContent: string | null;
  syncData?: SyncSegment[]; // For read-along
  duration: number; // in seconds
  color: string; // Background gradient accent
  type: 'AUDIO' | 'EBOOK' | 'HYBRID';
  isDownloaded: boolean;
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
  SETTINGS = 'SETTINGS'
}