import React, { useState, useEffect } from 'react';
import { useBooksStore } from '../store/booksStore';
import { Book } from '../types';
import { colors, spacing, borderRadius } from '../theme/neoBrutalism';
import { pickFilesWeb, processImportedFile } from '../services/fileService';
import { getPublicDomainCatalog, downloadPublicDomainBook } from '../services/downloadService';
import { audioService } from '../services/audioService';

type FilterType = 'ALL' | 'AUDIO' | 'EBOOK';

interface LibraryScreenProps {
  onSelectBook: (book: Book) => void;
  onOpenReader: (book: Book) => void;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({ onSelectBook, onOpenReader }) => {
  const { books, addBook, updateBook, deleteBook, mergeBookFiles } = useBooksStore();
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());
  const [isImporting, setIsImporting] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Initialize public domain catalog on mount (once only)
  useEffect(() => {
    if (initialized) return;

    const catalog = getPublicDomainCatalog();
    const currentBooks = useBooksStore.getState().books;

    catalog.forEach((book) => {
      if (!currentBooks.find((b) => b.id === book.id)) {
        addBook(book);
      }
    });

    setInitialized(true);
  }, [initialized, addBook]);

  const filterBooks = (b: Book) => {
    if (filter === 'ALL') return true;
    if (filter === 'AUDIO') return b.type === 'AUDIO' || b.type === 'HYBRID';
    if (filter === 'EBOOK') return b.type === 'EBOOK' || b.type === 'HYBRID';
    return true;
  };

  const importedBooks = books.filter((b) => b.source === 'USER' && filterBooks(b));
  const localPublicBooks = books.filter((b) => b.source === 'PUBLIC' && b.isDownloaded && filterBooks(b));
  const availablePublicBooks = books.filter((b) => b.source === 'PUBLIC' && !b.isDownloaded && filterBooks(b));
  const hasAnyLocal = importedBooks.length > 0 || localPublicBooks.length > 0;

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const files = await pickFilesWeb();
      files.forEach((file) => {
        const result = processImportedFile(file, books);
        if (result.isNewBook) {
          addBook(result.book);
        } else if (result.book) {
          const isAudio = file.name.match(/\.(mp3|m4b|m4a|aac|flac|wav|ogg)$/i);
          if (isAudio) {
            mergeBookFiles(result.book.id, file.uri, undefined);
          } else {
            mergeBookFiles(result.book.id, undefined, file.uri);
          }
        }
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleDownload = async (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;

    setDownloadingIds((prev) => new Set(prev).add(bookId));
    try {
      await downloadPublicDomainBook(book);
      updateBook(bookId, { isDownloaded: true });
    } finally {
      setDownloadingIds((prev) => {
        const next = new Set(prev);
        next.delete(bookId);
        return next;
      });
    }
  };

  const handleDelete = (bookId: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      deleteBook(bookId);
    }
  };

  const handleSelectBook = (book: Book) => {
    if (!book.isDownloaded) return;
    if (book.type === 'EBOOK') {
      onOpenReader(book);
    } else {
      onSelectBook(book);
      audioService.loadTrack(book);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          Library<span style={styles.titleAccent}>.</span>
        </h1>
        <div style={styles.headerActions}>
          <button style={styles.importButton} onClick={handleImport} disabled={isImporting}>
            {isImporting ? '...' : '+ Import'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        {(['ALL', 'AUDIO', 'EBOOK'] as FilterType[]).map((type) => (
          <button
            key={type}
            style={{
              ...styles.filterButton,
              ...(filter === type ? styles.filterButtonActive : {}),
            }}
            onClick={() => setFilter(type)}
          >
            {type === 'ALL' ? 'All Items' : type === 'AUDIO' ? 'Audio' : 'Reads'}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {!hasAnyLocal && (
        <div style={styles.emptyState}>
          <h2 style={styles.emptyTitle}>Your shelf is empty</h2>
          <p style={styles.emptyText}>
            Import your own audiobooks and ebooks, or download from our public domain archive.
          </p>
          <button style={styles.primaryButton} onClick={handleImport}>
            Import Files
          </button>
        </div>
      )}

      {/* Imported Books */}
      {importedBooks.length > 0 && (
        <Section title="Your Imports" accentColor={colors.white}>
          <BookGrid
            books={importedBooks}
            downloadingIds={downloadingIds}
            onSelect={handleSelectBook}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />
        </Section>
      )}

      {/* Local Public Books */}
      {localPublicBooks.length > 0 && (
        <Section title="Local Storage" accentColor={colors.lime}>
          <BookGrid
            books={localPublicBooks}
            downloadingIds={downloadingIds}
            onSelect={handleSelectBook}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />
        </Section>
      )}

      {/* Available Public Books */}
      {availablePublicBooks.length > 0 && (
        <Section title="Public Archive" accentColor={colors.periwinkle}>
          <BookGrid
            books={availablePublicBooks}
            downloadingIds={downloadingIds}
            onSelect={handleSelectBook}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />
        </Section>
      )}
    </div>
  );
};

// Sub-components
const Section: React.FC<{ title: string; accentColor: string; children: React.ReactNode }> = ({
  title,
  accentColor,
  children,
}) => (
  <div style={styles.section}>
    <div style={styles.sectionHeader}>
      <div style={{ ...styles.sectionAccent, backgroundColor: accentColor }} />
      <h2 style={styles.sectionTitle}>{title}</h2>
    </div>
    {children}
  </div>
);

interface BookGridProps {
  books: Book[];
  downloadingIds: Set<string>;
  onSelect: (book: Book) => void;
  onDownload: (bookId: string) => void;
  onDelete: (bookId: string) => void;
}

const BookGrid: React.FC<BookGridProps> = ({ books, downloadingIds, onSelect, onDownload, onDelete }) => (
  <div style={styles.grid}>
    {books.map((book) => (
      <BookCard
        key={book.id}
        book={book}
        isDownloading={downloadingIds.has(book.id)}
        onSelect={() => onSelect(book)}
        onDownload={() => onDownload(book.id)}
        onDelete={() => onDelete(book.id)}
      />
    ))}
  </div>
);

interface BookCardProps {
  book: Book;
  isDownloading: boolean;
  onSelect: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, isDownloading, onSelect, onDownload, onDelete }) => {
  const isLocal = book.isDownloaded;

  const getTypeBadge = () => {
    switch (book.type) {
      case 'AUDIO':
        return <span style={{ ...styles.badge, backgroundColor: colors.lime }}>🎵</span>;
      case 'EBOOK':
        return <span style={{ ...styles.badge, backgroundColor: colors.periwinkle }}>📖</span>;
      case 'HYBRID':
        return <span style={{ ...styles.badge, backgroundColor: colors.white, color: colors.black }}>🎵📖</span>;
    }
  };

  return (
    <div
      style={{
        ...styles.card,
        opacity: isLocal ? 1 : 0.8,
        cursor: isLocal ? 'pointer' : 'default',
      }}
      onClick={isLocal ? onSelect : undefined}
    >
      <div style={styles.cardCover}>
        <img src={book.coverUrl} alt={book.title} style={styles.coverImage} />
        <div style={styles.typeBadge}>{getTypeBadge()}</div>
        {isLocal && (
          <button style={styles.deleteButton} onClick={(e) => { e.stopPropagation(); onDelete(); }}>
            🗑
          </button>
        )}
        {!isLocal && (
          <button
            style={styles.downloadButton}
            onClick={(e) => { e.stopPropagation(); onDownload(); }}
            disabled={isDownloading}
          >
            {isDownloading ? '...' : '↓ Get'}
          </button>
        )}
      </div>
      <h3 style={styles.cardTitle}>{book.title}</h3>
      <p style={styles.cardAuthor}>{book.author}</p>
      {book.source === 'USER' && <span style={styles.sourceTag}>Imported</span>}
      {book.source === 'PUBLIC' && isLocal && <span style={{ ...styles.sourceTag, color: colors.lime }}>✓ Ready</span>}
    </div>
  );
};

// Styles - using inline values to avoid typography spread issues
const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: spacing.lg,
    overflowY: 'auto',
    paddingBottom: 160,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 48,
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: -2,
    color: colors.white,
    margin: 0,
  },
  titleAccent: {
    color: colors.lime,
  },
  headerActions: {
    display: 'flex',
    gap: spacing.sm,
  },
  importButton: {
    backgroundColor: colors.white,
    color: colors.black,
    border: 'none',
    padding: `${spacing.sm}px ${spacing.md}px`,
    borderRadius: borderRadius.md,
    fontWeight: 700,
    textTransform: 'uppercase',
    fontSize: 12,
    cursor: 'pointer',
  },
  filters: {
    display: 'flex',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  filterButton: {
    backgroundColor: 'transparent',
    color: colors.gray,
    border: `2px solid ${colors.border}`,
    padding: `${spacing.sm}px ${spacing.md}px`,
    borderRadius: borderRadius.md,
    fontWeight: 700,
    textTransform: 'uppercase',
    fontSize: 11,
    letterSpacing: 2,
    cursor: 'pointer',
  },
  filterButtonActive: {
    backgroundColor: colors.lime,
    color: colors.black,
    borderColor: colors.lime,
  },
  emptyState: {
    backgroundColor: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: borderRadius.xxl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  emptyTitle: {
    fontSize: 32,
    fontWeight: 900,
    textTransform: 'uppercase',
    color: colors.white,
    marginBottom: spacing.sm,
    marginTop: 0,
  },
  emptyText: {
    color: colors.gray,
    marginBottom: spacing.lg,
    maxWidth: 400,
  },
  primaryButton: {
    backgroundColor: colors.lime,
    color: colors.black,
    border: 'none',
    padding: `${spacing.md}px ${spacing.lg}px`,
    borderRadius: borderRadius.md,
    fontWeight: 900,
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 1,
    cursor: 'pointer',
    boxShadow: '0 4px 0 #999',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionAccent: {
    width: 8,
    height: 32,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.white,
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: borderRadius.xxl,
    padding: spacing.md,
    transition: 'transform 0.2s, border-color 0.2s',
  },
  cardCover: {
    position: 'relative',
    aspectRatio: '4/5',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    backgroundColor: colors.bg,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  typeBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
  },
  badge: {
    display: 'inline-block',
    padding: `${spacing.xs}px ${spacing.sm}px`,
    borderRadius: borderRadius.sm,
    fontWeight: 700,
    fontSize: 12,
  },
  deleteButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.4)',
    border: 'none',
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    cursor: 'pointer',
    fontSize: 12,
  },
  downloadButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: colors.white,
    color: colors.black,
    border: 'none',
    padding: `${spacing.sm}px ${spacing.md}px`,
    borderRadius: borderRadius.md,
    fontWeight: 900,
    textTransform: 'uppercase',
    fontSize: 11,
    cursor: 'pointer',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.white,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
    marginTop: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  cardAuthor: {
    fontSize: 12,
    fontWeight: 500,
    color: colors.gray,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    marginTop: 0,
  },
  sourceTag: {
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.white,
  },
};
