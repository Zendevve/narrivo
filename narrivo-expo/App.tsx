import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { ReaderScreen } from './src/screens/ReaderScreen';
import { BottomPlayer } from './src/components/BottomPlayer';
import { colors } from './src/theme';
import { Book, ViewMode } from './src/types';
import { audioService } from './src/services/audioService';

export default function App() {
  const [activeView, setActiveView] = useState<ViewMode>(ViewMode.LIBRARY);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);

  const handleSelectBook = async (book: Book) => {
    setCurrentBook(book);

    // If it has audio, load it
    if (book.audiobookPath) {
      await audioService.loadTrack(book);
    }

    // If it only has ebook, open reader directly
    if (book.ebookPath && !book.audiobookPath) {
      setActiveView(ViewMode.READER);
    }
  };

  const handleOpenReader = () => {
    if (currentBook?.ebookPath) {
      setActiveView(ViewMode.READER);
    }
  };

  const handleCloseReader = () => {
    setActiveView(ViewMode.LIBRARY);
  };

  const handlePlayAudioFromReader = () => {
    if (currentBook?.audiobookPath) {
      audioService.play();
    }
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />

        {activeView === ViewMode.READER && currentBook?.ebookPath ? (
          <ReaderScreen
            book={currentBook}
            onClose={handleCloseReader}
            onPlayAudio={currentBook.audiobookPath ? handlePlayAudioFromReader : undefined}
          />
        ) : (
          <>
            <View style={styles.content}>
              <LibraryScreen onSelectBook={handleSelectBook} />
            </View>
            <BottomPlayer
              currentBook={currentBook}
              onOpenReader={currentBook?.ebookPath ? handleOpenReader : undefined}
            />
          </>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    marginBottom: 70, // Space for BottomPlayer
  },
});
