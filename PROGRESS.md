# Narrivo - Development Progress

## Current Status: Core Architecture Complete ✅

### Completed (2025-12-03)

#### ✅ Core Type System
- **File**: `src/types/index.ts`
- Enhanced `Book` interface with Android-ready file paths
- Added `Bookmark` interface for user annotations
- Updated `PlayerState` and `ViewMode` enums

#### ✅ Design System
- **File**: `src/theme/neoBrutalism.ts`
- Comprehensive Neo-Brutalism theme (colors, typography, spacing)
- Mobile-optimized values for Android
- Hard shadows and high-contrast accents (lime, periwinkle, pink)

#### ✅ State Management
- **File**: `src/store/booksStore.ts`
- Zustand-based book store
- File merging logic (audio + eBook → HYBRID)
- Bookmark and last-position tracking

#### ✅ File Matching Logic
- **Files**: `src/utils/metadata.ts`, `src/utils/matching.ts`
- Metadata extraction from filenames
- Exact and fuzzy matching algorithms
- Confidence scoring for match suggestions

---

## Project Structure

```
/narrivo
├── /src                        # New React Native-ready architecture
│   ├── /types
│   │   └── index.ts           ✅ Enhanced Book model
│   ├── /theme
│   │   └── neoBrutalism.ts    ✅ Design system
│   ├── /store
│   │   └── booksStore.ts      ✅ Zustand state
│   ├── /utils
│   │   ├── metadata.ts        ✅ Filename parsing
│   │   └── matching.ts        ✅ File matching
│   ├── /services
│   │   ├── index.ts           ✅ Barrel export
│   │   ├── storageService.ts  ✅ Bookmarks/positions
│   │   ├── fileService.ts     ✅ File picking
│   │   ├── audioService.ts    ✅ Audio playback
│   │   └── downloadService.ts ✅ Public domain
│   ├── /screens               🚧 Coming next
│   └── /components            🚧 Coming next
│
├── /components                 # Legacy web components (reference)
├── App.tsx                     # Legacy web app
├── types.ts                    # Legacy types
└── package.json
```

---

## Next Steps

### Phase 4: Services Layer ✅ COMPLETE
- [x] `audioService.ts` - expo-av based playback with background support
- [x] `fileService.ts` - expo-document-picker for Android file picking
- [x] `downloadService.ts` - Public domain downloads with progress tracking
- [x] `storageService.ts` → `booksStore.ts` - Zustand + AsyncStorage persistence

### Phase 5: UI Components ✅ MOSTLY COMPLETE
- [x] `LibraryScreen` with Neo-Brutalism styling (React Native)
- [x] `ReaderScreen` with EPUB support (@epubjs-react-native/core)
- [x] `ReadAlongScreen` with sync highlighting (demo paragraphs)
- [x] `BottomPlayer` with expandable controls
- [x] `PlayerScreen` (new - full-screen audio controls)
- [x] `SettingsScreen` (new - app settings)
- [x] **Navigation setup** - Tab + Stack hybrid with @react-navigation

### Phase 6: Production Polish (NEXT)
- [x] Upgrade to `react-native-track-player` for robust background audio ✅
- [ ] Extract real text from EPUB for Read-Along (not demo paragraphs)
- [ ] Implement text-to-audio timestamp alignment algorithm
- [ ] Add sleep timer and bookmarks UI
- [ ] Performance optimization and testing

---

## Key Decisions Made

1. **Incremental Migration**: Building new `/src` structure alongside existing web app
2. **File Paths over URLs**: Using Android file URIs (`audiobookPath`, `ebookPath`)
3. **Intelligent Matching**: Fuzzy matching with confidence scoring (threshold: 0.7)
4. **Type Safety**: Full TypeScript with Zustand for state management

---

## Dependencies Needed (Phase 4+)

```json
{
  "zustand": "^4.4.7",
  "@react-native-async-storage/async-storage": "^1.21.0",
  "react-native-document-picker": "^9.1.1",
  "react-native-fs": "^2.20.0",
  "react-native-track-player": "^4.0.1",
  "react-native-pdf": "^6.7.3"
}
```

---

## Questions for Later

- EPUB renderer: `epubjs` vs `react-native-epub-reader`?
- Audio library: `react-native-track-player` vs `expo-av`?
- Navigation: Stack vs Tab navigator for main UI?
