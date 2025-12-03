import React from 'react';
import { Home, Library, PlusCircle, BookOpen, Settings, Heart } from 'lucide-react';

interface SidebarProps {
  onAddBook: () => void;
  onGoHome: () => void;
  currentView: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onAddBook, onGoHome, currentView }) => {
  return (
    <div className="w-64 bg-black flex flex-col h-full flex-shrink-0 border-r border-[#282828]">
      <div className="p-6">
        <div className="flex items-center space-x-2 text-white mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-[#1db954] to-[#1ed760] rounded-full flex items-center justify-center font-bold text-black italic">
                N
            </div>
            <span className="text-xl font-bold tracking-tight">Narrivo</span>
        </div>

        <div className="space-y-4">
          <div 
            onClick={onGoHome}
            className={`flex items-center space-x-4 cursor-pointer transition-colors ${currentView === 'LIBRARY' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <Home size={24} />
            <span className="font-bold text-sm">Library</span>
          </div>
          <div className="flex items-center space-x-4 text-gray-400 hover:text-white cursor-pointer transition-colors">
            <BookOpen size={24} />
            <span className="font-bold text-sm">Now Reading</span>
          </div>
          <div className="flex items-center space-x-4 text-gray-400 hover:text-white cursor-pointer transition-colors">
            <Settings size={24} />
            <span className="font-bold text-sm">Settings</span>
          </div>
        </div>
      </div>

      <div className="mt-2 pt-4 px-2 border-t border-[#282828] flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-4 mb-4 text-gray-400">
          <span className="text-xs font-bold tracking-wider uppercase">Collections</span>
          <button onClick={onAddBook} className="hover:text-white" title="Add New Book">
             <PlusCircle size={20} />
          </button>
        </div>

        <div className="space-y-1 px-2">
            <div className="flex items-center space-x-3 p-3 rounded-md cursor-pointer hover:bg-[#282828] text-gray-400 hover:text-white transition-colors">
                <div className="bg-gradient-to-br from-purple-700 to-blue-500 w-6 h-6 rounded flex items-center justify-center">
                    <Heart size={12} fill="white" className="text-white"/>
                </div>
                <span className="font-medium text-sm">Liked Books</span>
            </div>
             <div className="p-3 rounded-md cursor-pointer hover:bg-[#282828] text-gray-400 hover:text-white transition-colors">
                <span className="font-medium text-sm">Classics</span>
            </div>
             <div className="p-3 rounded-md cursor-pointer hover:bg-[#282828] text-gray-400 hover:text-white transition-colors">
                <span className="font-medium text-sm">Sci-Fi & Fantasy</span>
            </div>
        </div>
      </div>
    </div>
  );
};