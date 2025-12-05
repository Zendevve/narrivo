import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Book } from '../types';

// Supported file types
const AUDIO_EXTENSIONS = ['mp3', 'm4b', 'm4a', 'aac', 'flac', 'wav', 'ogg'];
const EBOOK_EXTENSIONS = ['epub', 'pdf'];

export interface PickedFile {
  uri: string;
  name: string;
  mimeType?: string;
  size?: number;
}

/**
 * Pick audio and ebook files using system file picker
 */
export async function pickFiles(): Promise<PickedFile[]> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        'audio/*',
        'application/epub+zip',
        'application/pdf',
      ],
      multiple: true,
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return [];
    }

    return result.assets.map((asset) => ({
      uri: asset.uri,
      name: asset.name,
      mimeType: asset.mimeType,
      size: asset.size,
    }));
  } catch (e) {
    console.error('Failed to pick files:', e);
    return [];
  }
}

/**
 * Get file extension from filename
 */
function getExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
}

/**
 * Determine if file is audio or ebook
 */
export function getFileType(filename: string): 'audio' | 'ebook' | null {
  const ext = getExtension(filename);
  if (AUDIO_EXTENSIONS.includes(ext)) return 'audio';
  if (EBOOK_EXTENSIONS.includes(ext)) return 'ebook';
  return null;
}

/**
 * Extract title and author from filename
 */
export function parseFilename(filename: string): { title: string; author: string } {
  const ext = getExtension(filename);
  let name = filename.replace(new RegExp(`\\.${ext}$`, 'i'), '');

  name = name.replace(/^\d+[\s._-]+/, '');
  name = name.replace(/[\s._-]+$/, '');

  if (name.includes(' - ')) {
    const [author, ...titleParts] = name.split(' - ');
    return {
      author: author.trim(),
      title: titleParts.join(' - ').trim() || 'Unknown Title',
    };
  }

  const byMatch = name.match(/^(.+?)\s+by\s+(.+)$/i);
  if (byMatch) {
    return {
      title: byMatch[1].trim(),
      author: byMatch[2].trim(),
    };
  }

  return {
    title: name.trim() || 'Unknown Title',
    author: 'Unknown Author',
  };
}

/**
 * Get the app's document directory
 */
function getDocDir(): string {
  return FileSystem.documentDirectory || '';
}

/**
 * Copy file to app's document directory for persistence
 */
export async function copyToAppStorage(uri: string, filename: string): Promise<string> {
  const docDir = getDocDir();
  if (!docDir) throw new Error('Document directory not available');

  const destPath = `${docDir}books/${filename}`;
  const booksDir = `${docDir}books/`;

  // Ensure directory exists
  const dirInfo = await FileSystem.getInfoAsync(booksDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(booksDir, { intermediates: true });
  }

  // Copy file
  await FileSystem.copyAsync({ from: uri, to: destPath });

  return destPath;
}

/**
 * Process imported files and create Book entries
 */
export function processImportedFile(
  file: PickedFile,
  existingBooks: Book[]
): { book: Book; isNew: boolean } | null {
  const fileType = getFileType(file.name);
  if (!fileType) return null;

  const { title, author } = parseFilename(file.name);

  // Check for existing book with similar title/author
  const existing = existingBooks.find((b) =>
    b.title.toLowerCase() === title.toLowerCase() ||
    (b.author.toLowerCase() === author.toLowerCase() &&
      b.title.toLowerCase().includes(title.toLowerCase().split(' ')[0]))
  );

  if (existing) {
    const updated: Book = {
      ...existing,
      audiobookPath: fileType === 'audio' ? file.uri : existing.audiobookPath,
      ebookPath: fileType === 'ebook' ? file.uri : existing.ebookPath,
      type: (fileType === 'audio' && existing.ebookPath) ||
        (fileType === 'ebook' && existing.audiobookPath)
        ? 'HYBRID' : existing.type,
    };
    return { book: updated, isNew: false };
  }

  const newBook: Book = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    title,
    author,
    coverUrl: '',
    type: fileType === 'audio' ? 'AUDIO' : 'EBOOK',
    source: 'USER',
    isDownloaded: true,
    audiobookPath: fileType === 'audio' ? file.uri : undefined,
    ebookPath: fileType === 'ebook' ? file.uri : undefined,
  };

  return { book: newBook, isNew: true };
}

/**
 * Delete book files from storage
 */
export async function deleteBookFiles(book: Book): Promise<void> {
  const docDir = getDocDir();

  try {
    if (book.audiobookPath?.startsWith(docDir)) {
      await FileSystem.deleteAsync(book.audiobookPath, { idempotent: true });
    }
    if (book.ebookPath?.startsWith(docDir)) {
      await FileSystem.deleteAsync(book.ebookPath, { idempotent: true });
    }
  } catch (e) {
    console.error('Failed to delete book files:', e);
  }
}
