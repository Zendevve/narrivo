/**
 * Narrivo Audio Service - react-native-track-player Edition
 *
 * Provides robust background audio playback with:
 * - Lock screen controls
 * - Notification controls
 * - Background playback (works reliably on Android)
 * - Playback speed control
 * - Position persistence
 */

import TrackPlayer, {
  Capability,
  State,
  Event,
  useProgress,
  usePlaybackState,
} from 'react-native-track-player';
import { Book } from '../types';

export interface AudioState {
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  error: string | null;
}

type AudioSubscriber = (state: AudioState) => void;

class AudioService {
  private isSetup = false;
  private currentBook: Book | null = null;
  private subscribers: Map<string, AudioSubscriber> = new Map();
  private state: AudioState = {
    isPlaying: false,
    isLoading: false,
    currentTime: 0,
    duration: 0,
    playbackRate: 1.0,
    error: null,
  };
  private progressInterval: NodeJS.Timeout | null = null;

  /**
   * Initialize the track player. Must be called before any other method.
   */
  async setup(): Promise<boolean> {
    if (this.isSetup) return true;

    try {
      await TrackPlayer.setupPlayer({
        // Configure for audiobook playback
        waitForBuffer: true,
      });

      // Configure capabilities for lock screen / notification
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SeekTo,
          Capability.JumpForward,
          Capability.JumpBackward,
        ],
        compactCapabilities: [Capability.Play, Capability.Pause],
        forwardJumpInterval: 30,
        backwardJumpInterval: 10,
        progressUpdateEventInterval: 1,
      });

      // Listen for playback state changes
      TrackPlayer.addEventListener(Event.PlaybackState, async (event) => {
        const isPlaying = event.state === State.Playing;
        const isLoading = event.state === State.Loading || event.state === State.Buffering;

        this.updateState({
          isPlaying,
          isLoading,
          error: null,
        });
      });

      // Listen for errors
      TrackPlayer.addEventListener(Event.PlaybackError, (error) => {
        this.updateState({
          error: error.message || 'Playback error',
          isLoading: false,
        });
      });

      // Start progress polling
      this.startProgressUpdates();

      this.isSetup = true;
      return true;
    } catch (e) {
      console.error('Failed to setup TrackPlayer:', e);
      return false;
    }
  }

  private startProgressUpdates() {
    if (this.progressInterval) return;

    this.progressInterval = setInterval(async () => {
      try {
        const [position, duration] = await Promise.all([
          TrackPlayer.getPosition(),
          TrackPlayer.getDuration(),
        ]);

        this.updateState({
          currentTime: position,
          duration: duration || 0,
        });
      } catch (e) {
        // Ignore errors during progress update
      }
    }, 500);
  }

  private stopProgressUpdates() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  subscribe(id: string, callback: AudioSubscriber) {
    this.subscribers.set(id, callback);
    callback(this.state);
  }

  unsubscribe(id: string) {
    this.subscribers.delete(id);
  }

  private notify() {
    this.subscribers.forEach((cb) => cb(this.state));
  }

  private updateState(updates: Partial<AudioState>) {
    this.state = { ...this.state, ...updates };
    this.notify();
  }

  /**
   * Load a book's audio track
   */
  async loadTrack(book: Book) {
    if (!book.audiobookPath) {
      this.updateState({ error: 'No audio file available' });
      return;
    }

    // Ensure player is set up
    await this.setup();

    try {
      this.updateState({ isLoading: true, error: null });
      this.currentBook = book;

      // Clear existing queue
      await TrackPlayer.reset();

      // Add the track
      await TrackPlayer.add({
        id: book.id,
        url: book.audiobookPath,
        title: book.title,
        artist: book.author,
        artwork: book.coverUrl || undefined,
        duration: book.duration,
      });

      // Resume from last position if available
      if (book.lastPosition && book.lastPosition > 0) {
        await TrackPlayer.seekTo(book.lastPosition);
      }

      this.updateState({ isLoading: false });
    } catch (e) {
      console.error('Failed to load track:', e);
      this.updateState({
        isLoading: false,
        error: e instanceof Error ? e.message : 'Failed to load audio',
      });
    }
  }

  async play() {
    try {
      await TrackPlayer.play();
    } catch (e) {
      console.error('Failed to play:', e);
    }
  }

  async pause() {
    try {
      await TrackPlayer.pause();
    } catch (e) {
      console.error('Failed to pause:', e);
    }
  }

  async seekTo(seconds: number) {
    try {
      await TrackPlayer.seekTo(seconds);
    } catch (e) {
      console.error('Failed to seek:', e);
    }
  }

  async setRate(rate: number) {
    try {
      await TrackPlayer.setRate(rate);
      this.updateState({ playbackRate: rate });
    } catch (e) {
      console.error('Failed to set rate:', e);
    }
  }

  async skip(seconds: number) {
    const position = await TrackPlayer.getPosition();
    const duration = await TrackPlayer.getDuration();
    const newTime = Math.max(0, Math.min(duration, position + seconds));
    await this.seekTo(newTime);
  }

  getCurrentBook(): Book | null {
    return this.currentBook;
  }

  getState(): AudioState {
    return this.state;
  }

  async cleanup() {
    this.stopProgressUpdates();
    try {
      await TrackPlayer.reset();
    } catch (e) {
      // Ignore
    }
    this.currentBook = null;
    this.updateState({
      isPlaying: false,
      isLoading: false,
      currentTime: 0,
      duration: 0,
      error: null,
    });
  }

  /**
   * Get current position (useful for saving progress)
   */
  async getPosition(): Promise<number> {
    try {
      return await TrackPlayer.getPosition();
    } catch (e) {
      return 0;
    }
  }
}

export const audioService = new AudioService();

/**
 * React hook for progress updates
 * Use this in components for reactive progress updates
 */
export { useProgress, usePlaybackState };
