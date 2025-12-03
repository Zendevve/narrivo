import React, { useState } from 'react';
import { Book } from '../types';
import { Play, BookOpen, Headphones, Download, CheckCircle, Loader2, Search, Upload, User } from 'lucide-react';

interface LibraryProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onDownloadBook: (bookId: string) => Promise<void>;
  onImportBook: () => void;
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
      className={`group relative flex flex-col p-4 rounded-[2rem] transition-all duration-300 border border-[#2A2A2D] bg-[#1C1C1E] hover:bg-[#252528] ${isLocal ? 'cursor-pointer hover:-translate-y-1 hover:border-[#444]' : 'cursor-default opacity-90'}`}
    >
      <div className="relative aspect-[4/5] w-full mb-4 overflow-hidden rounded-2xl bg-[#121214]">
        <img 
          src={book.coverUrl} 
          alt={book.title} 
          className={`w-full h-full object-cover transition-transform duration-500 ${isLocal ? 'group-hover:scale-110' : 'grayscale opacity-60'}`}
        />
        
        {/* Type Badge */}
        <div className="absolute top-3 left-3 flex gap-2">
            {book.type === 'AUDIO' && <div className="bg-[#CCFF00] text-black p-2 rounded-lg font-bold shadow-lg"><Headphones size={14} strokeWidth={3}/></div>}
            {book.type === 'EBOOK' && <div className="bg-[#9999FF] text-black p-2 rounded-lg font-bold shadow-lg"><BookOpen size={14} strokeWidth={3}/></div>}
            {book.type === 'HYBRID' && (
                <div className="bg-white text-black px-2 py-1.5 rounded-lg font-bold shadow-lg flex space-x-1 items-center">
                    <Headphones size={12} strokeWidth={3}/>
                    <span className="text-[10px] font-black">+</span>
                    <BookOpen size={12} strokeWidth={3}/>
                </div>
            )}
        </div>

        {/* User Badge */}
        {book.source === 'USER' && (
             <div className="absolute top-3 right-3 bg-white text-black p-2 rounded-lg font-bold shadow-lg">
                <User size={14} strokeWidth={3}/>
            </div>
        )}

        {/* Action Overlay */}
        {isLocal ? (
           (book.type !== 'EBOOK') && (
            <div className="absolute bottom-3 right-3">
               <div className="bg-[#CCFF00] rounded-xl p-3 shadow-[0_4px_0_rgb(0,0,0)] translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 active:translate-y-1 active:shadow-none">
                  <Play fill="black" size={20} className="text-black ml-0.5" />
               </div>
            </div>
          )
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
             <button 
              onClick={(e) => onDownload(e, book.id)}
              disabled={isDownloading}
              className="bg-white text-black font-black uppercase text-xs py-3 px-6 rounded-xl shadow-[0_4px_0_#999] hover:translate-y-[2px] hover:shadow-[0_2px_0_#999] active:translate-y-[4px] active:shadow-none transition-all flex items-center space-x-2"
             >
               {isDownloading ? (
                 <>
                  <Loader2 size={16} className="animate-spin"/>
                  <span>Fetch</span>
                 </>
               ) : (
                 <>
                  <Download size={16} strokeWidth={3} />
                  <span>Get</span>
                 </>
               )}
             </button>
          </div>
        )}
      </div>
      
      <div className="flex flex-col flex-1">
          <h3 className="font-bold text-white leading-tight uppercase tracking-tight text-sm mb-1 line-clamp-2">{book.title}</h3>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider truncate mb-2">{book.author}</p>
          
          {/* Footer Info */}
          {book.source === 'USER' && (
             <div className="mt-auto pt-3 border-t border-[#2A2A2D] flex items-center space-x-1 text-white">
                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Imported</span>
            </div>
          )}
          
          {book.source === 'PUBLIC' && !isLocal && (
            <div className="mt-auto pt-3 border-t border-[#2A2A2D] flex items-center space-x-1 text-[#9999FF]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#9999FF]"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Public Domain</span>
            </div>
          )}
          {book.source === 'PUBLIC' && isLocal && (
             <div className="mt-auto pt-3 border-t border-[#2A2A2D] flex items-center space-x-1 text-[#CCFF00]">
                <CheckCircle size={12} strokeWidth={3} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Ready</span>
            </div>
          )}
      </div>
    </div>
  );
};

export const Library: React.FC<LibraryProps> = ({ books, onSelectBook, onDownloadBook, onImportBook }) => {
  const [filter, setFilter] = useState<'ALL' | 'AUDIO' | 'EBOOK'>('ALL');
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

  const filterType = (b: Book) => {
    if (filter === 'ALL') return true;
    if (filter === 'AUDIO') return b.type === 'AUDIO' || b.type === 'HYBRID';
    if (filter === 'EBOOK') return b.type === 'EBOOK' || b.type === 'HYBRID';
    return true;
  };

  const importedBooks = books.filter(b => b.source === 'USER' && filterType(b));
  const localPublicBooks = books.filter(b => b.source === 'PUBLIC' && b.isDownloaded && filterType(b));
  const availablePublicBooks = books.filter(b => b.source === 'PUBLIC' && !b.isDownloaded && filterType(b));

  const hasAnyLocal = importedBooks.length > 0 || localPublicBooks.length > 0;

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

  const FilterButton = ({ label, type }: { label: string, type: 'ALL' | 'AUDIO' | 'EBOOK' }) => (
      <button 
        onClick={() => setFilter(type)}
        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 ${
            filter === type 
            ? 'bg-[#CCFF00] border-[#CCFF00] text-black shadow-[0_0_15px_-5px_#CCFF00]' 
            : 'bg-transparent border-[#333] text-gray-400 hover:border-white hover:text-white'
        }`}
      >
        {label}
      </button>
  );

  return (
    <div className="flex-1 bg-[#121214] overflow-y-auto p-8 pb-40">
      {/* Header & Search */}
      <div className="flex flex-col gap-8 mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
                Library
                <span className="text-[#CCFF00] text-5xl">.</span>
            </h1>
            
            <div className="flex items-center gap-3">
                 <button 
                    onClick={onImportBook}
                    className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-xl font-bold uppercase text-xs tracking-wider border-2 border-white hover:bg-gray-200 transition-colors"
                >
                    <Upload size={16} strokeWidth={3}/>
                    <span className="hidden md:inline">Import</span>
                </button>
                
                <div className="hidden md:flex items-center bg-[#1C1C1E] border border-[#2A2A2D] rounded-xl px-4 py-2 w-64">
                    <Search size={16} className="text-gray-500 mr-2" />
                    <input 
                        type="text" 
                        placeholder="SEARCH COLLECTION" 
                        className="bg-transparent border-none outline-none text-xs font-bold text-white placeholder-gray-600 w-full uppercase"
                    />
                </div>
            </div>
        </div>

        <div className="flex space-x-3 overflow-x-auto pb-2">
            <FilterButton label="All Items" type="ALL" />
            <FilterButton label="Audio" type="AUDIO" />
            <FilterButton label="Reads" type="EBOOK" />
        </div>
      </div>
      
      {/* Empty State */}
      {!hasAnyLocal && (
        <div className="mb-12 bg-[#1C1C1E] border border-[#2A2A2D] p-8 rounded-[2rem] relative overflow-hidden flex flex-col items-start">
             <div className="absolute top-0 right-0 p-12 -mr-8 -mt-8 bg-[#9999FF] rounded-full blur-[80px] opacity-20"></div>
            <h2 className="text-2xl font-black mb-3 text-white uppercase">Your shelf is empty</h2>
            <p className="text-gray-400 max-w-lg mb-6 leading-relaxed">
                Import your own audiobooks and ebooks, or start your collection by downloading from our public domain archive.
            </p>
            <div className="flex space-x-4">
                <button 
                    onClick={onImportBook}
                    className="bg-[#CCFF00] text-black px-6 py-3 rounded-xl font-black uppercase text-xs tracking-wider shadow-[0_4px_0_#999] active:shadow-none active:translate-y-1 transition-all"
                >
                    Import Files
                </button>
            </div>
        </div>
      )}

      {/* Imported Books Section */}
      {importedBooks.length > 0 && (
        <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
                <div className="w-2 h-8 bg-white rounded-full"></div>
                <h2 className="text-xl font-black uppercase tracking-wider text-white">Your Imports</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {importedBooks.map((book) => (
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

      {/* Local Public Books Section */}
      {localPublicBooks.length > 0 && (
        <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
                <div className="w-2 h-8 bg-[#CCFF00] rounded-full"></div>
                <h2 className="text-xl font-black uppercase tracking-wider text-white">Local Storage</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {localPublicBooks.map((book) => (
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

      {/* Public Domain Available Section */}
      {availablePublicBooks.length > 0 && (
        <div>
             <div className="flex items-center space-x-3 mb-6">
                <div className="w-2 h-8 bg-[#9999FF] rounded-full"></div>
                <h2 className="text-xl font-black uppercase tracking-wider text-white">Public Archive</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                 {availablePublicBooks.map((book) => (
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
    </div>
  );
};