import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { BottomPlayer } from './src/components/BottomPlayer';
import { colors } from './src/theme';
import { Book } from './src/types';
import { audioService } from './src/services/audioService';

export default function App() {
  const [currentBook, setCurrentBook] = useState<Book | null>(null);

  const handleSelectBook = async (book: Book) => {
    setCurrentBook(book);

    // If it has audio, load it
    if (book.audiobookPath) {
      await audioService.loadTrack(book);
    }
  };

  const handleOpenReader = () => {
    // TODO: Navigate to reader screen
    console.log('Open reader for:', currentBook?.title);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <LibraryScreen onSelectBook={handleSelectBook} />
      </View>
      <BottomPlayer
        currentBook={currentBook}
        onOpenReader={handleOpenReader}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    marginBottom: 70, // Space for BottomPlayer
  },
});
