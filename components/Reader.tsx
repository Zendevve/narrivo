import React, { useState } from 'react';
import { Book } from '../types';
import { ArrowLeft, Type } from 'lucide-react';

interface ReaderProps {
  book: Book;
  currentTime: number;
  isPlaying: boolean;
  onSeek: (time: number) => void;
  onClose: () => void;
}

export const Reader: React.FC<ReaderProps> = ({ book, onClose }) => {
  const [fontSize, setFontSize] = useState(18);

  return (
    <div className="flex-1 bg-black text-white flex flex-col h-full relative overflow-hidden">
      {/* Reader Header */}
      <div className="h-16 border-b border-[#282828] flex items-center justify-between px-6 bg-black z-10 shrink-0">
        <button onClick={onClose} className="text-gray-400 hover:text-white flex items-center space-x-2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <span className="font-semibold text-sm truncate max-w-md">{book.title}</span>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setFontSize(Math.max(14, fontSize - 2))}
            className="text-gray-400 hover:text-white"
          >
            A-
          </button>
          <Type size={18} className="text-gray-400" />
          <button 
            onClick={() => setFontSize(Math.min(32, fontSize + 2))}
            className="text-gray-400 hover:text-white"
          >
            A+
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Text Content */}
        <div 
          className="flex-1 overflow-y-auto p-8 md:p-12 max-w-4xl mx-auto scroll-smooth"
        >
          <div 
            className="leading-loose transition-all duration-200 font-serif"
            style={{ fontSize: `${fontSize}px` }}
          >
             {!book.textContent ? (
               <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                 <p>No text content available for this title.</p>
               </div>
             ) : (
              // Standard eBook Mode
              <p className="text-gray-300 whitespace-pre-wrap">{book.textContent}</p>
            )}
          </div>
        </div>
        
        {/* Sidebar Actions (Desktop) */}
        <div className="hidden lg:block w-64 border-l border-[#282828] p-6 bg-[#0a0a0a]">
           <div className="space-y-6">
              <div className="bg-[#181818] p-4 rounded-lg">
                <img src={book.coverUrl} className="w-full aspect-square object-cover rounded shadow-lg mb-4" alt="cover" />
                <h3 className="font-bold text-white mb-1">{book.title}</h3>
                <p className="text-sm text-gray-400">{book.author}</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};