import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useBooksStore } from '../store/booksStore';
import { colors, spacing, borderRadius, typography } from '../theme';
import { Book } from '../types';
import { AudioIcon, BookIcon, HybridIcon, DownloadIcon, CloseIcon, PlusIcon, GridIcon } from '../components/Icons';
import { pickFiles, processImportedFile } from '../services/fileService';
import { downloadService, DownloadProgress } from '../services/downloadService';
import { audioService } from '../services/audioService';
import { LibraryStackParamList } from '../navigation/RootNavigator';

// Public domain sample catalog
const PUBLIC_CATALOG: Book[] = [
  {
    id: 'public-0',
    title: 'Pride & Prejudice',
    author: 'Jane Austen',
    coverUrl: 'https://www.gutenberg.org/cache/epub/1342/pg1342.cover.medium.jpg',
    type: 'HYBRID',
    source: 'PUBLIC',
    isDownloaded: false,
    audiobookPath: 'https://archive.org/download/pride_and_prejudice_by_jane_austen/pride_and_prejudice_by_jane_austen_librivox.m4b',
    ebookPath: 'https://www.gutenberg.org/ebooks/1342.epub.images',
  },
  {
    id: 'public-1',
    title: 'Frankenstein',
    author: 'Mary Shelley',
    coverUrl: 'https://www.gutenberg.org/cache/epub/84/pg84.cover.medium.jpg',
    type: 'HYBRID',
    source: 'PUBLIC',
    isDownloaded: false,
    audiobookPath: 'https://archive.org/download/frankenstein_1818_librivox/frankenstein_1818_librivox_64kb_mp3.zip',
    ebookPath: 'https://www.gutenberg.org/ebooks/84.epub.images',
  },
  {
    id: 'public-2',
    title: 'Alice in Wonderland',
    author: 'Lewis Carroll',
    coverUrl: 'https://www.gutenberg.org/cache/epub/11/pg11.cover.medium.jpg',
    type: 'HYBRID',
    source: 'PUBLIC',
    isDownloaded: false,
    audiobookPath: 'https://archive.org/download/alices_adventures_in_wonderland_librivox/alices_adventures_in_wonderland_librivox_64kb_mp3.zip',
    ebookPath: 'https://www.gutenberg.org/ebooks/11.epub.images',
  },
];

type FilterType = 'ALL' | 'AUDIO' | 'EBOOK';
type LibraryScreenNavigationProp = StackNavigationProp<LibraryStackParamList, 'LibraryHome'>;

export const LibraryScreen: React.FC = () => {
  const navigation = useNavigation<LibraryScreenNavigationProp>();
  const { books, addBook, updateBook, deleteBook, loadBooks, isLoading } = useBooksStore();
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [initialized, setInitialized] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    if (!isLoading && !initialized) {
      PUBLIC_CATALOG.forEach((book) => {
        if (!books.find((b) => b.id === book.id)) {
          addBook(book);
        }
      });
      setInitialized(true);
    }
  }, [isLoading, initialized, books, addBook]);

  const filterBooks = (b: Book) => {
    if (filter === 'ALL') return true;
    if (filter === 'AUDIO') return b.type === 'AUDIO' || b.type === 'HYBRID';
    if (filter === 'EBOOK') return b.type === 'EBOOK' || b.type === 'HYBRID';
    return true;
  };

  const importedBooks = books.filter((b) => b.source === 'USER' && filterBooks(b));
  const downloadedBooks = books.filter((b) => b.source === 'PUBLIC' && b.isDownloaded && filterBooks(b));
  const availableBooks = books.filter((b) => b.source === 'PUBLIC' && !b.isDownloaded && filterBooks(b));

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const files = await pickFiles();
      if (files.length === 0) {
        setIsImporting(false);
        return;
      }
      let imported = 0;
      for (const file of files) {
        const result = processImportedFile(file, books);
        if (result) {
          if (result.isNew) {
            addBook(result.book);
          } else {
            updateBook(result.book.id, result.book);
          }
          imported++;
        }
      }
      if (imported > 0) {
        Alert.alert('Import Complete', `Added ${imported} file(s) to your library.`);
      }
    } catch (e) {
      console.error('Import error:', e);
      Alert.alert('Import Failed', 'Could not import files.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleDownload = async (book: Book) => {
    // Set up progress tracking
    const progressCallback = (progress: DownloadProgress) => {
      setDownloadProgress((prev) => {
        const next = new Map(prev);
        if (progress.status === 'downloading') {
          next.set(book.id, progress.progress);
        } else {
          next.delete(book.id);
        }
        return next;
      });

      if (progress.status === 'completed') {
        downloadService.unsubscribe(`${book.id}-audio`, progressCallback);
        downloadService.unsubscribe(`${book.id}-ebook`, progressCallback);
      }
    };

    downloadService.subscribe(`${book.id}-audio`, progressCallback);
    downloadService.subscribe(`${book.id}-ebook`, progressCallback);

    try {
      const updates = await downloadService.downloadPublicDomainBook(book);
      updateBook(book.id, updates);
    } catch (e) {
      console.error('Download error:', e);
      Alert.alert('Download Failed', 'Could not download the book.');
    }
  };

  const handleDelete = (bookId: string) => {
    Alert.alert('Delete Book', 'Remove this book from your library?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteBook(bookId) },
    ]);
  };

  const handleSelectBook = async (book: Book) => {
    if (!book.isDownloaded) return;

    // Load audio if available
    if (book.audiobookPath) {
      await audioService.loadTrack(book);
    }

    // Navigate based on book type
    if (book.type === 'HYBRID') {
      // HYBRID books go to Read-Along
      navigation.navigate('ReadAlong', { book });
    } else if (book.type === 'EBOOK') {
      // Pure ebooks go to Reader
      navigation.navigate('Reader', { book });
    }
    // Pure audio books will play via the Player tab (no navigation needed here)
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.lime} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Library<Text style={styles.accent}>.</Text>
        </Text>
        <TouchableOpacity
          style={[styles.addBtn, isImporting && { opacity: 0.5 }]}
          onPress={handleImport}
          disabled={isImporting}
        >
          {isImporting ? (
            <ActivityIndicator size="small" color={colors.black} />
          ) : (
            <PlusIcon size={20} color={colors.black} />
          )}
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        <FilterButton active={filter === 'ALL'} onPress={() => setFilter('ALL')} icon={<GridIcon size={14} color={filter === 'ALL' ? colors.black : colors.gray} />} />
        <FilterButton active={filter === 'AUDIO'} onPress={() => setFilter('AUDIO')} icon={<AudioIcon size={14} color={filter === 'AUDIO' ? colors.black : colors.gray} />} />
        <FilterButton active={filter === 'EBOOK'} onPress={() => setFilter('EBOOK')} icon={<BookIcon size={14} color={filter === 'EBOOK' ? colors.black : colors.gray} />} />
      </View>

      {/* Empty state */}
      {importedBooks.length === 0 && downloadedBooks.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Your shelf is empty</Text>
          <Text style={styles.emptyText}>Import files or download from the archive below.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleImport} disabled={isImporting}>
            <Text style={styles.primaryBtnText}>{isImporting ? 'Importing...' : 'Import Files'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Imported Books */}
      {importedBooks.length > 0 && (
        <Section title="Imports" color={colors.white}>
          <BookGrid books={importedBooks} onSelect={handleSelectBook} onDownload={(b) => handleDownload(b)} onDelete={handleDelete} downloadProgress={downloadProgress} />
        </Section>
      )}

      {/* Downloaded Books */}
      {downloadedBooks.length > 0 && (
        <Section title="Downloaded" color={colors.lime}>
          <BookGrid books={downloadedBooks} onSelect={handleSelectBook} onDownload={(b) => handleDownload(b)} onDelete={handleDelete} downloadProgress={downloadProgress} />
        </Section>
      )}

      {/* Archive */}
      {availableBooks.length > 0 && (
        <Section title="Archive" color={colors.periwinkle}>
          <BookGrid books={availableBooks} onSelect={handleSelectBook} onDownload={(b) => handleDownload(b)} onDelete={handleDelete} downloadProgress={downloadProgress} />
        </Section>
      )}
    </ScrollView>
  );
};

// Filter button
const FilterButton: React.FC<{ active: boolean; onPress: () => void; icon: React.ReactNode }> = ({ active, onPress, icon }) => (
  <TouchableOpacity style={[styles.filterBtn, active && styles.filterBtnActive]} onPress={onPress}>
    {icon}
  </TouchableOpacity>
);

// Section component
const Section: React.FC<{ title: string; color: string; children: React.ReactNode }> = ({ title, color, children }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <View style={[styles.sectionDot, { backgroundColor: color }]} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

// Book grid
const BookGrid: React.FC<{
  books: Book[];
  onSelect: (book: Book) => void;
  onDownload: (book: Book) => void;
  onDelete: (id: string) => void;
  downloadProgress: Map<string, number>;
}> = ({ books, onSelect, onDownload, onDelete, downloadProgress }) => (
  <View style={styles.grid}>
    {books.map((book) => (
      <BookCard
        key={book.id}
        book={book}
        onPress={() => book.isDownloaded && onSelect(book)}
        onDownload={() => onDownload(book)}
        onDelete={() => onDelete(book.id)}
        progress={downloadProgress.get(book.id)}
      />
    ))}
  </View>
);

// Book card
const BookCard: React.FC<{
  book: Book;
  onPress: () => void;
  onDownload: () => void;
  onDelete: () => void;
  progress?: number;
}> = ({ book, onPress, onDownload, onDelete, progress }) => {
  const TypeIcon = book.type === 'AUDIO' ? AudioIcon : book.type === 'EBOOK' ? BookIcon : HybridIcon;
  const badgeColor = book.type === 'AUDIO' ? colors.lime : book.type === 'EBOOK' ? colors.periwinkle : colors.white;
  const isDownloading = progress !== undefined && progress < 1;

  return (
    <TouchableOpacity style={[styles.card, !book.isDownloaded && styles.cardFaded]} onPress={onPress} activeOpacity={book.isDownloaded ? 0.7 : 1}>
      <View style={styles.cardCover}>
        <Image source={{ uri: book.coverUrl }} style={styles.cardImage} />

        {/* Progress overlay */}
        {isDownloading && (
          <View style={styles.progressOverlay}>
            <View style={[styles.progressBar, { height: `${progress * 100}%` }]} />
            <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
          </View>
        )}

        <View style={[styles.badge, { backgroundColor: badgeColor }]}>
          <TypeIcon size={10} color={colors.black} />
        </View>

        {book.isDownloaded ? (
          <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
            <CloseIcon size={12} color={colors.white} />
          </TouchableOpacity>
        ) : !isDownloading ? (
          <TouchableOpacity style={styles.downloadBtn} onPress={onDownload}>
            <DownloadIcon size={14} color={colors.black} />
          </TouchableOpacity>
        ) : null}
      </View>
      <Text style={styles.cardTitle} numberOfLines={1}>{book.title}</Text>
      <Text style={styles.cardAuthor} numberOfLines={1}>{book.author}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.md, paddingBottom: 100 },
  loadingContainer: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  title: { ...typography.h1, color: colors.white },
  accent: { color: colors.lime },
  addBtn: { width: 40, height: 40, borderRadius: borderRadius.md, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center' },
  filters: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.lg },
  filterBtn: { flex: 1, paddingVertical: spacing.sm, borderRadius: borderRadius.md, borderWidth: 2, borderColor: colors.border, alignItems: 'center' },
  filterBtnActive: { backgroundColor: colors.lime, borderColor: colors.lime },
  empty: { backgroundColor: colors.card, borderRadius: borderRadius.xl, padding: spacing.xl, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  emptyTitle: { ...typography.h2, color: colors.white, marginBottom: spacing.xs },
  emptyText: { ...typography.body, color: colors.gray, textAlign: 'center', marginBottom: spacing.lg },
  primaryBtn: { backgroundColor: colors.lime, paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderRadius: borderRadius.md },
  primaryBtnText: { ...typography.label, color: colors.black },
  section: { marginBottom: spacing.lg },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  sectionDot: { width: 8, height: 8, borderRadius: 4 },
  sectionTitle: { ...typography.label, color: colors.white },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  card: { width: '48%', backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.sm },
  cardFaded: { opacity: 0.7 },
  cardCover: { aspectRatio: 3 / 4, borderRadius: borderRadius.md, overflow: 'hidden', marginBottom: spacing.xs, backgroundColor: colors.bg },
  cardImage: { width: '100%', height: '100%' },
  badge: { position: 'absolute', top: 6, left: 6, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4 },
  downloadBtn: { position: 'absolute', bottom: 6, right: 6, width: 32, height: 32, borderRadius: 16, backgroundColor: colors.lime, justifyContent: 'center', alignItems: 'center' },
  deleteBtn: { position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  cardTitle: { ...typography.small, color: colors.white, fontWeight: '700', textTransform: 'uppercase' },
  cardAuthor: { ...typography.label, color: colors.gray },
  progressOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.lime,
    opacity: 0.3,
  },
  progressText: {
    color: colors.lime,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
});
