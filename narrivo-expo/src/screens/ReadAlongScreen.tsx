import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { colors, spacing, borderRadius, typography } from '../theme';
import { Book } from '../types';
import { audioService, AudioState } from '../services/audioService';
import { epubService, Chapter, EpubContent } from '../services/epubService';
import { CloseIcon, PlayIcon, PauseIcon, SkipBackIcon, SkipForwardIcon } from '../components/Icons';
import { LibraryStackParamList } from '../navigation/RootNavigator';

type ReadAlongScreenRouteProp = RouteProp<LibraryStackParamList, 'ReadAlong'>;

export const ReadAlongScreen: React.FC = () => {
  const route = useRoute<ReadAlongScreenRouteProp>();
  const navigation = useNavigation();
  const { book } = route.params;

  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    isLoading: false,
    currentTime: 0,
    duration: 0,
    playbackRate: 1.0,
    error: null,
  });
  const [epubContent, setEpubContent] = useState<EpubContent | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [isLoadingContent, setIsLoadingContent] = useState(true);

  const scrollViewRef = useRef<ScrollView>(null);
  const [paragraphLayouts, setParagraphLayouts] = useState<{ y: number; height: number }[]>([]);

  // Load EPUB content
  useEffect(() => {
    const loadContent = async () => {
      setIsLoadingContent(true);
      const content = await epubService.extractContent(book);
      setEpubContent(content);
      setIsLoadingContent(false);
    };
    loadContent();
  }, [book]);

  // Subscribe to audio state
  useEffect(() => {
    audioService.subscribe('read-along', setAudioState);
    return () => audioService.unsubscribe('read-along');
  }, []);

  // Get current chapter
  const currentChapter: Chapter | null = epubContent?.chapters[currentChapterIndex] ?? null;
  const totalParagraphs = currentChapter?.paragraphs.length ?? 0;

  // Calculate current paragraph based on audio progress
  useEffect(() => {
    if (audioState.duration <= 0 || !currentChapter) return;

    const progress = audioState.currentTime / audioState.duration;
    const newParagraph = Math.min(
      Math.floor(progress * totalParagraphs),
      totalParagraphs - 1
    );

    if (newParagraph !== currentParagraph && newParagraph >= 0) {
      setCurrentParagraph(newParagraph);

      // Auto-scroll to current paragraph
      if (paragraphLayouts[newParagraph] && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          y: paragraphLayouts[newParagraph].y - 100,
          animated: true,
        });
      }
    }
  }, [audioState.currentTime, audioState.duration, currentParagraph, paragraphLayouts, currentChapter, totalParagraphs]);

  const handlePlayPause = async () => {
    if (audioState.isPlaying) {
      await audioService.pause();
    } else {
      await audioService.play();
    }
  };

  const handleParagraphTap = (index: number) => {
    if (audioState.duration <= 0) return;

    // Jump to approximate audio position
    const newTime = (index / totalParagraphs) * audioState.duration;
    audioService.seekTo(newTime);
    setCurrentParagraph(index);
  };

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
      setCurrentParagraph(0);
      setParagraphLayouts([]);
    }
  };

  const handleNextChapter = () => {
    if (epubContent && currentChapterIndex < epubContent.chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
      setCurrentParagraph(0);
      setParagraphLayouts([]);
    }
  };

  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progress = audioState.duration > 0 ? audioState.currentTime / audioState.duration : 0;

  if (isLoadingContent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.lime} />
          <Text style={styles.loadingText}>Loading content...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <CloseIcon size={20} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.titleArea}>
          <Text style={styles.title} numberOfLines={1}>{book.title}</Text>
          <Text style={styles.subtitle}>Read-Along Mode</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(audioState.currentTime)}</Text>
          <Text style={styles.timeText}>{formatTime(audioState.duration)}</Text>
        </View>
      </View>

      {/* Chapter navigation */}
      {epubContent && epubContent.chapters.length > 1 && (
        <View style={styles.chapterNav}>
          <TouchableOpacity
            style={[styles.chapterBtn, currentChapterIndex === 0 && styles.chapterBtnDisabled]}
            onPress={handlePrevChapter}
            disabled={currentChapterIndex === 0}
          >
            <SkipBackIcon size={14} color={currentChapterIndex === 0 ? colors.gray : colors.white} />
          </TouchableOpacity>
          <Text style={styles.chapterIndicator}>
            Chapter {currentChapterIndex + 1} of {epubContent.chapters.length}
          </Text>
          <TouchableOpacity
            style={[styles.chapterBtn, currentChapterIndex >= epubContent.chapters.length - 1 && styles.chapterBtnDisabled]}
            onPress={handleNextChapter}
            disabled={currentChapterIndex >= epubContent.chapters.length - 1}
          >
            <SkipForwardIcon size={14} color={currentChapterIndex >= epubContent.chapters.length - 1 ? colors.gray : colors.white} />
          </TouchableOpacity>
        </View>
      )}

      {/* Text content */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        contentContainerStyle={styles.contentInner}
      >
        <Text style={styles.chapterTitle}>{currentChapter?.title ?? 'Chapter'}</Text>

        {currentChapter?.paragraphs.map((para, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleParagraphTap(index)}
            onLayout={(event) => {
              const { y, height } = event.nativeEvent.layout;
              setParagraphLayouts((prev) => {
                const newLayouts = [...prev];
                newLayouts[index] = { y, height };
                return newLayouts;
              });
            }}
          >
            <Text
              style={[
                styles.paragraph,
                index === currentParagraph && styles.paragraphActive,
                index < currentParagraph && styles.paragraphPast,
              ]}
            >
              {para}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Play controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.skipBtn} onPress={() => audioService.skip(-10)}>
          <Text style={styles.skipText}>-10s</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playBtn}
          onPress={handlePlayPause}
          disabled={!book.audiobookPath}
        >
          {audioState.isPlaying ? (
            <PauseIcon size={28} color={colors.black} />
          ) : (
            <PlayIcon size={28} color={colors.black} />
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipBtn} onPress={() => audioService.skip(10)}>
          <Text style={styles.skipText}>+10s</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.gray,
    marginTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleArea: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    ...typography.small,
    color: colors.white,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  subtitle: {
    ...typography.label,
    color: colors.lime,
  },
  progressContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
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
    fontSize: 10,
    fontFamily: 'monospace',
    color: colors.gray,
  },
  chapterNav: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  chapterBtn: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chapterBtnDisabled: {
    opacity: 0.5,
  },
  chapterIndicator: {
    ...typography.label,
    color: colors.gray,
  },
  content: {
    flex: 1,
  },
  contentInner: {
    padding: spacing.lg,
    paddingBottom: 120,
  },
  chapterTitle: {
    ...typography.h2,
    color: colors.white,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 18,
    lineHeight: 28,
    color: colors.gray,
    marginBottom: spacing.md,
    fontFamily: 'Georgia',
  },
  paragraphActive: {
    color: colors.white,
    backgroundColor: `${colors.lime}20`,
    marginHorizontal: -spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.lime,
  },
  paragraphPast: {
    color: colors.gray,
    opacity: 0.6,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  skipBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  skipText: {
    ...typography.label,
    color: colors.periwinkle,
  },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.lime,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
