/**
 * Narrivo Audio Service - expo-av Edition
 *
 * Provides audio playback with background support.
 * Uses expo-av which works with Expo Go for rapid development.
 */

import { Audio, AVPlaybackStatus } from 'expo-av';
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
  private sound: Audio.Sound | null = null;
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

  constructor() {
    this.setupAudioMode();
  }

  private async setupAudioMode() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (e) {
      console.error('Failed to set audio mode:', e);
    }
  }

  async setup(): Promise<boolean> {
    // expo-av doesn't need explicit setup
    return true;
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

  private onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      if (status.error) {
        this.updateState({ error: status.error, isLoading: false });
      }
      return;
    }

    this.updateState({
      isPlaying: status.isPlaying,
      isLoading: false,
      currentTime: status.positionMillis / 1000,
      duration: (status.durationMillis || 0) / 1000,
      playbackRate: status.rate,
      error: null,
    });
  };

  async loadTrack(book: Book) {
    if (!book.audiobookPath) {
      this.updateState({ error: 'No audio file available' });
      return;
    }

    try {
      // Unload previous
      if (this.sound) {
        await this.sound.unloadAsync();
      }

      this.updateState({ isLoading: true, error: null });
      this.currentBook = book;

      const { sound } = await Audio.Sound.createAsync(
        { uri: book.audiobookPath },
        { shouldPlay: false, progressUpdateIntervalMillis: 500 },
        this.onPlaybackStatusUpdate
      );

      this.sound = sound;

      // Resume from last position if available
      if (book.lastPosition && book.lastPosition > 0) {
        await sound.setPositionAsync(book.lastPosition * 1000);
      }
    } catch (e) {
      console.error('Failed to load audio:', e);
      this.updateState({
        isLoading: false,
        error: e instanceof Error ? e.message : 'Failed to load audio'
      });
    }
  }

  async play() {
    if (!this.sound) return;
    try {
      await this.sound.playAsync();
    } catch (e) {
      console.error('Failed to play:', e);
    }
  }

  async pause() {
    if (!this.sound) return;
    try {
      await this.sound.pauseAsync();
    } catch (e) {
      console.error('Failed to pause:', e);
    }
  }

  async seekTo(seconds: number) {
    if (!this.sound) return;
    try {
      await this.sound.setPositionAsync(seconds * 1000);
    } catch (e) {
      console.error('Failed to seek:', e);
    }
  }

  async setRate(rate: number) {
    if (!this.sound) return;
    try {
      await this.sound.setRateAsync(rate, true);
      this.updateState({ playbackRate: rate });
    } catch (e) {
      console.error('Failed to set rate:', e);
    }
  }

  async skip(seconds: number) {
    const newTime = Math.max(0, Math.min(this.state.duration, this.state.currentTime + seconds));
    await this.seekTo(newTime);
  }

  getCurrentBook(): Book | null {
    return this.currentBook;
  }

  getState(): AudioState {
    return this.state;
  }

  async getPosition(): Promise<number> {
    return this.state.currentTime;
  }

  async cleanup() {
    if (this.sound) {
      await this.sound.unloadAsync();
      this.sound = null;
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
}

export const audioService = new AudioService();
