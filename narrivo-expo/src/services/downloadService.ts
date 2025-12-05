import * as FileSystem from 'expo-file-system';
import { Book } from '../types';

export interface DownloadProgress {
  bookId: string;
  progress: number; // 0-1
  status: 'idle' | 'downloading' | 'completed' | 'error';
  error?: string;
}

type ProgressCallback = (progress: DownloadProgress) => void;

class DownloadService {
  private downloads: Map<string, FileSystem.DownloadResumable> = new Map();
  private progressCallbacks: Map<string, ProgressCallback[]> = new Map();

  /**
   * Subscribe to download progress updates
   */
  subscribe(bookId: string, callback: ProgressCallback) {
    if (!this.progressCallbacks.has(bookId)) {
      this.progressCallbacks.set(bookId, []);
    }
    this.progressCallbacks.get(bookId)!.push(callback);
  }

  /**
   * Unsubscribe from download progress updates
   */
  unsubscribe(bookId: string, callback: ProgressCallback) {
    const callbacks = this.progressCallbacks.get(bookId) || [];
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  private notifyProgress(bookId: string, progress: DownloadProgress) {
    const callbacks = this.progressCallbacks.get(bookId) || [];
    callbacks.forEach((cb) => cb(progress));
  }

  /**
   * Download a file and track progress
   */
  async downloadFile(
    bookId: string,
    url: string,
    filename: string,
    type: 'audio' | 'ebook'
  ): Promise<string | null> {
    const docDir = FileSystem.documentDirectory;
    if (!docDir) {
      this.notifyProgress(bookId, {
        bookId,
        progress: 0,
        status: 'error',
        error: 'Storage not available',
      });
      return null;
    }

    const subDir = type === 'audio' ? 'audiobooks' : 'ebooks';
    const destDir = `${docDir}${subDir}/`;
    const destPath = `${destDir}${filename}`;

    try {
      // Ensure directory exists
      const dirInfo = await FileSystem.getInfoAsync(destDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(destDir, { intermediates: true });
      }

      // Start download
      this.notifyProgress(bookId, {
        bookId,
        progress: 0,
        status: 'downloading',
      });

      const downloadResumable = FileSystem.createDownloadResumable(
        url,
        destPath,
        {},
        (downloadProgress) => {
          const progress =
            downloadProgress.totalBytesWritten /
            downloadProgress.totalBytesExpectedToWrite;
          this.notifyProgress(bookId, {
            bookId,
            progress,
            status: 'downloading',
          });
        }
      );

      this.downloads.set(bookId, downloadResumable);

      const result = await downloadResumable.downloadAsync();

      this.downloads.delete(bookId);

      if (result?.uri) {
        this.notifyProgress(bookId, {
          bookId,
          progress: 1,
          status: 'completed',
        });
        return result.uri;
      }

      throw new Error('Download failed');
    } catch (e) {
      this.downloads.delete(bookId);
      this.notifyProgress(bookId, {
        bookId,
        progress: 0,
        status: 'error',
        error: e instanceof Error ? e.message : 'Download failed',
      });
      return null;
    }
  }

  /**
   * Cancel an active download
   */
  async cancelDownload(bookId: string) {
    const download = this.downloads.get(bookId);
    if (download) {
      try {
        await download.pauseAsync();
      } catch (e) {
        // Ignore
      }
      this.downloads.delete(bookId);
      this.notifyProgress(bookId, {
        bookId,
        progress: 0,
        status: 'idle',
      });
    }
  }

  /**
   * Check if a download is in progress
   */
  isDownloading(bookId: string): boolean {
    return this.downloads.has(bookId);
  }

  /**
   * Download a public domain book (audio + ebook if available)
   */
  async downloadPublicDomainBook(book: Book): Promise<Partial<Book>> {
    const updates: Partial<Book> = { isDownloaded: true };
    const safeTitle = book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    // Download audiobook if available
    if (book.audiobookPath && book.audiobookPath.startsWith('http')) {
      const ext = book.audiobookPath.split('.').pop() || 'mp3';
      const audioPath = await this.downloadFile(
        `${book.id}-audio`,
        book.audiobookPath,
        `${safeTitle}.${ext}`,
        'audio'
      );
      if (audioPath) {
        updates.audiobookPath = audioPath;
      }
    }

    // Download ebook if available
    if (book.ebookPath && book.ebookPath.startsWith('http')) {
      const ext = book.ebookPath.split('.').pop() || 'epub';
      const ebookPath = await this.downloadFile(
        `${book.id}-ebook`,
        book.ebookPath,
        `${safeTitle}.${ext}`,
        'ebook'
      );
      if (ebookPath) {
        updates.ebookPath = ebookPath;
      }
    }

    return updates;
  }
}

export const downloadService = new DownloadService();
