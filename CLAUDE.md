# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Portfolio website built with React 19, TypeScript, Vite, and Tailwind CSS v4. Single-page application deployed to GitHub Pages via GitHub Actions.

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Type check and build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

## Architecture

### Tech Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite with HMR
- **Styling**: Tailwind CSS v4 (via @tailwindcss/vite plugin)
- **Routing**: React Router v7
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Project Structure

```
src/
├── pages/         # Route components (Home.tsx)
├── components/    # Reusable UI components (Hero, Navbar, Footer, etc.)
├── data/          # Static data (experiences.ts with ExperienceItem interface)
├── main.tsx       # React entry point
├── App.tsx        # Root component with Router and global layout
└── index.css      # Tailwind directives
```

### Component Organization
- **App.tsx**: Root component containing Router, Navbar, Routes, and Footer. Applies global dark theme (`bg-stone-950`, `text-stone-100`) with orange selection colors.
- **pages/Home.tsx**: Composes main content sections (Hero, About, VisualResume, Gallery).
- **Data-driven**: Experience data is centralized in `src/data/experiences.ts` with TypeScript interfaces.

### Styling Conventions
- Uses Tailwind v4 with custom dark theme based on stone and orange palette.
- Selection styles: `selection:bg-orange-500 selection:text-white` applied globally.
- Utility helpers: `clsx` and `tailwind-merge` available for conditional classes.

### Deployment
- Automated via `.github/workflows/deploy.yml` on push to `main` branch.
- Builds to `dist/` and deploys to GitHub Pages.
- Node 20 used in CI.

## Key Considerations

### TypeScript Configuration
- Dual tsconfig setup: `tsconfig.app.json` for source, `tsconfig.node.json` for build tools.
- Strict mode enabled.

### ESLint
- Flat config format (`eslint.config.js`).
- TypeScript ESLint with React hooks and React refresh plugins.
- Ignores `dist/` directory.

### Vite Configuration
- Uses `@vitejs/plugin-react` for Babel-based Fast Refresh.
- Tailwind CSS integrated via `@tailwindcss/vite` plugin (v4 approach, not PostCSS).
