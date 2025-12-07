# Architecture Overview

## Monorepo Structure

```
/narrivo
├── /narrivo-expo        # Mobile app (Expo + React Native)
│   ├── /src
│   │   ├── /components  # Mobile UI components
│   │   ├── /screens     # Full-page views
│   │   ├── /services    # Audio, files, downloads
│   │   ├── /store       # Zustand state
│   │   ├── /theme       # Neo-Brutalism tokens
│   │   └── /types       # TypeScript interfaces
│   └── App.tsx          # Entry point
│
├── /src                 # Web demo (Vite + React)
│   ├── /components
│   ├── /screens
│   ├── /services
│   ├── /store
│   ├── /theme
│   └── /types
│
├── /docs                # MCAF documentation
├── AGENTS.md            # AI agent instructions
└── README.md            # Project overview
```

## State Management

Both apps use **Zustand** for state management with similar store structure:

```mermaid
flowchart LR
    subgraph Store
        A[booksStore]
        B[playerStore]
        C[settingsStore]
    end

    subgraph Components
        D[LibraryScreen]
        E[ReaderScreen]
        F[BottomPlayer]
    end

    A --> D
    A --> E
    B --> F
    B --> E
```

## File Matching Algorithm

When importing files, the system matches audio + text automatically:

```mermaid
flowchart TD
    A[Import File] --> B[Extract Metadata]
    B --> C{Exact title+author match?}
    C -->|Yes| D[Merge with existing book]
    C -->|No| E{Fuzzy match > 0.7?}
    E -->|Yes| F{Confidence > 0.9?}
    E -->|No| G[Create new book]
    F -->|Yes| D
    F -->|No| H[Prompt user to confirm]
    H --> D
    H --> G
```

## Key Services

| Service | Responsibility |
|---------|---------------|
| `audioService` | Playback control, background audio |
| `fileService` | File picker, metadata extraction |
| `downloadService` | Public domain content (LibriVox/Gutenberg) |
| `storageService` | Async storage persistence |
