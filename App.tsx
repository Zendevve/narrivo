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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentBook = books.find(b => b.id === playerState.currentBookId) || null;

  // Audio Event Listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setPlayerState(prev => ({ ...prev, currentTime: audio.currentTime }));
    const updateDuration = () => setPlayerState(prev => ({ ...prev, duration: audio.duration }));
    const onEnded = () => setPlayerState(prev => ({ ...prev, isPlaying: false }));
    const onWaiting = () => setIsAudioLoading(true);
    const onPlaying = () => setIsAudioLoading(false);
    const onCanPlay = () => setIsAudioLoading(false);
    
    const onError = (e: any) => {
      const error = audio.error;
      console.error("Audio Error:", error);
      setIsAudioLoading(false);
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
      
      if (error && error.code === 4) {
          console.warn("Source not supported or file not found.");
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
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
           const playPromise = audio.play();
           if (playPromise !== undefined) {
             playPromise.catch((error) => {
                if (error.name === 'NotAllowedError') {
                    console.warn("Playback prevented. User interaction required.");
                } else if (error.name !== 'AbortError') {
                    console.error("Playback failed:", error);
                }
                setPlayerState(prev => ({ ...prev, isPlaying: false }));
             });
           }
        } else if (!playerState.isPlaying && !audio.paused) {
          audio.pause();
        }
      } catch (error) {
         console.error("Audio control error:", error);
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newBooks: Book[] = [];
    const colors = ['#CCFF00', '#9999FF', '#FF3366', '#33FFFF', '#FFFF33'];

    Array.from(files).forEach((file: File, index) => {
      const isAudio = file.type.startsWith('audio');
      const isText = file.type === 'text/plain' || file.name.endsWith('.txt');
      
      const bookId = `user-${Date.now()}-${index}`;
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const book: Book = {
        id: bookId,
        title: file.name.replace(/\.[^/.]+$/, ""),
        author: 'Imported File',
        coverUrl: `https://ui-avatars.com/api/?name=${file.name}&background=random&size=300`, // Simple placeholder
        audioUrl: isAudio ? URL.createObjectURL(file) : null,
        textContent: isText ? "Loading content..." : "Binary file content not displayed in preview.",
        duration: 0,
        color: randomColor,
        type: isAudio ? 'AUDIO' : 'EBOOK',
        isDownloaded: true,
        source: 'USER'
      };

      if (isText) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setBooks(prev => prev.map(b => 
            b.id === bookId ? { ...b, textContent: e.target?.result as string } : b
          ));
        };
        reader.readAsText(file);
      }

      newBooks.push(book);
    });

    setBooks(prev => [...newBooks, ...prev]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
       // Default to player
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setPlayerState(prev => ({ ...prev, currentTime: time }));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#121214] text-white overflow-hidden font-['Inter']">
      <audio ref={audioRef} preload="auto" />
      <input 
        type="file" 
        multiple 
        accept="audio/*,.txt" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileUpload}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`hidden md:block ${activeView === ViewMode.READER ? 'hidden lg:block' : ''}`}>
           <Sidebar 
            onAddBook={triggerImport} 
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
              onImportBook={triggerImport}
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