import React from 'react';
import { Home, Library, PlusCircle, BookOpen, Settings, Heart, Radio } from 'lucide-react';

interface SidebarProps {
  onAddBook: () => void;
  onGoHome: () => void;
  currentView: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onAddBook, onGoHome, currentView }) => {
  return (
    <div className="w-72 bg-[#121214] flex flex-col h-full flex-shrink-0 border-r border-[#2A2A2D]">
      <div className="p-8">
        <div className="flex items-center space-x-3 text-white mb-10">
            <div className="w-10 h-10 bg-[#CCFF00] rounded-xl flex items-center justify-center border-2 border-[#CCFF00] shadow-[0_0_15px_-5px_#CCFF00]">
                <span className="text-black font-black text-xl italic">N</span>
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">Narrivo</span>
        </div>

        <div className="space-y-2">
          <div 
            onClick={onGoHome}
            className={`flex items-center space-x-4 px-4 py-3 rounded-xl cursor-pointer transition-all border ${
              currentView === 'LIBRARY' 
                ? 'bg-[#1C1C1E] border-[#333] text-[#CCFF00]' 
                : 'border-transparent text-gray-400 hover:text-white hover:bg-[#1C1C1E]'
            }`}
          >
            <Home size={20} strokeWidth={2.5} />
            <span className="font-bold text-sm uppercase tracking-wider">Library</span>
          </div>
          
          <div className={`flex items-center space-x-4 px-4 py-3 rounded-xl cursor-pointer transition-all border ${
              currentView === 'READER'
                ? 'bg-[#1C1C1E] border-[#333] text-[#9999FF]' 
                : 'border-transparent text-gray-400 hover:text-white hover:bg-[#1C1C1E]'
            }`}>
            <BookOpen size={20} strokeWidth={2.5} />
            <span className="font-bold text-sm uppercase tracking-wider">Now Reading</span>
          </div>
          
          <div className="flex items-center space-x-4 px-4 py-3 rounded-xl cursor-pointer transition-all border border-transparent text-gray-400 hover:text-white hover:bg-[#1C1C1E]">
            <Settings size={20} strokeWidth={2.5} />
            <span className="font-bold text-sm uppercase tracking-wider">Settings</span>
          </div>
        </div>
      </div>

      <div className="mt-2 pt-6 px-4 border-t border-[#2A2A2D] flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-4 mb-6 text-gray-500">
          <span className="text-[10px] font-black tracking-[0.2em] uppercase">Collections</span>
          <button onClick={onAddBook} className="hover:text-[#CCFF00] transition-colors" title="Add New Book">
             <PlusCircle size={20} />
          </button>
        </div>

        <div className="space-y-2">
            <div className="flex items-center space-x-3 p-3 rounded-xl cursor-pointer bg-[#1C1C1E] border border-[#2A2A2D] group hover:border-[#CCFF00] transition-colors">
                <div className="bg-[#FF3366] w-8 h-8 rounded-lg flex items-center justify-center">
                    <Heart size={14} fill="white" className="text-white"/>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xs uppercase text-white group-hover:text-[#CCFF00]">Liked Books</span>
                  <span className="text-[10px] text-gray-500">12 items</span>
                </div>
            </div>
            
             <div className="flex items-center space-x-3 p-3 rounded-xl cursor-pointer hover:bg-[#1C1C1E] border border-transparent hover:border-[#2A2A2D] transition-colors text-gray-400 hover:text-white">
                <div className="bg-[#9999FF] w-8 h-8 rounded-lg flex items-center justify-center text-black">
                   <Radio size={14} strokeWidth={3} />
                </div>
                <span className="font-bold text-xs uppercase">Classics</span>
            </div>
        </div>
      </div>
      
      {/* Sidebar Footer / User Mock */}
      <div className="p-6 border-t border-[#2A2A2D]">
        <div className="flex items-center space-x-3 p-3 bg-[#1C1C1E] rounded-xl border border-[#2A2A2D]">
           <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#CCFF00] to-[#9999FF]"></div>
           <div className="flex flex-col">
             <span className="text-xs font-bold text-white uppercase">User Account</span>
             <span className="text-[10px] text-gray-500">Pro Plan</span>
           </div>
        </div>
      </div>
    </div>
  );
};