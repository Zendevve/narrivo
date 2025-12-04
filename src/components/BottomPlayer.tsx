import React, { useState, useEffect } from 'react';
import { Book } from '../types';
import { colors, spacing, borderRadius } from '../theme/neoBrutalism';
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
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const id = 'bottom-player';
    audioService.subscribe(id, setPlayerState);
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
    audioService.seekTo(Number(e.target.value));
  };

  // Compact mobile player
  return (
    <div style={styles.wrapper}>
      {/* Progress bar at very top */}
      <div style={styles.progressTrack}>
        <div style={{ ...styles.progressFill, width: `${progress}%` }} />
      </div>

      <div style={styles.player}>
        {/* Left: Cover + Info */}
        <div style={styles.left} onClick={() => setIsExpanded(!isExpanded)}>
          {currentBook ? (
            <>
              <div style={styles.cover}>
                <img src={currentBook.coverUrl} alt="" style={styles.coverImg} />
              </div>
              <div style={styles.info}>
                <div style={styles.title}>{currentBook.title}</div>
                <div style={styles.author}>{currentBook.author}</div>
              </div>
            </>
          ) : (
            <div style={styles.empty}>
              <span style={styles.emptyIcon}>🎵</span>
              <span style={styles.emptyText}>Select a track</span>
            </div>
          )}
        </div>

        {/* Right: Controls */}
        <div style={styles.controls}>
          <button
            style={{
              ...styles.playBtn,
              backgroundColor: hasAudio ? colors.lime : colors.border,
              color: hasAudio ? colors.black : colors.gray,
            }}
            onClick={handleTogglePlay}
            disabled={!hasAudio}
          >
            {playerState.isPlaying ? '⏸' : '▶'}
          </button>
          {currentBook?.ebookPath && (
            <button style={styles.readerBtn} onClick={onOpenReader}>
              📖
            </button>
          )}
        </div>
      </div>

      {/* Expanded view with scrubber */}
      {isExpanded && hasAudio && (
        <div style={styles.expanded}>
          <div style={styles.timeRow}>
            <span style={styles.time}>{formatTime(playerState.currentTime)}</span>
            <input
              type="range"
              min={0}
              max={playerState.duration || 100}
              value={playerState.currentTime}
              onChange={handleSeek}
              style={styles.scrubber}
            />
            <span style={styles.time}>{formatTime(playerState.duration)}</span>
          </div>
          <div style={styles.speedRow}>
            <span style={styles.speedLabel}>{playerState.playbackRate}x</span>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderTop: `1px solid ${colors.border}`,
    zIndex: 100,
  },
  progressTrack: {
    height: 3,
    backgroundColor: colors.border,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.lime,
    transition: 'width 0.3s ease',
  },
  player: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${spacing.sm}px ${spacing.md}px`,
    minHeight: 56,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
    minWidth: 0,
    cursor: 'pointer',
  },
  cover: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    flexShrink: 0,
    backgroundColor: colors.bg,
  },
  coverImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  info: {
    minWidth: 0,
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: 700,
    color: colors.white,
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  author: {
    fontSize: 11,
    color: colors.gray,
    textTransform: 'uppercase',
  },
  empty: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyIcon: {
    fontSize: 20,
  },
  emptyText: {
    fontSize: 12,
    fontWeight: 700,
    color: colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
  },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 700,
    cursor: 'pointer',
  },
  readerBtn: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    border: `1px solid ${colors.border}`,
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    cursor: 'pointer',
  },
  expanded: {
    padding: `0 ${spacing.md}px ${spacing.sm}px`,
  },
  timeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
  },
  time: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: colors.gray,
    minWidth: 32,
  },
  scrubber: {
    flex: 1,
    height: 4,
    accentColor: colors.lime,
  },
  speedRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: spacing.xs,
  },
  speedLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: colors.periwinkle,
    textTransform: 'uppercase',
  },
};
