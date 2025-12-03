import React, { useState } from 'react';
import { Book } from '../types';
import { Play, BookOpen, Headphones, Download, CheckCircle, Loader2 } from 'lucide-react';

interface LibraryProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onDownloadBook: (bookId: string) => Promise<void>;
}

interface BookCardProps {
  book: Book;
  isLocal: boolean;
  isDownloading: boolean;
  onSelect: (book: Book) => void;
  onDownload: (e: React.MouseEvent, bookId: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, isLocal, isDownloading, onSelect, onDownload }) => {
  return (
    <div 
      onClick={() => isLocal && onSelect(book)}
      className={`group bg-[#181818] hover:bg-[#282828] rounded-md p-4 transition-all duration-300 relative ${isLocal ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <div className="relative aspect-square w-full mb-4 shadow-lg rounded overflow-hidden">
        <img 
          src={book.coverUrl} 
          alt={book.title} 
          className={`w-full h-full object-cover transition-transform duration-500 ${isLocal ? 'group-hover:scale-105' : 'grayscale-[20%]'}`}
        />
        
        {/* Type Badge */}
        <div className="absolute top-2 left-2">
            {book.type === 'AUDIO' && <div className="bg-black/60 p-1.5 rounded-full backdrop-blur-sm"><Headphones size={12} className="text-white"/></div>}
            {book.type === 'EBOOK' && <div className="bg-black/60 p-1.5 rounded-full backdrop-blur-sm"><BookOpen size={12} className="text-white"/></div>}
            {book.type === 'HYBRID' && <div className="bg-black/60 p-1.5 rounded-full backdrop-blur-sm flex space-x-1"><Headphones size={12} className="text-white"/><BookOpen size={12} className="text-white"/></div>}
        </div>

        {/* Action Overlay */}
        {isLocal ? (
           (book.type !== 'EBOOK') && (
            <div className="absolute bottom-2 right-2 bg-[#1db954] rounded-full p-3 shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10 hover:scale-110">
              <Play fill="black" size={20} className="text-black ml-0.5" />
            </div>
          )
        ) : (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <button 
              onClick={(e) => onDownload(e, book.id)}
              disabled={isDownloading}
              className="bg-white text-black font-bold py-2 px-4 rounded-full flex items-center space-x-2 hover:scale-105 transition-transform"
             >
               {isDownloading ? (
                 <>
                  <Loader2 size={16} className="animate-spin"/>
                  <span>Loading...</span>
                 </>
               ) : (
                 <>
                  <Download size={16} />
                  <span>Download</span>
                 </>
               )}
             </button>
          </div>
        )}
      </div>
      <h3 className="font-bold text-white truncate mb-1">{book.title}</h3>
      <p className="text-sm text-gray-400 truncate">{book.author}</p>
      {!isLocal && (
           <div className="mt-2 text-xs text-[#1db954] font-medium flex items-center">
               Free Public Domain
           </div>
      )}
    </div>
  );
};

export const Library: React.FC<LibraryProps> = ({ books, onSelectBook, onDownloadBook }) => {
  const [filter, setFilter] = useState<'ALL' | 'AUDIO' | 'EBOOK'>('ALL');
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

  // Filter Logic
  const filterType = (b: Book) => {
    if (filter === 'ALL') return true;
    if (filter === 'AUDIO') return b.type === 'AUDIO' || b.type === 'HYBRID';
    if (filter === 'EBOOK') return b.type === 'EBOOK' || b.type === 'HYBRID';
    return true;
  };

  const localBooks = books.filter(b => b.isDownloaded && filterType(b));
  const publicBooks = books.filter(b => !b.isDownloaded && filterType(b));

  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';

  const handleDownload = async (e: React.MouseEvent, bookId: string) => {
    e.stopPropagation();
    setDownloadingIds(prev => new Set(prev).add(bookId));
    await onDownloadBook(bookId);
    setDownloadingIds(prev => {
        const next = new Set(prev);
        next.delete(bookId);
        return next;
    });
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-[#1e1e1e] to-[#121212] overflow-y-auto p-8 pb-32">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-white">{greeting}</h1>
        <div className="flex space-x-2 bg-[#282828] p-1 rounded-full w-fit">
          <button 
            onClick={() => setFilter('ALL')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === 'ALL' ? 'bg-[#333] text-white' : 'text-gray-400 hover:text-white'}`}
          >
            All
          </button>
           <button 
            onClick={() => setFilter('AUDIO')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === 'AUDIO' ? 'bg-[#333] text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Audio
          </button>
           <button 
            onClick={() => setFilter('EBOOK')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === 'EBOOK' ? 'bg-[#333] text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Books
          </button>
        </div>
      </div>
      
      {/* Empty State / Welcome */}
      {localBooks.length === 0 && (
        <div className="mb-12 bg-gradient-to-r from-[#1db954]/10 to-transparent p-6 rounded-lg border border-[#1db954]/20">
            <h2 className="text-2xl font-bold mb-2">Welcome to Narrivo</h2>
            <p className="text-gray-300 max-w-2xl mb-4">
                Your library is currently empty. Get started by downloading some of our curated public-domain classics. 
                Enjoy fully offline playback and reading.
            </p>
        </div>
      )}

      {/* Local Library Section */}
      {localBooks.length > 0 && (
        <div className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <span>Your Library</span>
                <CheckCircle size={16} className="text-[#1db954]" />
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {localBooks.map((book) => (
                    <BookCard 
                      key={book.id} 
                      book={book} 
                      isLocal={true} 
                      isDownloading={downloadingIds.has(book.id)}
                      onSelect={onSelectBook}
                      onDownload={handleDownload}
                    />
                ))}
            </div>
        </div>
      )}

      {/* Public Domain Section */}
      {publicBooks.length > 0 && (
        <div>
            <h2 className="text-xl font-bold mb-4">Discover Classics (Free)</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                 {publicBooks.map((book) => (
                    <BookCard 
                      key={book.id} 
                      book={book} 
                      isLocal={false} 
                      isDownloading={downloadingIds.has(book.id)}
                      onSelect={onSelectBook}
                      onDownload={handleDownload}
                    />
                ))}
            </div>
        </div>
      )}
      
      {localBooks.length === 0 && publicBooks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-gray-500">
              <p>No books match the selected filter.</p>
          </div>
      )}
    </div>
  );
};