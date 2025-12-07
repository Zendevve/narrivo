# AGENTS.md — Narrivo

> This file defines how AI coding agents work in this repository.
> It follows the [MCAF Framework](https://managedcode.dev/mcaf).

## Project Overview

**Narrivo** is a modern audiobook + eBook player with intelligent Read-Along sync.

**Architecture:**
- **`/narrivo`** — Web demo (Vite + React)
- **`/narrivo-expo`** — Mobile app (Expo + React Native)
- **Shared concepts** — Neo-Brutalism theme, Zustand state, TypeScript types

**Key Features:**
- Audio playback with background support
- EPUB/PDF reading
- Read-Along sync (text highlighting with audio)
- Public-domain library (LibriVox, Project Gutenberg)

---

## Development Flow

1. **Read docs first** — Check `docs/Features/` for feature specs before coding
2. **Plan before coding** — Non-trivial changes need a plan documented in PR or issue
3. **Write tests with code** — Tests and implementation move together
4. **Run verification** — Build, lint, and test before considering work complete
5. **Update docs** — Keep feature docs and this file current

---

## Commands

### Web App (`/narrivo`)
```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run lint         # Run ESLint
```

### Mobile App (`/narrivo-expo`)
```bash
cd narrivo-expo
npm install          # Install dependencies
npx expo start       # Start Metro bundler
npx eas build --platform android --profile preview  # Build preview APK
npx eas build --platform android --profile production  # Build production APK
```

---

## Testing Discipline

### Test Levels
1. **Unit tests** — Pure logic (matching algorithm, utilities)
2. **Integration tests** — Component interactions with stores
3. **E2E tests** — Full user flows (Detox for mobile when implemented)

### Running Tests
```bash
npm test             # Run all tests
npm test -- --watch  # Watch mode
```

### Test Philosophy
- Prefer integration/E2E tests for user-facing behavior
- Unit tests for complex internal logic only
- No mocking internal systems in primary test suites

---

## Coding Rules

### TypeScript
- **Strict mode enabled** — No `any` types without justification
- **Explicit return types** — Functions should declare return types
- **Interface over type** — Prefer `interface` for object shapes

### React / React Native
- **Functional components only** — No class components
- **Hooks for state** — Use Zustand for global, useState for local
- **Memoization** — Use `useMemo`/`useCallback` for expensive computations

### File Organization
```
/src
├── /components     # Reusable UI (Button, Card, Icons)
├── /screens        # Full-page views (Library, Reader, ReadAlong)
├── /services       # Business logic (audio, files, downloads)
├── /store          # Zustand stores
├── /theme          # Design tokens and styles
├── /types          # TypeScript interfaces
└── /utils          # Pure utility functions
```

### Naming Conventions
- **Files:** PascalCase for components (`BookCard.tsx`), camelCase for utils (`matching.ts`)
- **Components:** PascalCase (`LibraryScreen`, `BottomPlayer`)
- **Functions:** camelCase (`extractMetadata`, `matchBooks`)
- **Constants:** SCREAMING_SNAKE_CASE (`PRIMARY_COLOR`, `MAX_RETRY`)

---

## Neo-Brutalism Design System

### Colors
```typescript
background: '#121214'     // Deep charcoal
surface: '#1E1E22'        // Card backgrounds
primary: '#CCFF00'        // Lime accent
secondary: '#9999FF'      // Periwinkle
tertiary: '#FF99CC'       // Soft pink
text: '#FFFFFF'           // Primary text
textSecondary: '#888888'  // Muted text
```

### Styling Rules
- **Hard shadows** — 4px solid black, no blur
- **Bold borders** — 2-3px black outlines
- **Rounded corners** — 24-32px radius
- **All-caps headers** — Use Inter Black with tight tracking

---

## Maintainer Preferences

- **Commit messages:** Conventional commits (`feat:`, `fix:`, `docs:`)
- **PR size:** Keep PRs focused, < 400 lines when possible
- **Comments:** Explain "why", not "what"
- **TODOs:** Include GitHub issue link or date

---

## Self-Learning Rules

When receiving feedback:
1. **Directive feedback** → Add as a rule in the relevant section
2. **Recurring patterns** → Promote to a documented rule
3. **Corrections** → Update coding rules to prevent recurrence
4. **Process feedback** → Update Development Flow section

Feedback is NOT memory. Stable patterns become documented rules here.

---

## AGENTS.md Governance

- **Owner:** @Zendevve
- Changes require review and approval
- AI agents may propose changes; humans merge them
