import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Library } from './components/Library';
import { BottomPlayer } from './components/BottomPlayer';
import { Reader } from './components/Reader';
import { Book, PlayerState, ViewMode } from './types';
import { MOCK_BOOKS } from './services/mockData';

export default function App() {
  const [activeView, setActiveView] = useState<ViewMode>(ViewMode.LIBRARY);
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
  
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    currentBookId: null,
    playbackRate: 1.0,
  });
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const currentBook = books.find(b => b.id === playerState.currentBookId) || null;

  // Audio Event Listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setPlayerState(prev => ({ ...prev, currentTime: audio.currentTime }));
    const updateDuration = () => setPlayerState(prev => ({ ...prev, duration: audio.duration }));
    const onEnded = () => setPlayerState(prev => ({ ...prev, isPlaying: false }));
    const onWaiting = () => setIsAudioLoading(true);
    const onCanPlay = () => setIsAudioLoading(false);
    const onError = (e: any) => {
      const error = e.target.error;
      console.error("Audio Error Details:", {
        code: error?.code,
        message: error?.message,
        src: audio.src
      });
      setIsAudioLoading(false);
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('error', onError);
    };
  }, []);

  // Handle Play/Pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const playAudio = async () => {
      try {
        if (playerState.isPlaying && audio.paused) {
          // Check if ready state is enough to play
          if (audio.readyState >= 2) {
             await audio.play();
          } else {
             // If not ready, play() will wait, but we ensure loading is triggered
             await audio.play();
          }
        } else if (!playerState.isPlaying && !audio.paused) {
          audio.pause();
        }
      } catch (error) {
        // AbortError is common if pausing quickly after playing, safe to ignore for UI
        if (error instanceof Error && error.name !== 'AbortError') {
             console.error("Playback failed:", error);
             setPlayerState(prev => ({ ...prev, isPlaying: false }));
        }
      }
    };

    playAudio();
  }, [playerState.isPlaying, playerState.currentBookId]);

  // Handle Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = playerState.volume;
    }
  }, [playerState.volume]);

  const togglePlay = () => {
    if (!currentBook) return;
    setPlayerState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleDownloadBook = (bookId: string) => {
    return new Promise<void>((resolve) => {
      // Simulate download time
      setTimeout(() => {
        setBooks(prev => prev.map(b => 
          b.id === bookId ? { ...b, isDownloaded: true } : b
        ));
        resolve();
      }, 1500);
    });
  };

  const selectBook = (book: Book) => {
    if (!book.isDownloaded) return;

    const isNewBook = book.id !== playerState.currentBookId;
    
    if (isNewBook) {
      // 1. Reset state for new book
      setPlayerState(prev => ({
        ...prev,
        currentBookId: book.id,
        isPlaying: !!book.audioUrl, 
        currentTime: 0,
        duration: book.duration || 0
      }));
      
      // 2. Load audio source
      if (audioRef.current) {
          if (book.audioUrl) {
            setIsAudioLoading(true);
            audioRef.current.src = book.audioUrl;
            audioRef.current.load();
          } else {
            audioRef.current.src = "";
            setPlayerState(prev => ({ ...prev, isPlaying: false }));
          }
      }
    }

    // 3. Navigate
    if (book.type === 'EBOOK') {
      setActiveView(ViewMode.READER);
    } else if (book.type === 'HYBRID') {
       // Default to player, but stay in library view if user just clicked it
       // We can also switch to reader if preferred. Let's keep existing logic.
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setPlayerState(prev => ({ ...prev, currentTime: time }));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
      {/* Hidden Audio Element with crossorigin for better CORS handling */}
      <audio 
        ref={audioRef} 
        preload="auto" 
        crossOrigin="anonymous"
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`hidden md:block ${activeView === ViewMode.READER ? 'hidden lg:block' : ''}`}>
           <Sidebar 
            onAddBook={() => alert("File import feature coming soon!")} 
            onGoHome={() => setActiveView(ViewMode.LIBRARY)}
            currentView={activeView}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative min-w-0">
          {activeView === ViewMode.READER && currentBook ? (
            <Reader 
              book={currentBook} 
              currentTime={playerState.currentTime}
              isPlaying={playerState.isPlaying}
              onSeek={handleSeek}
              onClose={() => setActiveView(ViewMode.LIBRARY)}
            />
          ) : (
            <Library 
              books={books} 
              onSelectBook={selectBook} 
              onDownloadBook={handleDownloadBook}
            />
          )}
        </div>
      </div>

      {/* Bottom Player */}
      <BottomPlayer 
        currentBook={currentBook}
        isPlaying={playerState.isPlaying}
        currentTime={playerState.currentTime}
        duration={playerState.duration}
        volume={playerState.volume}
        onTogglePlay={togglePlay}
        onSeek={handleSeek}
        onVolumeChange={(vol) => setPlayerState(prev => ({...prev, volume: vol}))}
        onOpenReader={() => setActiveView(ViewMode.READER)}
        isLoading={isAudioLoading}
      />
    </div>
  );
}