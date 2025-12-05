import React from 'react';
import Svg, { Rect, Path, Line, Polygon, Polyline } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

// Neo-Brutalism geometric icons

export const AudioIcon: React.FC<IconProps> = ({ size = 16, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect x="3" y="8" width="4" height="8" fill={color} />
    <Rect x="10" y="4" width="4" height="16" fill={color} />
    <Rect x="17" y="6" width="4" height="12" fill={color} />
  </Svg>
);

export const BookIcon: React.FC<IconProps> = ({ size = 16, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M4 4h16v16H4V4z" stroke={color} strokeWidth={2} fill="none" />
    <Line x1="8" y1="4" x2="8" y2="20" stroke={color} strokeWidth={2} />
    <Line x1="11" y1="8" x2="17" y2="8" stroke={color} strokeWidth={2} />
    <Line x1="11" y1="12" x2="17" y2="12" stroke={color} strokeWidth={2} />
  </Svg>
);

export const HybridIcon: React.FC<IconProps> = ({ size = 16, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect x="2" y="6" width="3" height="12" fill={color} />
    <Rect x="7" y="3" width="3" height="18" fill={color} />
    <Path d="M14 4h8v16h-8V4z" stroke={color} strokeWidth={2} fill="none" />
    <Line x1="16" y1="4" x2="16" y2="20" stroke={color} strokeWidth={2} />
  </Svg>
);

export const PlayIcon: React.FC<IconProps> = ({ size = 20, color = '#000' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Polygon points="6,4 20,12 6,20" fill={color} />
  </Svg>
);

export const PauseIcon: React.FC<IconProps> = ({ size = 20, color = '#000' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect x="5" y="4" width="5" height="16" fill={color} />
    <Rect x="14" y="4" width="5" height="16" fill={color} />
  </Svg>
);

export const DownloadIcon: React.FC<IconProps> = ({ size = 16, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3}>
    <Line x1="12" y1="4" x2="12" y2="16" />
    <Polyline points="6,12 12,18 18,12" />
    <Line x1="4" y1="20" x2="20" y2="20" />
  </Svg>
);

export const CloseIcon: React.FC<IconProps> = ({ size = 16, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth={3} fill="none">
    <Line x1="6" y1="6" x2="18" y2="18" />
    <Line x1="18" y1="6" x2="6" y2="18" />
  </Svg>
);

export const PlusIcon: React.FC<IconProps> = ({ size = 20, color = '#000' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth={3} fill="none">
    <Line x1="12" y1="4" x2="12" y2="20" />
    <Line x1="4" y1="12" x2="20" y2="12" />
  </Svg>
);

export const GridIcon: React.FC<IconProps> = ({ size = 16, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Rect x="3" y="3" width="8" height="8" />
    <Rect x="13" y="3" width="8" height="8" />
    <Rect x="3" y="13" width="8" height="8" />
    <Rect x="13" y="13" width="8" height="8" />
  </Svg>
);

export const SyncIcon: React.FC<IconProps> = ({ size = 16, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M4 12V8C4 6 6 4 8 4H16C18 4 20 6 20 8V12" />
    <Polyline points="8,8 4,12 0,8" />
    <Path d="M20 12V16C20 18 18 20 16 20H8C6 20 4 18 4 16V12" />
    <Polyline points="16,16 20,12 24,16" />
  </Svg>
);
