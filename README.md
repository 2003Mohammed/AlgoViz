# 🚀 AlgoViz – Visualize Data Structures & Algorithms Like Never Before

AlgoViz is an interactive platform for learning Data Structures and Algorithms through clear, animated, step-by-step visualizations.

## 🌐 Live Demo
https://algoviz-lab.vercel.app

## 📸 Preview
![AlgoViz Demo](./public/preview.gif)

> Note: `./public/preview.gif` is referenced intentionally for repository presentation, but binary assets are not included in this PR.

## 📚 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture Overview](#-architecture-overview)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Roadmap](#-roadmap)
- [Asset Setup (Manual)](#-asset-setup-manual)
- [Contributing](#-contributing)
- [License](#-license)

## 🔍 Overview
AlgoViz focuses on making DSA fundamentals easier to understand through visual interaction instead of static theory alone.

## ✨ Key Features
- Visualizers for core data structures and algorithms
- Step controls for learning each operation incrementally
- Route-level separation between Data Structures and Algorithms
- Real-world context and complexity notes to reinforce understanding
- Theme-aware UI with smooth, minimal motion

## 🧠 Architecture Overview
- Modular visualization components by concept (data structure/algorithm)
- Route-based page separation for learning paths
- Assistant routing logic isolated from UI trigger components
- Deterministic-first assistant decision flow
- Animation layer powered by Framer Motion

## 🧑‍💻 Tech Stack
- **Frontend:** React + TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Build Tool:** Vite
- **Deployment:** Vercel

## 🚦 Getting Started
### 1) Clone
```bash
git clone https://github.com/2003Mohammed/AlgoViz.git
cd AlgoViz
```

### 2) Install dependencies
```bash
npm install
```

### 3) Start development server
```bash
npm run dev
```

Open http://localhost:5173

## 📁 Project Structure
```text
src/
  components/
  pages/
  assistant/
  hooks/
  utils/
public/
```

## 📌 Roadmap
- [ ] Expand advanced graph/pathfinding visualizations
- [ ] Add richer custom-input workflows across all modules
- [ ] Add export/share support for learning sessions
- [ ] Add deeper walkthrough guides for each topic
- [ ] Improve mobile-first interaction polishing

## 🧩 Asset Setup (Manual)
This PR references static assets without committing binaries.

Place the following files in `/public` when uploading through GitHub web UI or another method:
- `preview.gif`
- `preview.png` (for social sharing image)
- `favicon.ico`
- `algoviz_favicon_16x16.png`
- `algoviz_favicon_32x32.png`
- `algoviz_favicon_48x48.png`
- `algoviz_favicon_64x64.png`
- `algoviz_favicon_128x128.png`
- `algoviz_favicon_256x256.png`
- `apple-touch-icon.png`

After upload, verify `index.html` references remain correct and all files are accessible under `https://algoviz-lab.vercel.app/<asset-name>`.

## 🙌 Contributing
Contributions are welcome.

1. Fork the repository
2. Create a branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m "feat: your change"`
4. Push branch: `git push origin feature-name`
5. Open a Pull Request

## 📜 License
MIT License.

Keep exploring, keep building, and keep mastering DSA fundamentals through visualization.
