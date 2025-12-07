# Development Guide

## Prerequisites

- **Node.js** 18+ and npm
- **Git**
- For mobile: **Expo CLI** and EAS CLI

## Quick Start

### Web Demo

```bash
# Clone and install
git clone https://github.com/Zendevve/narrivo.git
cd narrivo
npm install

# Start dev server
npm run dev
```

### Mobile App

```bash
cd narrivo-expo
npm install

# Start Expo
npx expo start

# Or build preview APK
npx eas build --platform android --profile preview
```

## Commands Reference

### Web (`/narrivo`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |

### Mobile (`/narrivo-expo`)

| Command | Description |
|---------|-------------|
| `npx expo start` | Start Metro bundler |
| `npx expo start --android` | Start with Android emulator |
| `npx eas build --profile preview` | Build preview APK |
| `npx eas build --profile production` | Build production APK |

## Project Structure

See [Architecture Overview](../Architecture/overview.md) for detailed structure.

## Branching Strategy

- `main` — Production-ready code
- `develop` — Integration branch
- `feature/*` — Feature branches
- `fix/*` — Bug fix branches

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add Read-Along sync adjustment
fix: audio playback stops on background
docs: update development guide
refactor: extract matching logic to utils
```
