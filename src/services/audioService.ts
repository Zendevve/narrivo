import { Book } from '../types';

export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
}

export interface AudioServiceInterface {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  seekTo: (time: number) => Promise<void>;
  setPlaybackRate: (rate: number) => void;
  getState: () => PlayerState;
  loadTrack: (book: Book) => Promise<void>;
  destroy: () => void;
}

/**
 * Web Audio Service using HTML5 Audio
 * For React Native, replace with react-native-track-player
 */
class WebAudioService implements AudioServiceInterface {
  private audio: HTMLAudioElement | null = null;
  private currentBook: Book | null = null;
  private listeners: Map<string, (state: PlayerState) => void> = new Map();
  private playbackRate: number = 1.0;

  async loadTrack(book: Book): Promise<void> {
    if (!book.audiobookPath) {
      throw new Error('No audio file available for this book');
    }

    // Cleanup previous audio
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
    }

    this.audio = new Audio(book.audiobookPath);
    this.audio.playbackRate = this.playbackRate;
    this.currentBook = book;

    // Set up event listeners
    this.audio.addEventListener('timeupdate', () => this.notifyListeners());
    this.audio.addEventListener('play', () => this.notifyListeners());
    this.audio.addEventListener('pause', () => this.notifyListeners());
    this.audio.addEventListener('ended', () => this.notifyListeners());
    this.audio.addEventListener('loadedmetadata', () => this.notifyListeners());

    await this.audio.load();
  }

  async play(): Promise<void> {
    if (!this.audio) return;
    try {
      await this.audio.play();
    } catch (error) {
      console.error('Playback failed:', error);
    }
  }

  async pause(): Promise<void> {
    if (!this.audio) return;
    this.audio.pause();
  }

  async seekTo(time: number): Promise<void> {
    if (!this.audio) return;
    this.audio.currentTime = time;
  }

  setPlaybackRate(rate: number): void {
    this.playbackRate = rate;
    if (this.audio) {
      this.audio.playbackRate = rate;
    }
  }

  getState(): PlayerState {
    if (!this.audio) {
      return {
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        playbackRate: this.playbackRate,
      };
    }

    return {
      isPlaying: !this.audio.paused,
      currentTime: this.audio.currentTime,
      duration: this.audio.duration || 0,
      playbackRate: this.audio.playbackRate,
    };
  }

  subscribe(id: string, callback: (state: PlayerState) => void): void {
    this.listeners.set(id, callback);
  }

  unsubscribe(id: string): void {
    this.listeners.delete(id);
  }

  private notifyListeners(): void {
    const state = this.getState();
    this.listeners.forEach((callback) => callback(state));
  }

  destroy(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }
    this.listeners.clear();
  }
}

// Singleton instance
export const audioService = new WebAudioService();
