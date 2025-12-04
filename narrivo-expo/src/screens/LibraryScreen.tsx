import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useBooksStore } from '../store/booksStore';
import { colors, spacing, borderRadius, typography } from '../theme';
import { Book } from '../types';
import { AudioIcon, BookIcon, HybridIcon, DownloadIcon, CloseIcon, PlusIcon, GridIcon } from '../components/Icons';

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

interface LibraryScreenProps {
  onSelectBook: (book: Book) => void;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({ onSelectBook }) => {
  const { books, addBook, updateBook, deleteBook, loadBooks, isLoading } = useBooksStore();
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    if (!isLoading && !initialized) {
      // Add public catalog
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

  const handleDownload = (bookId: string) => {
    // Simulate download
    updateBook(bookId, { isDownloaded: true });
  };

  const handleDelete = (bookId: string) => {
    deleteBook(bookId);
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
        <TouchableOpacity style={styles.addBtn}>
          <PlusIcon size={20} color={colors.black} />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        <FilterButton
          active={filter === 'ALL'}
          onPress={() => setFilter('ALL')}
          icon={<GridIcon size={14} color={filter === 'ALL' ? colors.black : colors.gray} />}
        />
        <FilterButton
          active={filter === 'AUDIO'}
          onPress={() => setFilter('AUDIO')}
          icon={<AudioIcon size={14} color={filter === 'AUDIO' ? colors.black : colors.gray} />}
        />
        <FilterButton
          active={filter === 'EBOOK'}
          onPress={() => setFilter('EBOOK')}
          icon={<BookIcon size={14} color={filter === 'EBOOK' ? colors.black : colors.gray} />}
        />
      </View>

      {/* Empty state */}
      {importedBooks.length === 0 && downloadedBooks.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Your shelf is empty</Text>
          <Text style={styles.emptyText}>Import files or download from the archive below.</Text>
          <TouchableOpacity style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Import Files</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Imported Books */}
      {importedBooks.length > 0 && (
        <Section title="Imports" color={colors.white}>
          <BookGrid
            books={importedBooks}
            onSelect={onSelectBook}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />
        </Section>
      )}

      {/* Downloaded Books */}
      {downloadedBooks.length > 0 && (
        <Section title="Downloaded" color={colors.lime}>
          <BookGrid
            books={downloadedBooks}
            onSelect={onSelectBook}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />
        </Section>
      )}

      {/* Archive */}
      {availableBooks.length > 0 && (
        <Section title="Archive" color={colors.periwinkle}>
          <BookGrid
            books={availableBooks}
            onSelect={onSelectBook}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />
        </Section>
      )}
    </ScrollView>
  );
};

// Filter button
const FilterButton: React.FC<{ active: boolean; onPress: () => void; icon: React.ReactNode }> = ({
  active,
  onPress,
  icon
}) => (
  <TouchableOpacity
    style={[styles.filterBtn, active && styles.filterBtnActive]}
    onPress={onPress}
  >
    {icon}
  </TouchableOpacity>
);

// Section component
const Section: React.FC<{ title: string; color: string; children: React.ReactNode }> = ({
  title,
  color,
  children
}) => (
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
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ books, onSelect, onDownload, onDelete }) => (
  <View style={styles.grid}>
    {books.map((book) => (
      <BookCard
        key={book.id}
        book={book}
        onPress={() => book.isDownloaded && onSelect(book)}
        onDownload={() => onDownload(book.id)}
        onDelete={() => onDelete(book.id)}
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
}> = ({ book, onPress, onDownload, onDelete }) => {
  const TypeIcon = book.type === 'AUDIO' ? AudioIcon : book.type === 'EBOOK' ? BookIcon : HybridIcon;
  const badgeColor = book.type === 'AUDIO' ? colors.lime : book.type === 'EBOOK' ? colors.periwinkle : colors.white;

  return (
    <TouchableOpacity
      style={[styles.card, !book.isDownloaded && styles.cardFaded]}
      onPress={onPress}
      activeOpacity={book.isDownloaded ? 0.7 : 1}
    >
      <View style={styles.cardCover}>
        <Image source={{ uri: book.coverUrl }} style={styles.cardImage} />

        {/* Badge */}
        <View style={[styles.badge, { backgroundColor: badgeColor }]}>
          <TypeIcon size={10} color={book.type === 'HYBRID' ? colors.black : colors.black} />
        </View>

        {/* Actions */}
        {book.isDownloaded ? (
          <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
            <CloseIcon size={12} color={colors.white} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.downloadBtn} onPress={onDownload}>
            <DownloadIcon size={14} color={colors.black} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.cardTitle} numberOfLines={1}>{book.title}</Text>
      <Text style={styles.cardAuthor} numberOfLines={1}>{book.author}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.white,
  },
  accent: {
    color: colors.lime,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filters: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
  },
  filterBtnActive: {
    backgroundColor: colors.lime,
    borderColor: colors.lime,
  },
  empty: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  emptyText: {
    ...typography.body,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  primaryBtn: {
    backgroundColor: colors.lime,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  primaryBtnText: {
    ...typography.label,
    color: colors.black,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.white,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  card: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
  },
  cardFaded: {
    opacity: 0.7,
  },
  cardCover: {
    aspectRatio: 3 / 4,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: spacing.xs,
    backgroundColor: colors.bg,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  downloadBtn: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.lime,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    ...typography.small,
    color: colors.white,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardAuthor: {
    ...typography.label,
    color: colors.gray,
  },
});
