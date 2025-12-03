import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, Loader2, ListMusic } from 'lucide-react';
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
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none flex justify-center">
      <div className="w-full max-w-[95%] md:max-w-6xl bg-[#1C1C1E] border border-[#333] rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] pointer-events-auto flex flex-col md:flex-row items-center p-3 md:p-4 gap-4 overflow-hidden relative">
        
        {/* Background Progress (Top Border effect) */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#2A2A2D]">
            <div 
              className="h-full bg-[#CCFF00] transition-all duration-300 ease-linear"
              style={{ width: `${progress}%` }}
            />
        </div>

        {/* Left: Info */}
        <div className="flex items-center space-x-4 w-full md:w-1/3">
           {currentBook ? (
            <>
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden bg-gray-800 shrink-0 border border-[#333]">
                  <img src={currentBook.coverUrl} className="w-full h-full object-cover" alt="cover"/>
              </div>
              <div className="min-w-0 flex-1">
                 <div className="flex items-center space-x-2">
                    <span className="text-[10px] bg-[#2A2A2D] text-[#CCFF00] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Now Playing</span>
                 </div>
                 <div className="text-white font-bold uppercase tracking-wide truncate mt-1 text-sm">{currentBook.title}</div>
                 <div className="text-gray-500 text-xs font-medium uppercase tracking-wider truncate">{currentBook.author}</div>
              </div>
            </>
           ) : (
             <div className="flex items-center space-x-3 text-gray-500 px-2">
                <ListMusic size={24} />
                <span className="font-bold uppercase tracking-wider text-xs">Select a track</span>
             </div>
           )}
        </div>

        {/* Center: Controls */}
        <div className="flex items-center justify-center space-x-4 md:space-x-8 w-full md:w-1/3">
             <button className="text-gray-400 hover:text-white transition-colors p-2" disabled={!hasAudio}>
                <SkipBack size={24} fill="currentColor" />
             </button>
             
             <button 
                onClick={onTogglePlay}
                disabled={!hasAudio || isLoading}
                className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-2xl border-2 transition-all shadow-[0_4px_0_rgba(0,0,0,0.3)] active:translate-y-1 active:shadow-none
                    ${(!hasAudio || isLoading) 
                        ? 'bg-[#2A2A2D] border-[#333] text-gray-500 cursor-not-allowed' 
                        : 'bg-[#CCFF00] border-[#CCFF00] hover:bg-[#b3e600] text-black'
                    }`}
             >
                {isLoading ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : isPlaying ? (
                  <Pause size={24} fill="black" strokeWidth={3} />
                ) : (
                  <Play size={24} fill="black" className="ml-1" strokeWidth={3} />
                )}
             </button>

             <button className="text-gray-400 hover:text-white transition-colors p-2" disabled={!hasAudio}>
                <SkipForward size={24} fill="currentColor" />
             </button>
        </div>

        {/* Right: Scrubber & Volume */}
        <div className="hidden md:flex flex-col w-1/3 space-y-2 px-4">
             {/* Time Display */}
             <div className="flex justify-between text-[10px] font-bold text-gray-400 tracking-widest font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
             </div>

             {/* Scrubber */}
             <div className="relative group h-4 flex items-center cursor-pointer">
                 <div className="absolute w-full h-2 bg-[#2A2A2D] rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-[#CCFF00]" 
                        style={{ width: `${progress}%` }}
                    />
                 </div>
                 {/* Drag Thumb */}
                 <div 
                    className="absolute h-4 w-4 bg-white border-2 border-[#CCFF00] rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ left: `calc(${progress}% - 8px)` }}
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
             
             <div className="flex items-center justify-end space-x-3 pt-1">
                 {currentBook && (currentBook.textContent || currentBook.type === 'EBOOK') && (
                    <button 
                        onClick={onOpenReader} 
                        className="text-gray-400 hover:text-[#9999FF] transition-colors"
                        title="Open Reader"
                    >
                        <Maximize2 size={16} />
                    </button>
                 )}
                 <Volume2 size={16} className="text-gray-400" />
                 <div className="w-20 h-1.5 bg-[#2A2A2D] rounded-full relative">
                    <div className="absolute h-full bg-[#9999FF] rounded-full" style={{ width: `${volume * 100}%` }}></div>
                    <input 
                        type="range"
                        min={0} max={1} step={0.01}
                        value={volume}
                        onChange={(e) => onVolumeChange(Number(e.target.value))}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
};