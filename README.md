<div align="center">

# 📚 Narrivo

**The Ultimate Cross-Platform Audiobook & eBook Reader**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![Expo](https://img.shields.io/badge/Expo-52-black?logo=expo)](https://expo.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite)](https://vitejs.dev/)

[Features](#-features) • [Mobile App](#-mobile-app) • [Getting Started](#-getting-started) • [Roadmap](#-roadmap)

</div>

---

## 🎯 Overview

**Narrivo** is a next-generation reading experience that unifies your audiobooks and eBooks. Whether you're on the web or on the go with your mobile device, Narrivo provides a seamless, synced **Read-Along** experience.

Designed with a bold **Neo-Brutalism** aesthetic, Narrivo isn't just a tool—it's a statement.

### Why Narrivo?
- **🎵📖 Read-Along Sync**: Import an audiobook and its matching eBook, and Narrivo intelligently syncs them. Listen while the text highlights in real-time.
- **📱💻 Cross-Platform**: Web (React + Vite) and Mobile (Expo/React Native).
- **🎨 Neo-Brutalism Design**: High contrast, vibrant colors, sharp edges.
- **🔒 Privacy First**: Your library lives on your device. Zero tracking, zero cloud dependency.

---

## ✨ Features

### 🎧 Unified Player
| Feature | Description |
|---------|-------------|
| **Multi-format** | EPUB, PDF, MP3, M4B support |
| **Fuzzy Matching** | Auto-links `book.mp3` with `book.epub` for Read-Along |
| **Playback Speed** | 0.75x – 2.0x variable speed |
| **Sleep Timer** | 5/15/30/45/60 min presets with countdown |
| **Bookmarks** | One-tap save with auto-position tracking |

### 📖 Read-Along Mode
- Real-time text highlighting synced to audio
- Tap any paragraph to jump to that position
- Chapter navigation with prev/next controls
- Auto-scroll follows current paragraph

---

## 📱 Mobile App

The Narrivo mobile app is built with **Expo** and **React Native**.

### Current Features ✅

| Screen | Features |
|--------|----------|
| **Library** | Import books, download public domain titles, filter by type |
| **Reader** | EPUB rendering with font controls, chapter navigation |
| **Player** | Full audio controls, speed selection, sleep timer, bookmarks |
| **Read-Along** | Synced text + audio with paragraph highlighting |
| **Settings** | Playback preferences, storage management |

### Navigation
- **Tab-based**: Library, Player, Settings
- **Stack navigation**: Drill down to Reader/Read-Along from any tab

### Public Domain Books
Download free classics directly in the app:
- Pride and Prejudice
- Frankenstein
- Alice in Wonderland
- *(More coming)*

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Core** | TypeScript |
| **State** | Zustand + AsyncStorage |
| **Web** | React 19, Vite |
| **Mobile** | Expo 52, React Native |
| **EPUB** | @epubjs-react-native/core |
| **Audio** | expo-av |
| **Navigation** | @react-navigation (Tab + Stack) |
| **Design** | Neo-Brutalism custom theme |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+
- **npm** or **yarn**

### Run the Web App
```bash
git clone https://github.com/Zendevve/narrivo.git
cd narrivo
npm install
npm run dev
```
Visit `http://localhost:5173`

### Run the Mobile App
```bash
cd narrivo-expo
npm install
npx expo start
```
- Scan QR with **Expo Go** on your phone
- Or run `npx expo run:android` for development build

### Build APK (EAS)
```bash
cd narrivo-expo
npx eas-cli build --platform android --profile development
```

---

## 🗺 Roadmap

### Completed ✅
- [x] Core architecture (Web + Mobile)
- [x] Neo-Brutalism design system
- [x] Library management with import/download
- [x] EPUB reader with @epubjs-react-native
- [x] Audio player with expo-av
- [x] Read-Along mode with text highlighting
- [x] Sleep timer and bookmarks
- [x] Tab + Stack navigation
- [x] EAS Build configuration

### In Progress 🚧
- [ ] Text-to-audio timestamp alignment (word-level sync)
- [ ] Bookmarks list UI (view/jump to saved bookmarks)
- [ ] react-native-track-player (lock screen controls)

### Future 🔮
- [ ] iOS support
- [ ] Metadata editing
- [ ] Collections/Tags
- [ ] Optional cloud sync

---

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

<div align="center">

**Made with ❤️ by the Narrivo Team**

</div>
