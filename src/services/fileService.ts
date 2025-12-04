import { Book } from '../types';
import { extractMetadata, getFileType } from '../utils/metadata';
import { findMatch, shouldConfirmMatch } from '../utils/matching';

export interface FilePickResult {
  name: string;
  uri: string;
  type: string;
  size: number;
}

export interface ImportResult {
  book: Book;
  isNewBook: boolean;
  needsConfirmation: boolean;
  matchedBook?: Book;
  confidence?: number;
}

/**
 * Process imported files and create/update book objects
 * Platform-agnostic interface - implementation differs for web vs RN
 */
export const processImportedFile = (
  file: FilePickResult,
  existingBooks: Book[]
): ImportResult => {
  const metadata = extractMetadata(file.name);
  const fileType = getFileType(file.name);

  if (fileType === 'UNKNOWN') {
    throw new Error(`Unsupported file type: ${file.name}`);
  }

  // Check for matching book
  const matchResult = findMatch(file.name, existingBooks);

  if (matchResult.found && matchResult.book) {
    // Existing book found - merge files
    return {
      book: matchResult.book,
      isNewBook: false,
      needsConfirmation: shouldConfirmMatch(matchResult),
      matchedBook: matchResult.book,
      confidence: matchResult.confidence,
    };
  }

  // Create new book
  const colors = ['#CCFF00', '#9999FF', '#FF3366', '#33FFFF', '#FFFF33'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const newBook: Book = {
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: metadata.title,
    author: metadata.author,
    coverUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(metadata.title)}&background=random&size=300`,
    audiobookPath: fileType === 'AUDIO' ? file.uri : null,
    ebookPath: fileType === 'EBOOK' ? file.uri : null,
    duration: 0,
    color: randomColor,
    type: fileType,
    isDownloaded: true,
    source: 'USER',
  };

  return {
    book: newBook,
    isNewBook: true,
    needsConfirmation: false,
  };
};

/**
 * Web implementation: Pick files using input element
 */
export const pickFilesWeb = (): Promise<FilePickResult[]> => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'audio/*,.epub,.pdf,.txt';

    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files || files.length === 0) {
        resolve([]);
        return;
      }

      const results: FilePickResult[] = Array.from(files).map((file) => ({
        name: file.name,
        uri: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
      }));

      resolve(results);
    };

    input.click();
  });
};

/**
 * Copy file to app storage (web: no-op, RN: actual copy)
 */
export const copyToAppStorage = async (
  uri: string,
  bookId: string,
  fileName: string
): Promise<string> => {
  // Web: just return the blob URL as-is
  // React Native: would copy to DocumentDirectoryPath
  return uri;
};
