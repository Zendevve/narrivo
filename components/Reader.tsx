import React, { useState } from 'react';
import { Book } from '../types';
import { ArrowLeft, Type, Minus, Plus } from 'lucide-react';

interface ReaderProps {
  book: Book;
  currentTime: number;
  isPlaying: boolean;
  onSeek: (time: number) => void;
  onClose: () => void;
}

export const Reader: React.FC<ReaderProps> = ({ book, onClose }) => {
  const [fontSize, setFontSize] = useState(20);

  return (
    <div className="flex-1 bg-[#121214] text-white flex flex-col h-full relative overflow-hidden">
      {/* Reader Header */}
      <div className="h-20 border-b border-[#2A2A2D] flex items-center justify-between px-6 bg-[#1C1C1E] z-10 shrink-0">
        <button 
          onClick={onClose} 
          className="bg-[#2A2A2D] hover:bg-[#333] text-white flex items-center space-x-2 px-4 py-2 rounded-xl font-bold uppercase text-xs tracking-wider transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={3} />
          <span>Library</span>
        </button>
        
        <div className="flex flex-col items-center">
             <span className="font-black uppercase tracking-tight text-sm md:text-base">{book.title}</span>
             <span className="text-[10px] font-bold text-[#9999FF] tracking-[0.2em] uppercase">Reading Mode</span>
        </div>

        <div className="flex items-center space-x-2 bg-[#2A2A2D] p-1 rounded-xl">
          <button 
            onClick={() => setFontSize(Math.max(14, fontSize - 2))}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black text-gray-400 hover:text-white"
          >
            <Minus size={14} />
          </button>
          <div className="flex items-center justify-center w-6">
            <Type size={16} className="text-[#CCFF00]" />
          </div>
          <button 
            onClick={() => setFontSize(Math.min(32, fontSize + 2))}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black text-gray-400 hover:text-white"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Text Content */}
        <div 
          className="flex-1 overflow-y-auto p-6 md:p-12 max-w-3xl mx-auto scroll-smooth"
        >
          <div 
            className="leading-relaxed transition-all duration-200 font-medium tracking-wide text-[#E4E4E7]"
            style={{ fontSize: `${fontSize}px`, fontFamily: 'Inter, sans-serif' }}
          >
             {!book.textContent ? (
               <div className="flex flex-col items-center justify-center h-64 text-gray-500 border-2 border-dashed border-[#2A2A2D] rounded-3xl mt-12">
                 <p className="uppercase font-bold tracking-widest">No text content available</p>
               </div>
             ) : (
              // Standard eBook Mode
              <p className="whitespace-pre-wrap">{book.textContent}</p>
            )}
          </div>
          
          <div className="h-32"></div> {/* Spacer for bottom player */}
        </div>
        
        {/* Sidebar Info (Desktop) */}
        <div className="hidden lg:block w-80 border-l border-[#2A2A2D] p-8 bg-[#18181B]">
           <div className="sticky top-8 space-y-6">
              <div className="bg-[#1C1C1E] p-4 rounded-[2rem] border border-[#2A2A2D] shadow-xl">
                <img src={book.coverUrl} className="w-full aspect-square object-cover rounded-2xl mb-4 grayscale hover:grayscale-0 transition-all duration-500" alt="cover" />
                <h3 className="font-black text-white text-lg uppercase leading-none mb-2">{book.title}</h3>
                <p className="text-xs font-bold text-[#CCFF00] uppercase tracking-wider">{book.author}</p>
              </div>
              
              <div className="bg-[#2A2A2D] p-4 rounded-2xl">
                 <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Progress</div>
                 <div className="w-full bg-[#1C1C1E] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#9999FF] h-full w-[45%]"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};