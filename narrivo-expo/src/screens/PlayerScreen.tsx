import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Modal,
  Alert,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';
import { audioService, AudioState } from '../services/audioService';
import { PlayIcon, PauseIcon, SkipBackIcon, SkipForwardIcon, BookIcon, CloseIcon } from '../components/Icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PlayerStackParamList } from '../navigation/RootNavigator';
import { useBooksStore } from '../store/booksStore';
import { Bookmark } from '../types';

type PlayerScreenNavigationProp = StackNavigationProp<PlayerStackParamList, 'NowPlaying'>;

const SLEEP_OPTIONS = [
  { label: '5 min', value: 5 },
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '1 hour', value: 60 },
  { label: 'End of chapter', value: -1 },
];

export const PlayerScreen: React.FC = () => {
  const navigation = useNavigation<PlayerScreenNavigationProp>();
  const { addBookmark, updateLastPosition } = useBooksStore();

  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    isLoading: false,
    currentTime: 0,
    duration: 0,
    playbackRate: 1.0,
    error: null,
  });
  const [sleepModalVisible, setSleepModalVisible] = useState(false);
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);
  const [sleepRemaining, setSleepRemaining] = useState<number | null>(null);

  const currentBook = audioService.getCurrentBook();

  useEffect(() => {
    audioService.subscribe('player-screen', setAudioState);
    return () => audioService.unsubscribe('player-screen');
  }, []);

  // Sleep timer countdown
  useEffect(() => {
    if (sleepRemaining === null) return;

    if (sleepRemaining <= 0) {
      // Time's up - pause playback
      audioService.pause();
      setSleepTimer(null);
      setSleepRemaining(null);
      Alert.alert('Sleep Timer', 'Playback paused. Sweet dreams! 🌙');
      return;
    }

    const interval = setInterval(() => {
      if (audioState.isPlaying) {
        setSleepRemaining(prev => prev !== null ? prev - 1 : null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepRemaining, audioState.isPlaying]);

  // Save position periodically
  useEffect(() => {
    if (currentBook && audioState.currentTime > 0) {
      updateLastPosition(currentBook.id, audioState.currentTime);
    }
  }, [Math.floor(audioState.currentTime / 30)]); // Save every 30 seconds

  const handlePlayPause = async () => {
    if (audioState.isPlaying) {
      await audioService.pause();
    } else {
      await audioService.play();
    }
  };

  const handleSleepTimer = (minutes: number) => {
    if (minutes === -1) {
      // End of chapter - not implemented yet, use 30 min as fallback
      setSleepTimer(30);
      setSleepRemaining(30 * 60);
    } else {
      setSleepTimer(minutes);
      setSleepRemaining(minutes * 60);
    }
    setSleepModalVisible(false);
  };

  const cancelSleepTimer = () => {
    setSleepTimer(null);
    setSleepRemaining(null);
  };

  const handleAddBookmark = async () => {
    if (!currentBook) return;

    const position = await audioService.getPosition();
    const bookmark: Bookmark = {
      id: `bm-${Date.now()}`,
      position,
      label: `Bookmark at ${formatTime(position)}`,
      createdAt: new Date().toISOString(),
    };

    addBookmark(currentBook.id, bookmark);
    Alert.alert('Bookmark Added', `Saved at ${formatTime(position)}`);
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

  const formatSleepRemaining = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
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

      {/* Action Buttons Row */}
      <View style={styles.actionsRow}>
        {/* Sleep Timer */}
        <TouchableOpacity
          style={[styles.actionBtn, sleepTimer && styles.actionBtnActive]}
          onPress={() => sleepTimer ? cancelSleepTimer() : setSleepModalVisible(true)}
        >
          <Text style={styles.actionIcon}>🌙</Text>
          <Text style={[styles.actionText, sleepTimer && styles.actionTextActive]}>
            {sleepRemaining ? formatSleepRemaining(sleepRemaining) : 'Sleep'}
          </Text>
        </TouchableOpacity>

        {/* Bookmark */}
        <TouchableOpacity style={styles.actionBtn} onPress={handleAddBookmark}>
          <Text style={styles.actionIcon}>🔖</Text>
          <Text style={styles.actionText}>Bookmark</Text>
        </TouchableOpacity>

        {/* Read-Along (if HYBRID) */}
        {currentBook.ebookPath && (
          <TouchableOpacity style={styles.actionBtn} onPress={handleOpenReadAlong}>
            <BookIcon size={18} color={colors.periwinkle} />
            <Text style={styles.actionText}>Read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Sleep Timer Modal */}
      <Modal
        visible={sleepModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSleepModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sleep Timer</Text>
              <TouchableOpacity onPress={() => setSleepModalVisible(false)}>
                <CloseIcon size={20} color={colors.white} />
              </TouchableOpacity>
            </View>
            {SLEEP_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.sleepOption}
                onPress={() => handleSleepTimer(option.value)}
              >
                <Text style={styles.sleepOptionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
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
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  coverImage: {
    width: 200,
    height: 200,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.card,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  author: {
    ...typography.label,
    color: colors.gray,
  },
  progressContainer: {
    marginBottom: spacing.md,
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
    marginBottom: spacing.md,
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
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
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
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  actionBtn: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  actionBtnActive: {
    backgroundColor: `${colors.lime}20`,
    borderRadius: borderRadius.md,
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  actionText: {
    ...typography.label,
    color: colors.gray,
  },
  actionTextActive: {
    color: colors.lime,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '80%',
    maxWidth: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.white,
  },
  sleepOption: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sleepOptionText: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
  },
});
