import { create } from 'zustand';
import { Book, Bookmark } from '../types';

interface BooksState {
  books: Book[];
  addBook: (book: Book) => void;
  updateBook: (bookId: string, updates: Partial<Book>) => void;
  deleteBook: (bookId: string) => void;
  findMatchingBook: (metadata: { title: string; author: string }) => Book | undefined;
  mergeBookFiles: (bookId: string, audiobookPath?: string, ebookPath?: string) => void;
  addBookmark: (bookId: string, bookmark: Bookmark) => void;
  updateLastPosition: (bookId: string, position: number) => void;
  getBookById: (bookId: string) => Book | undefined;
}

export const useBooksStore = create<BooksState>((set, get) => ({
  books: [],

  addBook: (book) => set((state) => ({
    books: [...state.books, book],
  })),

  updateBook: (bookId, updates) => set((state) => ({
    books: state.books.map((b) =>
      b.id === bookId ? { ...b, ...updates } : b
    ),
  })),

  deleteBook: (bookId) => set((state) => ({
    books: state.books.filter((b) => b.id !== bookId),
  })),

  findMatchingBook: (metadata) => {
    const { books } = get();
    const normalizeString = (str: string) => str.toLowerCase().trim();

    return books.find((b) =>
      normalizeString(b.title) === normalizeString(metadata.title) &&
      normalizeString(b.author) === normalizeString(metadata.author)
    );
  },

  mergeBookFiles: (bookId, audiobookPath, ebookPath) => set((state) => ({
    books: state.books.map((b) => {
      if (b.id !== bookId) return b;

      const updates: Partial<Book> = {};
      if (audiobookPath) updates.audiobookPath = audiobookPath;
      if (ebookPath) updates.ebookPath = ebookPath;

      // Determine type based on available files
      const hasAudio = audiobookPath || b.audiobookPath;
      const hasEbook = ebookPath || b.ebookPath;
      if (hasAudio && hasEbook) updates.type = 'HYBRID';
      else if (hasAudio) updates.type = 'AUDIO';
      else if (hasEbook) updates.type = 'EBOOK';

      return { ...b, ...updates };
    }),
  })),

  addBookmark: (bookId, bookmark) => set((state) => ({
    books: state.books.map((b) =>
      b.id === bookId
        ? { ...b, bookmarks: [...(b.bookmarks || []), bookmark] }
        : b
    ),
  })),

  updateLastPosition: (bookId, position) => set((state) => ({
    books: state.books.map((b) =>
      b.id === bookId ? { ...b, lastPosition: position } : b
    ),
  })),

  getBookById: (bookId) => {
    const { books } = get();
    return books.find((b) => b.id === bookId);
  },
}));
