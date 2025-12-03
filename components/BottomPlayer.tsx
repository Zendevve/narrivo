import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, Loader2 } from 'lucide-react';
import { Book } from '../types';

interface BottomPlayerProps {
  currentBook: Book | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (vol: number) => void;
  onOpenReader: () => void;
  isLoading?: boolean;
}

export const BottomPlayer: React.FC<BottomPlayerProps> = ({
  currentBook,
  isPlaying,
  currentTime,
  duration,
  volume,
  onTogglePlay,
  onSeek,
  onVolumeChange,
  onOpenReader,
  isLoading = false
}) => {
  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const hasAudio = currentBook && currentBook.audioUrl;

  return (
    <div className="h-24 bg-[#181818] border-t border-[#282828] flex items-center justify-between px-4 z-50 shrink-0">
      {/* Left: Current Info */}
      <div className="w-1/3 flex items-center space-x-4">
        {currentBook ? (
          <>
            <img 
              src={currentBook.coverUrl} 
              alt="Cover" 
              className="w-14 h-14 object-cover rounded shadow-md hidden sm:block"
            />
            <div className="min-w-0">
              <div className="text-white text-sm font-semibold hover:underline cursor-pointer truncate pr-2" onClick={onOpenReader}>
                {currentBook.title}
              </div>
              <div className="text-[#b3b3b3] text-xs hover:text-white cursor-pointer transition-colors truncate">
                {currentBook.author}
              </div>
            </div>
          </>
        ) : (
            <div className="text-gray-500 text-sm pl-2">Select a book...</div>
        )}
      </div>

      {/* Center: Controls */}
      <div className="w-1/3 flex flex-col items-center max-w-xl">
        <div className="flex items-center space-x-6 mb-2">
          <button className="text-[#b3b3b3] hover:text-white transition-colors" disabled={!hasAudio}>
            <SkipBack size={20} fill="currentColor" />
          </button>
          
          <button 
            onClick={onTogglePlay}
            disabled={!hasAudio || isLoading}
            className={`w-8 h-8 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform ${(!hasAudio || isLoading) ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin text-black" />
            ) : isPlaying ? (
              <Pause size={16} fill="black" />
            ) : (
              <Play size={16} fill="black" className="ml-0.5" />
            )}
          </button>

          <button className="text-[#b3b3b3] hover:text-white transition-colors" disabled={!hasAudio}>
            <SkipForward size={20} fill="currentColor" />
          </button>
        </div>
        
        <div className="w-full flex items-center space-x-2 text-xs text-[#b3b3b3]">
          <span className="w-8 text-right">{formatTime(currentTime)}</span>
          <div className="group relative flex-1 h-1 bg-[#4d4d4d] rounded-full cursor-pointer">
            <div 
              className="absolute top-0 left-0 h-full bg-white group-hover:bg-[#1db954] rounded-full" 
              style={{ width: `${progress}%` }}
            />
            <input 
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => onSeek(Number(e.target.value))}
              className="absolute w-full h-full opacity-0 cursor-pointer"
              disabled={!hasAudio}
            />
          </div>
          <span className="w-8">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Volume & Extras */}
      <div className="w-1/3 flex items-center justify-end space-x-3">
         {currentBook && (currentBook.textContent || currentBook.type === 'EBOOK') && (
            <button 
                onClick={onOpenReader} 
                className="text-[#b3b3b3] hover:text-white transition-colors mr-2"
                title="Open Reader"
            >
                <Maximize2 size={18} />
            </button>
         )}
        <div className="hidden sm:flex items-center space-x-2">
            <Volume2 size={18} className="text-[#b3b3b3]" />
            <div className="w-24 h-1 bg-[#4d4d4d] rounded-full relative group">
            <div 
                className="absolute top-0 left-0 h-full bg-white group-hover:bg-[#1db954] rounded-full" 
                style={{ width: `${volume * 100}%` }}
            />
            <input 
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                className="absolute w-full h-full opacity-0 cursor-pointer top-0 left-0"
                />
            </div>
        </div>
      </div>
    </div>
  );
};