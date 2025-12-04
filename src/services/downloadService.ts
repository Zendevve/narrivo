import { Book } from '../types';

export interface DownloadProgress {
  bookId: string;
  progress: number; // 0-100
  bytesDownloaded: number;
  totalBytes: number;
}

export type ProgressCallback = (progress: DownloadProgress) => void;

/**
 * Public domain book sources
 */
export const PUBLIC_DOMAIN_BOOKS: Omit<Book, 'id' | 'isDownloaded'>[] = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg',
    audiobookPath: 'https://archive.org/download/great_gatsby_1603_librivox/greatgatsby_01_fitzgerald_128kb.mp3',
    ebookPath: null,
    duration: 1800,
    color: '#1a237e',
    type: 'AUDIO',
    source: 'PUBLIC',
  },
  {
    title: 'Sherlock Holmes',
    author: 'Arthur Conan Doyle',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg',
    audiobookPath: 'https://archive.org/download/adventures_sherlock_holmes_librivox/adventures_of_sherlock_holmes_01_doyle_128kb.mp3',
    ebookPath: null,
    duration: 1500,
    color: '#3e2723',
    type: 'AUDIO',
    source: 'PUBLIC',
  },
  {
    title: 'Alice in Wonderland',
    author: 'Lewis Carroll',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Alice%27s_Adventures_in_Wonderland_cover_%281865%29.jpg',
    audiobookPath: null,
    ebookPath: 'https://www.gutenberg.org/files/11/11-h/11-h.htm',
    duration: 0,
    color: '#006064',
    type: 'EBOOK',
    source: 'PUBLIC',
  },
];

/**
 * Get list of available public domain books (not yet downloaded)
 */
export const getPublicDomainCatalog = (): Book[] => {
  return PUBLIC_DOMAIN_BOOKS.map((book, index) => ({
    ...book,
    id: `public-${index}`,
    isDownloaded: false,
  }));
};

/**
 * Download a public domain book
 * Web: just marks as downloaded (streaming)
 * RN: would actually download files to local storage
 */
export const downloadPublicDomainBook = async (
  book: Book,
  onProgress?: ProgressCallback
): Promise<Book> => {
  // Simulate download progress for web
  const totalFakeBytes = 10000000;

  for (let i = 0; i <= 100; i += 10) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    onProgress?.({
      bookId: book.id,
      progress: i,
      bytesDownloaded: (i / 100) * totalFakeBytes,
      totalBytes: totalFakeBytes,
    });
  }

  // Return book marked as downloaded
  return {
    ...book,
    isDownloaded: true,
  };
};

/**
 * Cancel an ongoing download
 */
export const cancelDownload = (bookId: string): void => {
  // Web: no-op since we're not actually downloading
  // RN: would abort the RNFS download job
  console.log(`Download cancelled for ${bookId}`);
};
