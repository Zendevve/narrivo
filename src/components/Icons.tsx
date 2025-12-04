import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
}

// Simple geometric icons matching Neo-Brutalism aesthetic
// Bold, minimal, high-contrast

export const AudioIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="8" width="4" height="8" fill={color} />
    <rect x="10" y="4" width="4" height="16" fill={color} />
    <rect x="17" y="6" width="4" height="12" fill={color} />
  </svg>
);

export const BookIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M4 4h16v16H4V4z" stroke={color} strokeWidth="2" fill="none" />
    <line x1="8" y1="4" x2="8" y2="20" stroke={color} strokeWidth="2" />
    <line x1="11" y1="8" x2="17" y2="8" stroke={color} strokeWidth="2" />
    <line x1="11" y1="12" x2="17" y2="12" stroke={color} strokeWidth="2" />
  </svg>
);

export const HybridIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="6" width="3" height="12" fill={color} />
    <rect x="7" y="3" width="3" height="18" fill={color} />
    <path d="M14 4h8v16h-8V4z" stroke={color} strokeWidth="2" fill="none" />
    <line x1="16" y1="4" x2="16" y2="20" stroke={color} strokeWidth="2" />
  </svg>
);

export const PlayIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <polygon points="6,4 20,12 6,20" />
  </svg>
);

export const PauseIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <rect x="5" y="4" width="5" height="16" />
    <rect x="14" y="4" width="5" height="16" />
  </svg>
);

export const DownloadIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3">
    <line x1="12" y1="4" x2="12" y2="16" />
    <polyline points="6,12 12,18 18,12" />
    <line x1="4" y1="20" x2="20" y2="20" />
  </svg>
);

export const DeleteIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth="3" fill="none">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth="3" fill="none">
    <line x1="12" y1="4" x2="12" y2="20" />
    <line x1="4" y1="12" x2="20" y2="12" />
  </svg>
);

export const LibraryIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <rect x="3" y="4" width="4" height="16" />
    <rect x="10" y="4" width="4" height="16" />
    <rect x="17" y="4" width="4" height="16" />
  </svg>
);

export const ChevronIcon: React.FC<IconProps & { direction?: 'up' | 'down' }> = ({
  size = 16,
  color = 'currentColor',
  direction = 'down'
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    stroke={color}
    strokeWidth="3"
    fill="none"
    style={{ transform: direction === 'up' ? 'rotate(180deg)' : undefined }}
  >
    <polyline points="4,8 12,16 20,8" />
  </svg>
);

export const AllIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <rect x="3" y="3" width="8" height="8" />
    <rect x="13" y="3" width="8" height="8" />
    <rect x="3" y="13" width="8" height="8" />
    <rect x="13" y="13" width="8" height="8" />
  </svg>
);
