import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { colors } from './src/theme';
import { Book } from './src/types';

export default function App() {
  const [currentBook, setCurrentBook] = useState<Book | null>(null);

  const handleSelectBook = (book: Book) => {
    setCurrentBook(book);
    // TODO: Open player/reader
    console.log('Selected book:', book.title);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LibraryScreen onSelectBook={handleSelectBook} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
