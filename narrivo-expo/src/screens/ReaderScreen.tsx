import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Reader, ReaderProvider, useReader } from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/expo-file-system';
import { colors, spacing, borderRadius, typography } from '../theme';
import { Book } from '../types';
import { CloseIcon, AudioIcon } from '../components/Icons';
import { LibraryStackParamList } from '../navigation/RootNavigator';
import { audioService } from '../services/audioService';

type ReaderScreenRouteProp = RouteProp<LibraryStackParamList, 'Reader'>;

export const ReaderScreen: React.FC = () => {
  const route = useRoute<ReaderScreenRouteProp>();
  const navigation = useNavigation();
  const { book } = route.params;

  return (
    <ReaderProvider>
      <ReaderContent book={book} onClose={() => navigation.goBack()} />
    </ReaderProvider>
  );
};

interface ReaderContentProps {
  book: Book;
  onClose: () => void;
}

const ReaderContent: React.FC<ReaderContentProps> = ({ book, onClose }) => {
  const { goNext, goPrevious, getCurrentLocation, getLocations } = useReader();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [fontSize, setFontSize] = useState(16);

  const hasAudio = !!book.audiobookPath;

  const handleLocationChange = (location: any) => {
    if (location?.start) {
      const current = location.start.displayed?.page || 1;
      const total = location.start.displayed?.total || 0;
      setCurrentPage(current);
      setTotalPages(total);
    }
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(24, prev + 2));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(12, prev - 2));
  };

  if (!book.ebookPath) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No ebook file available</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Back to Library</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      {showControls && (
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconBtn} onPress={onClose}>
            <CloseIcon size={20} color={colors.white} />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>{book.title}</Text>
            <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
          </View>

          {hasAudio && (
            <TouchableOpacity style={styles.audioBtn} onPress={() => audioService.play()}>
              <AudioIcon size={16} color={colors.black} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Reader */}
      <TouchableOpacity
        style={styles.readerContainer}
        activeOpacity={1}
        onPress={toggleControls}
      >
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.lime} />
            <Text style={styles.loadingText}>Loading book...</Text>
          </View>
        )}

        <Reader
          src={book.ebookPath}
          fileSystem={useFileSystem}
          onReady={() => setIsLoading(false)}
          onLocationChange={handleLocationChange}
          defaultTheme={{
            body: {
              background: colors.bg,
              color: colors.white,
              fontSize: `${fontSize}px`,
              lineHeight: '1.6',
              fontFamily: 'Georgia, serif',
            },
            a: {
              color: colors.lime,
            },
          }}
          enableSwipe={true}
          enableSelection={true}
        />
      </TouchableOpacity>

      {/* Bottom Bar */}
      {showControls && (
        <View style={styles.bottomBar}>
          {/* Navigation */}
          <View style={styles.navRow}>
            <TouchableOpacity style={styles.navBtn} onPress={() => goPrevious()}>
              <Text style={styles.navBtnText}>Prev</Text>
            </TouchableOpacity>

            <View style={styles.pageInfo}>
              <Text style={styles.pageText}>
                {currentPage} / {totalPages || '...'}
              </Text>
            </View>

            <TouchableOpacity style={styles.navBtn} onPress={() => goNext()}>
              <Text style={styles.navBtnText}>Next</Text>
            </TouchableOpacity>
          </View>

          {/* Font controls */}
          <View style={styles.fontRow}>
            <TouchableOpacity style={styles.fontBtn} onPress={decreaseFontSize}>
              <Text style={styles.fontBtnText}>A-</Text>
            </TouchableOpacity>
            <Text style={styles.fontSizeText}>{fontSize}px</Text>
            <TouchableOpacity style={styles.fontBtn} onPress={increaseFontSize}>
              <Text style={styles.fontBtnText}>A+</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    ...typography.h2,
    color: colors.gray,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: colors.lime,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  closeButtonText: {
    ...typography.label,
    color: colors.black,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: spacing.sm,
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
  audioBtn: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.lime,
    justifyContent: 'center',
    alignItems: 'center',
  },
  readerContainer: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    ...typography.body,
    color: colors.gray,
    marginTop: spacing.md,
  },
  bottomBar: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  navBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.border,
    borderRadius: borderRadius.sm,
  },
  navBtnText: {
    ...typography.label,
    color: colors.white,
  },
  pageInfo: {
    alignItems: 'center',
  },
  pageText: {
    ...typography.small,
    color: colors.gray,
    fontFamily: 'monospace',
  },
  fontRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  fontBtn: {
    width: 40,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontBtnText: {
    ...typography.label,
    color: colors.white,
  },
  fontSizeText: {
    ...typography.small,
    color: colors.gray,
    minWidth: 40,
    textAlign: 'center',
  },
});
