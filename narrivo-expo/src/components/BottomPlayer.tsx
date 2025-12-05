import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { colors, spacing, borderRadius, typography } from '../theme';
import { Book } from '../types';
import { audioService, AudioState } from '../services/audioService';
import { PlayIcon, PauseIcon, AudioIcon, BookIcon } from './Icons';

interface BottomPlayerProps {
  currentBook: Book | null;
  onOpenReader?: () => void;
}

export const BottomPlayer: React.FC<BottomPlayerProps> = ({ currentBook, onOpenReader }) => {
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    isLoading: false,
    currentTime: 0,
    duration: 0,
    playbackRate: 1.0,
    error: null,
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    audioService.subscribe('bottom-player', setAudioState);
    return () => audioService.unsubscribe('bottom-player');
  }, []);

  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progress = audioState.duration ? audioState.currentTime / audioState.duration : 0;
  const hasAudio = currentBook?.audiobookPath;

  const handlePlayPause = async () => {
    if (!hasAudio) return;
    if (audioState.isPlaying) {
      await audioService.pause();
    } else {
      await audioService.play();
    }
  };

  const handleSeek = (value: number) => {
    audioService.seekTo(value * audioState.duration);
  };

  const handleSkip = (seconds: number) => {
    audioService.skip(seconds);
  };

  return (
    <View style={styles.wrapper}>
      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <TouchableOpacity
        style={styles.player}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.9}
      >
        {/* Left: Cover + Info */}
        <View style={styles.left}>
          {currentBook ? (
            <>
              <View style={styles.cover}>
                <Image source={{ uri: currentBook.coverUrl }} style={styles.coverImg} />
              </View>
              <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>{currentBook.title}</Text>
                <Text style={styles.author} numberOfLines={1}>{currentBook.author}</Text>
              </View>
            </>
          ) : (
            <View style={styles.empty}>
              <AudioIcon size={20} color={colors.gray} />
              <Text style={styles.emptyText}>Select a track</Text>
            </View>
          )}
        </View>

        {/* Right: Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[
              styles.playBtn,
              { backgroundColor: hasAudio ? colors.lime : colors.border }
            ]}
            onPress={handlePlayPause}
            disabled={!hasAudio || audioState.isLoading}
          >
            {audioState.isPlaying ? (
              <PauseIcon size={18} color={colors.black} />
            ) : (
              <PlayIcon size={18} color={hasAudio ? colors.black : colors.gray} />
            )}
          </TouchableOpacity>

          {currentBook?.ebookPath && onOpenReader && (
            <TouchableOpacity style={styles.readerBtn} onPress={onOpenReader}>
              <BookIcon size={16} color={colors.white} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>

      {/* Expanded controls */}
      {isExpanded && hasAudio && (
        <View style={styles.expanded}>
          {/* Time + Scrubber */}
          <View style={styles.scrubberRow}>
            <Text style={styles.time}>{formatTime(audioState.currentTime)}</Text>
            <Slider
              style={styles.slider}
              value={progress}
              onSlidingComplete={handleSeek}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor={colors.lime}
              maximumTrackTintColor={colors.border}
              thumbTintColor={colors.lime}
            />
            <Text style={styles.time}>{formatTime(audioState.duration)}</Text>
          </View>

          {/* Skip controls */}
          <View style={styles.skipRow}>
            <TouchableOpacity style={styles.skipBtn} onPress={() => handleSkip(-30)}>
              <Text style={styles.skipText}>-30s</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipBtn} onPress={() => handleSkip(-10)}>
              <Text style={styles.skipText}>-10s</Text>
            </TouchableOpacity>
            <Text style={styles.rateText}>{audioState.playbackRate}x</Text>
            <TouchableOpacity style={styles.skipBtn} onPress={() => handleSkip(10)}>
              <Text style={styles.skipText}>+10s</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipBtn} onPress={() => handleSkip(30)}>
              <Text style={styles.skipText}>+30s</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  progressTrack: {
    height: 3,
    backgroundColor: colors.border,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.lime,
  },
  player: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 60,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cover: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    backgroundColor: colors.bg,
  },
  coverImg: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
  },
  title: {
    ...typography.small,
    color: colors.white,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  author: {
    ...typography.label,
    color: colors.gray,
  },
  empty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.label,
    color: colors.gray,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  readerBtn: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expanded: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  scrubberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  slider: {
    flex: 1,
    height: 20,
  },
  time: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: colors.gray,
    minWidth: 36,
  },
  skipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  skipBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  skipText: {
    ...typography.label,
    color: colors.periwinkle,
  },
  rateText: {
    ...typography.label,
    color: colors.lime,
    minWidth: 32,
    textAlign: 'center',
  },
});
