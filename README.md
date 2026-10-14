# ⏳ Lumen — Study Timer

> **One orbit per session. Keep the lamp on until the ring closes.**

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen.svg?style=flat-square)](https://saidul2017.github.io/submit-challenge/)
[![Deploy Status](https://github.com/saidul2017/submit-challenge/actions/workflows/deploy.yml/badge.svg)](https://github.com/saidul2017/submit-challenge/actions/workflows/deploy.yml)
[![Built with React](https://img.shields.io/badge/React-19-61dafb.svg?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff.svg?style=flat-square&logo=vite)](https://vite.dev/)

**Lumen** is a minimalist, distraction-free study and productivity timer inspired by celestial orbits. Designed to help students, developers, and creators maintain deep focus sessions with zero clutter, zero telemetry, and instantaneous responsiveness.

---

## 🌐 Live Demo

👉 **Try it here:** [https://saidul2017.github.io/submit-challenge/](https://saidul2017.github.io/submit-challenge/)

---

## ✨ Key Features

- 🎯 **Flexible Work & Rest Modes**: Quick-switch between **Focus** (25:00), **Short Break** (5:00), and **Long Break** (15:00).
- 🪐 **Dynamic Orbit Progress Ring**: Smooth SVG circular progress indicator that visually traces your session's orbit with a luminous glow.
- 🔔 **Synthesized Audio Chime**: Native Web Audio API chime (528 Hz gentle sine tone) signals session completion without requiring heavy external audio files.
- 📝 **Focus Session Notes**: Attach context to each block (e.g., *"React hooks, chapter 4"* or *"Refactoring auth middleware"*) before finishing.
- 📊 **Daily Stats & Recent Orbits**: Real-time counter of completed sessions for the day, alongside a chronological history log.
- 🔒 **Privacy-First & Offline Ready**: All session logs persist entirely in `localStorage`—no cookies, no third-party tracking, no backend database required.
- 🎨 **Sleek Aesthetic Design**: Dark celestial palette using Syne, Figtree, and IBM Plex Mono typography, optimized for night study sessions and low eye strain.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling**: [Vite 8](https://vite.dev/), [Oxlint](https://oxc.rs/)
- **Audio Engine**: Web Audio API (Native browser oscillator)
- **Deployment & CI/CD**: GitHub Actions & GitHub Pages

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or higher recommended)
- `npm`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/saidul2017/submit-challenge.git
   cd submit-challenge
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

The production assets will be bundled into the `dist/` directory.

### Code Quality & Linting

```bash
npm run lint
```

---

## 📄 License

MIT License © 2026 saidul2017
