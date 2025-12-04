import React, { useState, useEffect } from 'react';
import { Book } from '../types';
import { colors, spacing, borderRadius, typography } from '../theme/neoBrutalism';
import { audioService, PlayerState } from '../services/audioService';

interface BottomPlayerProps {
  currentBook: Book | null;
  onOpenReader: () => void;
}

export const BottomPlayer: React.FC<BottomPlayerProps> = ({ currentBook, onOpenReader }) => {
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    playbackRate: 1.0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const id = 'bottom-player';
    audioService.subscribe(id, (state) => {
      setPlayerState(state);
      setIsLoading(false);
    });
    return () => audioService.unsubscribe(id);
  }, []);

  const formatTime = (time: number): string => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progress = playerState.duration ? (playerState.currentTime / playerState.duration) * 100 : 0;
  const hasAudio = currentBook?.audiobookPath;

  const handleTogglePlay = async () => {
    if (!hasAudio) return;
    if (playerState.isPlaying) {
      await audioService.pause();
    } else {
      await audioService.play();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    audioService.seekTo(time);
  };

  return (
    <div style={styles.container}>
      <div style={styles.player}>
        {/* Progress bar at top */}
        <div style={styles.progressTrack}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>

        {/* Book Info */}
        <div style={styles.info}>
          {currentBook ? (
            <>
              <div style={styles.cover}>
                <img src={currentBook.coverUrl} alt={currentBook.title} style={styles.coverImage} />
              </div>
              <div style={styles.meta}>
                <span style={styles.nowPlaying}>Now Playing</span>
                <div style={styles.title}>{currentBook.title}</div>
                <div style={styles.author}>{currentBook.author}</div>
              </div>
            </>
          ) : (
            <div style={styles.emptyInfo}>
              <span>🎵</span>
              <span style={styles.emptyText}>Select a track</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div style={styles.controls}>
          <button style={styles.skipButton} disabled={!hasAudio}>⏮</button>
          <button
            style={{
              ...styles.playButton,
              backgroundColor: hasAudio && !isLoading ? colors.lime : colors.border,
              color: hasAudio && !isLoading ? colors.black : colors.gray,
            }}
            onClick={handleTogglePlay}
            disabled={!hasAudio || isLoading}
          >
            {isLoading ? '...' : playerState.isPlaying ? '⏸' : '▶'}
          </button>
          <button style={styles.skipButton} disabled={!hasAudio}>⏭</button>
        </div>

        {/* Scrubber & Time */}
        <div style={styles.scrubber}>
          <div style={styles.timeDisplay}>
            <span>{formatTime(playerState.currentTime)}</span>
            <span>{formatTime(playerState.duration)}</span>
          </div>
          <div style={styles.sliderContainer}>
            <div style={styles.sliderTrack}>
              <div style={{ ...styles.sliderFill, width: `${progress}%` }} />
            </div>
            <input
              type="range"
              min={0}
              max={playerState.duration || 100}
              value={playerState.currentTime}
              onChange={handleSeek}
              style={styles.sliderInput}
              disabled={!hasAudio}
            />
          </div>
          <div style={styles.extraControls}>
            {currentBook?.ebookPath && (
              <button style={styles.iconButton} onClick={onOpenReader} title="Open Reader">
                📖
              </button>
            )}
            <span style={styles.speedLabel}>{playerState.playbackRate}x</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    zIndex: 50,
    display: 'flex',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  player: {
    width: '100%',
    maxWidth: 900,
    backgroundColor: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: borderRadius.xxl,
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    pointerEvents: 'auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: `${spacing.md}px ${spacing.lg}px`,
    gap: spacing.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  progressTrack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.border,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.lime,
    transition: 'width 0.3s ease',
  },
  info: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
    minWidth: 0,
  },
  cover: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    flexShrink: 0,
    border: `1px solid ${colors.border}`,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  meta: {
    minWidth: 0,
    flex: 1,
  },
  nowPlaying: {
    ...typography.label,
    color: colors.lime,
    backgroundColor: colors.border,
    padding: `2px 6px`,
    borderRadius: 4,
    display: 'inline-block',
    marginBottom: 4,
  },
  title: {
    ...typography.body,
    fontWeight: 700,
    color: colors.white,
    textTransform: 'uppercase',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  author: {
    ...typography.bodySmall,
    color: colors.gray,
    textTransform: 'uppercase',
  },
  emptyInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    color: colors.gray,
  },
  emptyText: {
    ...typography.body,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
  },
  skipButton: {
    background: 'none',
    border: 'none',
    color: colors.gray,
    fontSize: 20,
    cursor: 'pointer',
    padding: spacing.sm,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 0 rgba(0,0,0,0.3)',
    transition: 'transform 0.1s',
  },
  scrubber: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
    minWidth: 200,
  },
  timeDisplay: {
    display: 'flex',
    justifyContent: 'space-between',
    ...typography.label,
    color: colors.gray,
    fontFamily: 'monospace',
  },
  sliderContainer: {
    position: 'relative',
    height: 16,
    display: 'flex',
    alignItems: 'center',
  },
  sliderTrack: {
    position: 'absolute',
    width: '100%',
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: colors.lime,
  },
  sliderInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
  },
  extraControls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  iconButton: {
    background: 'none',
    border: 'none',
    fontSize: 16,
    cursor: 'pointer',
    padding: spacing.xs,
    color: colors.gray,
  },
  speedLabel: {
    ...typography.label,
    color: colors.periwinkle,
  },
};
