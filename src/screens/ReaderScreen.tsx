import React, { useState } from 'react';
import { Book } from '../types';
import { colors, spacing, borderRadius, typography } from '../theme/neoBrutalism';

interface ReaderScreenProps {
  book: Book;
  onClose: () => void;
}

export const ReaderScreen: React.FC<ReaderScreenProps> = ({ book, onClose }) => {
  const [fontSize, setFontSize] = useState(18);

  // For now, display a placeholder. EPUB/PDF rendering would require additional libs.
  const textContent = book.ebookPath
    ? 'eBook content would be rendered here using epub.js or react-native-pdf for the React Native version.'
    : 'No eBook content available.';

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onClose}>
          ← Library
        </button>
        <div style={styles.headerCenter}>
          <span style={styles.headerTitle}>{book.title}</span>
          <span style={styles.headerSubtitle}>Reading Mode</span>
        </div>
        <div style={styles.fontControls}>
          <button
            style={styles.fontButton}
            onClick={() => setFontSize(Math.max(14, fontSize - 2))}
          >
            A-
          </button>
          <span style={styles.fontLabel}>Aa</span>
          <button
            style={styles.fontButton}
            onClick={() => setFontSize(Math.min(32, fontSize + 2))}
          >
            A+
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={styles.contentArea}>
        <div style={styles.textContainer}>
          <p style={{ ...styles.text, fontSize }}>{textContent}</p>
        </div>

        {/* Sidebar (desktop) */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarCard}>
            <img src={book.coverUrl} alt={book.title} style={styles.sidebarCover} />
            <h3 style={styles.sidebarTitle}>{book.title}</h3>
            <p style={styles.sidebarAuthor}>{book.author}</p>
          </div>
          <div style={styles.progressCard}>
            <span style={styles.progressLabel}>Progress</span>
            <div style={styles.progressTrack}>
              <div style={styles.progressFill} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: colors.bg,
    color: colors.white,
  },
  header: {
    height: 72,
    borderBottom: `1px solid ${colors.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `0 ${spacing.lg}px`,
    backgroundColor: colors.card,
    flexShrink: 0,
  },
  backButton: {
    backgroundColor: colors.border,
    color: colors.white,
    border: 'none',
    padding: `${spacing.sm}px ${spacing.md}px`,
    borderRadius: borderRadius.md,
    fontWeight: 700,
    textTransform: 'uppercase',
    fontSize: 12,
    cursor: 'pointer',
  },
  headerCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.body,
    fontWeight: 900,
    textTransform: 'uppercase',
  },
  headerSubtitle: {
    ...typography.label,
    color: colors.periwinkle,
  },
  fontControls: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.border,
    padding: spacing.xs,
    borderRadius: borderRadius.md,
  },
  fontButton: {
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    color: colors.gray,
    borderRadius: borderRadius.sm,
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 700,
  },
  fontLabel: {
    color: colors.lime,
    fontWeight: 700,
    padding: `0 ${spacing.xs}px`,
  },
  contentArea: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
  textContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: spacing.xl,
    maxWidth: 720,
    margin: '0 auto',
  },
  text: {
    lineHeight: 1.8,
    color: '#E4E4E7',
    fontFamily: 'Georgia, serif',
    whiteSpace: 'pre-wrap',
  },
  sidebar: {
    width: 280,
    borderLeft: `1px solid ${colors.border}`,
    padding: spacing.lg,
    backgroundColor: '#18181B',
    display: 'none', // Hide on mobile, show on larger screens via media query
  },
  sidebarCard: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.xxl,
    border: `1px solid ${colors.border}`,
    marginBottom: spacing.lg,
  },
  sidebarCover: {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'cover',
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    filter: 'grayscale(100%)',
    transition: 'filter 0.3s',
  },
  sidebarTitle: {
    ...typography.body,
    fontWeight: 900,
    textTransform: 'uppercase',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  sidebarAuthor: {
    ...typography.bodySmall,
    color: colors.lime,
    textTransform: 'uppercase',
  },
  progressCard: {
    backgroundColor: colors.border,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  progressLabel: {
    ...typography.label,
    color: colors.gray,
    marginBottom: spacing.sm,
    display: 'block',
  },
  progressTrack: {
    width: '100%',
    height: 8,
    backgroundColor: colors.card,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    width: '45%',
    height: '100%',
    backgroundColor: colors.periwinkle,
  },
};
