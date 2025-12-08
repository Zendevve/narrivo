import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';
import { audioService, AudioState } from '../services/audioService';
import { PlayIcon, PauseIcon, SkipBackIcon, SkipForwardIcon, BookIcon } from '../components/Icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PlayerStackParamList } from '../navigation/RootNavigator';

type PlayerScreenNavigationProp = StackNavigationProp<PlayerStackParamList, 'NowPlaying'>;

export const PlayerScreen: React.FC = () => {
  const navigation = useNavigation<PlayerScreenNavigationProp>();
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    isLoading: false,
    currentTime: 0,
    duration: 0,
    playbackRate: 1.0,
    error: null,
  });
  const currentBook = audioService.getCurrentBook();

  useEffect(() => {
    audioService.subscribe('player-screen', setAudioState);
    return () => audioService.unsubscribe('player-screen');
  }, []);

  const handlePlayPause = async () => {
    if (audioState.isPlaying) {
      await audioService.pause();
    } else {
      await audioService.play();
    }
  };

  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progress = audioState.duration > 0 ? audioState.currentTime / audioState.duration : 0;

  const handleOpenReadAlong = () => {
    if (currentBook?.ebookPath && currentBook?.audiobookPath) {
      navigation.navigate('ReadAlong', { book: currentBook });
    }
  };

  if (!currentBook) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Book Playing</Text>
          <Text style={styles.emptyText}>Select a book from your library to start listening.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Cover Art */}
      <View style={styles.coverContainer}>
        <Image
          source={{ uri: currentBook.coverUrl || 'https://via.placeholder.com/300' }}
          style={styles.coverImage}
        />
      </View>

      {/* Book Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>{currentBook.title}</Text>
        <Text style={styles.author}>{currentBook.author}</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(audioState.currentTime)}</Text>
          <Text style={styles.timeText}>{formatTime(audioState.duration)}</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.skipBtn} onPress={() => audioService.skip(-30)}>
          <SkipBackIcon size={28} color={colors.white} />
          <Text style={styles.skipLabel}>30</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playBtn}
          onPress={handlePlayPause}
          disabled={audioState.isLoading}
        >
          {audioState.isPlaying ? (
            <PauseIcon size={32} color={colors.black} />
          ) : (
            <PlayIcon size={32} color={colors.black} />
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipBtn} onPress={() => audioService.skip(30)}>
          <SkipForwardIcon size={28} color={colors.white} />
          <Text style={styles.skipLabel}>30</Text>
        </TouchableOpacity>
      </View>

      {/* Speed Control */}
      <View style={styles.speedRow}>
        {[0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
          <TouchableOpacity
            key={rate}
            style={[styles.speedBtn, audioState.playbackRate === rate && styles.speedBtnActive]}
            onPress={() => audioService.setRate(rate)}
          >
            <Text style={[styles.speedText, audioState.playbackRate === rate && styles.speedTextActive]}>
              {rate}x
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Read-Along Button (if HYBRID) */}
      {currentBook.ebookPath && (
        <TouchableOpacity style={styles.readAlongBtn} onPress={handleOpenReadAlong}>
          <BookIcon size={18} color={colors.black} />
          <Text style={styles.readAlongText}>Read-Along Mode</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.gray,
    textAlign: 'center',
  },
  coverContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  coverImage: {
    width: 250,
    height: 250,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.card,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  author: {
    ...typography.label,
    color: colors.gray,
  },
  progressContainer: {
    marginBottom: spacing.lg,
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.lime,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  timeText: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: colors.gray,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xl,
    marginBottom: spacing.lg,
  },
  skipBtn: {
    alignItems: 'center',
  },
  skipLabel: {
    fontSize: 10,
    color: colors.gray,
    marginTop: 2,
  },
  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.lime,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  speedBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  speedBtnActive: {
    backgroundColor: colors.lime,
    borderColor: colors.lime,
  },
  speedText: {
    ...typography.label,
    color: colors.gray,
  },
  speedTextActive: {
    color: colors.black,
  },
  readAlongBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.periwinkle,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  readAlongText: {
    ...typography.label,
    color: colors.black,
  },
});
