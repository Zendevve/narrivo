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
    if (window.confirm('Delete this book?')) {
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
          Library<span style={styles.accent}>.</span>
        </h1>
        <button style={styles.importBtn} onClick={handleImport} disabled={isImporting}>
          {isImporting ? '...' : '+'}
        </button>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        {(['ALL', 'AUDIO', 'EBOOK'] as FilterType[]).map((type) => (
          <button
            key={type}
            style={{
              ...styles.filterBtn,
              ...(filter === type ? styles.filterActive : {}),
            }}
            onClick={() => setFilter(type)}
          >
            {type === 'ALL' ? 'All' : type === 'AUDIO' ? '🎵' : '📖'}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {!hasAnyLocal && (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>📚</div>
          <h2 style={styles.emptyTitle}>Your shelf is empty</h2>
          <p style={styles.emptyText}>Import audiobooks & ebooks, or download from our archive.</p>
          <button style={styles.primaryBtn} onClick={handleImport}>
            Import Files
          </button>
        </div>
      )}

      {/* Book Sections */}
      {importedBooks.length > 0 && (
        <Section title="Imports" color={colors.white}>
          <Grid books={importedBooks} downloading={downloadingIds} onSelect={handleSelectBook} onDownload={handleDownload} onDelete={handleDelete} />
        </Section>
      )}

      {localPublicBooks.length > 0 && (
        <Section title="Downloaded" color={colors.lime}>
          <Grid books={localPublicBooks} downloading={downloadingIds} onSelect={handleSelectBook} onDownload={handleDownload} onDelete={handleDelete} />
        </Section>
      )}

      {availablePublicBooks.length > 0 && (
        <Section title="Archive" color={colors.periwinkle}>
          <Grid books={availablePublicBooks} downloading={downloadingIds} onSelect={handleSelectBook} onDownload={handleDownload} onDelete={handleDelete} />
        </Section>
      )}
    </div>
  );
};

// Section component
const Section: React.FC<{ title: string; color: string; children: React.ReactNode }> = ({ title, color, children }) => (
  <div style={styles.section}>
    <div style={styles.sectionHeader}>
      <div style={{ ...styles.sectionDot, backgroundColor: color }} />
      <h3 style={styles.sectionTitle}>{title}</h3>
    </div>
    {children}
  </div>
);

// Grid component
const Grid: React.FC<{
  books: Book[];
  downloading: Set<string>;
  onSelect: (b: Book) => void;
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ books, downloading, onSelect, onDownload, onDelete }) => (
  <div style={styles.grid}>
    {books.map((book) => (
      <Card
        key={book.id}
        book={book}
        isDownloading={downloading.has(book.id)}
        onSelect={() => onSelect(book)}
        onDownload={() => onDownload(book.id)}
        onDelete={() => onDelete(book.id)}
      />
    ))}
  </div>
);

// Card component
const Card: React.FC<{
  book: Book;
  isDownloading: boolean;
  onSelect: () => void;
  onDownload: () => void;
  onDelete: () => void;
}> = ({ book, isDownloading, onSelect, onDownload, onDelete }) => {
  const isLocal = book.isDownloaded;

  return (
    <div style={{ ...styles.card, opacity: isLocal ? 1 : 0.7 }} onClick={isLocal ? onSelect : undefined}>
      <div style={styles.cardCover}>
        <img src={book.coverUrl} alt="" style={styles.cardImg} />

        {/* Type badge */}
        <div style={styles.badge}>
          {book.type === 'AUDIO' && <span style={{ ...styles.badgeIcon, backgroundColor: colors.lime }}>🎵</span>}
          {book.type === 'EBOOK' && <span style={{ ...styles.badgeIcon, backgroundColor: colors.periwinkle }}>📖</span>}
          {book.type === 'HYBRID' && <span style={{ ...styles.badgeIcon, backgroundColor: colors.white }}>🎵📖</span>}
        </div>

        {/* Action button */}
        {!isLocal ? (
          <button style={styles.downloadBtn} onClick={(e) => { e.stopPropagation(); onDownload(); }} disabled={isDownloading}>
            {isDownloading ? '...' : '↓'}
          </button>
        ) : (
          <button style={styles.deleteBtn} onClick={(e) => { e.stopPropagation(); onDelete(); }}>
            ×
          </button>
        )}
      </div>
      <div style={styles.cardTitle}>{book.title}</div>
      <div style={styles.cardAuthor}>{book.author}</div>
    </div>
  );
};

// Mobile-first styles
const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: spacing.md,
    paddingBottom: 80, // Space for BottomPlayer
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: -1,
    color: colors.white,
    margin: 0,
  },
  accent: {
    color: colors.lime,
  },
  importBtn: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    color: colors.black,
    border: 'none',
    fontSize: 24,
    fontWeight: 700,
    cursor: 'pointer',
  },
  filters: {
    display: 'flex',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  filterBtn: {
    flex: 1,
    padding: `${spacing.sm}px`,
    borderRadius: borderRadius.md,
    border: `2px solid ${colors.border}`,
    backgroundColor: 'transparent',
    color: colors.gray,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
  },
  filterActive: {
    backgroundColor: colors.lime,
    borderColor: colors.lime,
    color: colors.black,
  },
  empty: {
    textAlign: 'center',
    padding: spacing.xl,
    backgroundColor: colors.card,
    borderRadius: borderRadius.xxl,
    border: `1px solid ${colors.border}`,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 900,
    textTransform: 'uppercase',
    color: colors.white,
    margin: 0,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: 13,
    color: colors.gray,
    marginBottom: spacing.lg,
    lineHeight: 1.5,
  },
  primaryBtn: {
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
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    display: 'flex',
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
    fontSize: 14,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.white,
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)', // 2 columns for mobile
    gap: spacing.sm,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    cursor: 'pointer',
  },
  cardCover: {
    position: 'relative',
    aspectRatio: '3/4',
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: spacing.xs,
    backgroundColor: colors.bg,
  },
  cardImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  badge: {
    position: 'absolute',
    top: 6,
    left: 6,
  },
  badgeIcon: {
    display: 'inline-block',
    padding: '2px 6px',
    borderRadius: 4,
    fontSize: 10,
  },
  downloadBtn: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.lime,
    color: colors.black,
    border: 'none',
    fontSize: 16,
    fontWeight: 900,
    cursor: 'pointer',
  },
  deleteBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: colors.white,
    border: 'none',
    fontSize: 16,
    cursor: 'pointer',
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: colors.white,
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  cardAuthor: {
    fontSize: 10,
    color: colors.gray,
    textTransform: 'uppercase',
  },
};
