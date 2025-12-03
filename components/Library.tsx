import React, { useState } from 'react';
import { Book } from '../types';
import { Play, BookOpen, Headphones } from 'lucide-react';

interface LibraryProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
}

export const Library: React.FC<LibraryProps> = ({ books, onSelectBook }) => {
  const [filter, setFilter] = useState<'ALL' | 'AUDIO' | 'EBOOK'>('ALL');

  const filteredBooks = books.filter(b => {
    if (filter === 'ALL') return true;
    if (filter === 'AUDIO') return b.type === 'AUDIO' || b.type === 'HYBRID';
    if (filter === 'EBOOK') return b.type === 'EBOOK' || b.type === 'HYBRID';
    return true;
  });

  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';

  return (
    <div className="flex-1 bg-gradient-to-b from-[#1e1e1e] to-[#121212] overflow-y-auto p-8 pb-32">
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
      
      {filteredBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-[#181818]/50 rounded-lg border border-dashed border-[#333]">
            <p className="mb-2 font-medium">No items found</p>
            <p className="text-sm">Try changing the filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredBooks.map((book) => (
            <div 
              key={book.id}
              onClick={() => onSelectBook(book)}
              className="group bg-[#181818] hover:bg-[#282828] rounded-md p-4 transition-all duration-300 cursor-pointer relative"
            >
              <div className="relative aspect-square w-full mb-4 shadow-lg rounded overflow-hidden">
                <img 
                  src={book.coverUrl} 
                  alt={book.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Type Badge */}
                <div className="absolute top-2 left-2">
                    {book.type === 'AUDIO' && <div className="bg-black/60 p-1.5 rounded-full backdrop-blur-sm"><Headphones size={12} className="text-white"/></div>}
                    {book.type === 'EBOOK' && <div className="bg-black/60 p-1.5 rounded-full backdrop-blur-sm"><BookOpen size={12} className="text-white"/></div>}
                    {book.type === 'HYBRID' && <div className="bg-black/60 p-1.5 rounded-full backdrop-blur-sm flex space-x-1"><Headphones size={12} className="text-white"/><BookOpen size={12} className="text-white"/></div>}
                </div>

                {/* Play Button Overlay */}
                {(book.type !== 'EBOOK') && (
                  <div className="absolute bottom-2 right-2 bg-[#1db954] rounded-full p-3 shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10 hover:scale-110">
                    <Play fill="black" size={20} className="text-black ml-0.5" />
                  </div>
                )}
              </div>
              <h3 className="font-bold text-white truncate mb-1">{book.title}</h3>
              <p className="text-sm text-gray-400 truncate">{book.author}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};