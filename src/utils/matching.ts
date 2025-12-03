import { Book } from '../types';
import { extractMetadata, normalizeString, similarityScore } from './metadata';

export interface MatchResult {
  found: boolean;
  book?: Book;
  confidence: number; // 0-1 score
  method: 'exact' | 'fuzzy' | 'none';
}

/**
 * Find matching book in library for a new file
 * Uses metadata (title + author) first, then filename similarity
 */
export const findMatch = (
  fileName: string,
  existingBooks: Book[],
  minConfidence = 0.7
): MatchResult => {
  const metadata = extractMetadata(fileName);

  // 1. Exact metadata match (title + author)
  const exactMatch = existingBooks.find(
    (b) =>
      normalizeString(b.title) === normalizeString(metadata.title) &&
      normalizeString(b.author) === normalizeString(metadata.author)
  );

  if (exactMatch) {
    return {
      found: true,
      book: exactMatch,
      confidence: 1.0,
      method: 'exact',
    };
  }

  // 2. Fuzzy title match (for cases where author differs or is unknown)
  let bestMatch: Book | undefined;
  let bestScore = 0;

  existingBooks.forEach((book) => {
    const score = similarityScore(book.title, metadata.title);
    if (score > bestScore && score >= minConfidence) {
      bestScore = score;
      bestMatch = book;
    }
  });

  if (bestMatch) {
    return {
      found: true,
      book: bestMatch,
      confidence: bestScore,
      method: 'fuzzy',
    };
  }

  // 3. No match found
  return {
    found: false,
    confidence: 0,
    method: 'none',
  };
};

/**
 * Suggest user confirmation for ambiguous matches
 */
export const shouldConfirmMatch = (matchResult: MatchResult): boolean => {
  return matchResult.found && matchResult.confidence < 0.9 && matchResult.method === 'fuzzy';
};
