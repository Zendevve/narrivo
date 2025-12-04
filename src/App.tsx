import React, { useState } from 'react';
import { LibraryScreen } from './screens/LibraryScreen';
import { ReaderScreen } from './screens/ReaderScreen';
import { BottomPlayer } from './components/BottomPlayer';
import { Book, ViewMode } from './types';
import { colors } from './theme/neoBrutalism';

export const NarrivoApp: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewMode>(ViewMode.LIBRARY);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);

  const handleSelectBook = (book: Book) => {
    setCurrentBook(book);
  };

  const handleOpenReader = (book?: Book) => {
    if (book) setCurrentBook(book);
    setActiveView(ViewMode.READER);
  };

  const handleCloseReader = () => {
    setActiveView(ViewMode.LIBRARY);
  };

  return (
    <div style={styles.container}>
      {activeView === ViewMode.READER && currentBook ? (
        <ReaderScreen book={currentBook} onClose={handleCloseReader} />
      ) : (
        <LibraryScreen
          onSelectBook={handleSelectBook}
          onOpenReader={handleOpenReader}
        />
      )}

      <BottomPlayer
        currentBook={currentBook}
        onOpenReader={() => handleOpenReader()}
      />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: colors.bg,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    overflow: 'hidden',
  },
};

export default NarrivoApp;
