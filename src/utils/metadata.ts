/**
 * Extract metadata from filename
 * Cleans filename and attempts to parse title/author
 */
export const extractMetadata = (fileName: string): { title: string; author: string } => {
  // Remove file extension
  const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');

  // Clean filename: remove underscores, hyphens, and capitalize
  const cleanTitle = nameWithoutExt
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .trim();

  // TODO: Implement more sophisticated parsing (e.g., "Title - Author" patterns)
  // For now, return cleaned title and "Unknown" as author
  return {
    title: cleanTitle,
    author: 'Unknown',
  };
};

/**
 * Normalize string for comparison
 */
export const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' '); // Normalize whitespace
};

/**
 * Calculate similarity score between two strings (0-1)
 * Uses simple character-based comparison
 */
export const similarityScore = (str1: string, str2: string): number => {
  const norm1 = normalizeString(str1);
  const norm2 = normalizeString(str2);

  if (norm1 === norm2) return 1;

  // Calculate Jaccard similarity (set intersection)
  const set1 = new Set(norm1.split(''));
  const set2 = new Set(norm2.split(''));

  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size;
};

/**
 * Determine file type from filename extension
 */
export const getFileType = (fileName: string): 'AUDIO' | 'EBOOK' | 'UNKNOWN' => {
  const ext = fileName.split('.').pop()?.toLowerCase();

  const audioExts = ['mp3', 'm4a', 'm4b', 'aac', 'flac', 'wav', 'ogg'];
  const ebookExts = ['epub', 'pdf', 'txt', 'mobi'];

  if (ext && audioExts.includes(ext)) return 'AUDIO';
  if (ext && ebookExts.includes(ext)) return 'EBOOK';
  return 'UNKNOWN';
};
