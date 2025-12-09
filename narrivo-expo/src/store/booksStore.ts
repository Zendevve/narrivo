import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book, BookType, Bookmark } from '../types';

const STORAGE_KEY = 'narrivo_books';

interface BooksState {
  books: Book[];
  isLoading: boolean;

  // Actions
  loadBooks: () => Promise<void>;
  addBook: (book: Book) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  addBookmark: (bookId: string, bookmark: Bookmark) => void;
  deleteBookmark: (bookId: string, bookmarkId: string) => void;
  updateLastPosition: (bookId: string, position: number) => void;
  mergeBookFiles: (bookId: string, audioPath?: string, ebookPath?: string) => void;
  getBookById: (id: string) => Book | undefined;
}

// Determine book type based on available files
const getBookType = (audioPath?: string, ebookPath?: string): BookType => {
  if (audioPath && ebookPath) return 'HYBRID';
  if (audioPath) return 'AUDIO';
  return 'EBOOK';
};

export const useBooksStore = create<BooksState>((set, get) => ({
  books: [],
  isLoading: true,

  loadBooks: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        set({ books: JSON.parse(stored), isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (e) {
      console.error('Failed to load books:', e);
      set({ isLoading: false });
    }
  },

  addBook: (book) => {
    set((state) => {
      // Prevent duplicates
      if (state.books.find((b) => b.id === book.id)) return state;

      const newBooks = [...state.books, book];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newBooks));
      return { books: newBooks };
    });
  },

  updateBook: (id, updates) => {
    set((state) => {
      const newBooks = state.books.map((book) =>
        book.id === id ? { ...book, ...updates } : book
      );
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newBooks));
      return { books: newBooks };
    });
  },

  deleteBook: (id) => {
    set((state) => {
      const newBooks = state.books.filter((book) => book.id !== id);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newBooks));
      return { books: newBooks };
    });
  },

  addBookmark: (bookId, bookmark) => {
    set((state) => {
      const newBooks = state.books.map((book) => {
        if (book.id !== bookId) return book;
        const bookmarks = [...(book.bookmarks || []), bookmark];
        return { ...book, bookmarks };
      });
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newBooks));
      return { books: newBooks };
    });
  },

  deleteBookmark: (bookId, bookmarkId) => {
    set((state) => {
      const newBooks = state.books.map((book) => {
        if (book.id !== bookId) return book;
        const bookmarks = (book.bookmarks || []).filter((bm) => bm.id !== bookmarkId);
        return { ...book, bookmarks };
      });
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newBooks));
      return { books: newBooks };
    });
  },

  updateLastPosition: (bookId, position) => {
    set((state) => {
      const newBooks = state.books.map((book) =>
        book.id === bookId ? { ...book, lastPosition: position } : book
      );
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newBooks));
      return { books: newBooks };
    });
  },

  mergeBookFiles: (bookId, audioPath, ebookPath) => {
    set((state) => {
      const newBooks = state.books.map((book) => {
        if (book.id !== bookId) return book;
        const newAudioPath = audioPath || book.audiobookPath;
        const newEbookPath = ebookPath || book.ebookPath;
        return {
          ...book,
          audiobookPath: newAudioPath,
          ebookPath: newEbookPath,
          type: getBookType(newAudioPath, newEbookPath),
        };
      });
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newBooks));
      return { books: newBooks };
    });
  },

  getBookById: (id) => get().books.find((book) => book.id === id),
}));
