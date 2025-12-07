<div align="center">

# 📚 Narrivo

**The Ultimate Cross-Platform Audiobook & eBook Reader**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![Expo](https://img.shields.io/badge/Expo-50.0-black?logo=expo)](https://expo.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite)](https://vitejs.dev/)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Architecture](#-architecture) • [Roadmap](#-roadmap)

</div>

---

## 🎯 Overview

**Narrivo** is a next-generation reading experience that unifies your audiobooks and eBooks. Whether you're on the web or on the go with your mobile device, Narrivo provides a seamless, synced **Read-Along** experience.

Designed with a bold **Neo-Brutalism** aesthetic, Narrivo isn't just a tool—it's a statement.

### Why Narrivo?
- **🎵📖 Read-Along Sync**: Import an audiobook and its matching eBook, and Narrivo intelligently syncs them. Listen while the text highlights in real-time.
- **📱💻 Cross-Platform**:
  - **Web**: Blazing fast, built with React + Vite.
  - **Mobile**: Native performance on Android/iOS via Expo.
- **🎨 Neo-Brutalism Design**: High contrast, vibrant colors, and sharp edges for a modern, tactile feel.
- **🔒 Privacy First**: Your library lives on your device. Zero tracking, zero cloud dependency.

---

## ✨ Features

### 🎧 Unified Player
- Supports **EPUB**, **PDF**, **MP3**, and **M4B**.
- Intelligent **Fuzzy Matching**: Automatically links `book.mp3` with `book.epub` specifically for Read-Along mode.
- Variable playback speed (0.5x – 3.0x), sleep timer, and bookmarks.

### 📱 Mobile Experience (Expo)
- **Offline-First**: Download books once, read anywhere.
- **Background Audio**: Keep listening while using other apps or with the screen off.
- **Native Filesystem**: Securely access your local documents.

### 💻 Web Experience (React + Vite)
- **Instant Load**: Optimized for desktop reading.
- **Drag & Drop**: Easily manage your library with a simple drag-and-drop interface.
- **Responsive Layout**: Adjusts perfectly to any screen size.

---

## 🛠 Tech Stack

Narrivo utilizes a modern monorepo-style structure to share logic and design principles across platforms.

| Category | Technology | Usage |
|----------|------------|-------|
| **Core** | **TypeScript** | End-to-end type safety |
| **State** | **Zustand** | Lightweight, predictable state management |
| **Web** | **React 19**, **Vite** | High-performance browser application |
| **Mobile** | **Expo**, **React Native** | Native Android application framework |
| **Parsing** | **epubjs**, **react-native-pdf** | Robust document rendering |
| **Design** | **CSS Modules** / **Native Styles** | Custom Neo-Brutalism design system |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+
- **npm** or **yarn**
- **Git**

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Zendevve/narrivo.git
cd narrivo
```

### 2️⃣ Run the Web Application
The web app is located in the root directory.

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```
Visit `http://localhost:5173` to view the app.

### 3️⃣ Run the Mobile Application
The mobile app is located in the `narrivo-expo` directory.

```bash
# Navigate to mobile directory
cd narrivo-expo

# Install dependencies
npm install

# Start Expo
npx expo start
```
- Press `a` to run on **Android Emulator**.
- Scan the QR code with **Expo Go** on your physical device.

---

## 🏗 Architecture

```text
/narrivo
├── /src              # Web Application Source
│   ├── /components   # React Web Components
│   ├── /store        # Shared Zustand Store (Web)
│   └── main.tsx      # Web Entry Point
├── /narrivo-expo     # Mobile Application Source
│   ├── /App.tsx      # Mobile Entry Point
│   └── /components   # React Native Components
├── /docs             # Documentation & Specs
└── README.md         # You are here
```

---

## 🗺 Roadmap

- [x] **Core Architecture**: Web and Mobile environments set up.
- [x] **Design System**: Neo-Brutalism theme implementation.
- [ ] **Read-Along Engine**:
    - [ ] Text-Audio alignment algorithm.
    - [ ] Sync calibration UI.
- [ ] **Library Management**:
    - [ ] Metadata editing.
    - [ ] Collections/Tags.
- [ ] **Cross-Platform Sync**: (Future) Optional cloud save for reading progress.

---

## 🤝 Contributing

We welcome contributions! Whether it's fixing bugs, improving documentation, or proposing new features, your help is appreciated.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

---

<div align="center">

**Made with ❤️ by the Narrivo Team**

</div>
