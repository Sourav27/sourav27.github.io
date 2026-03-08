# Portfolio Full Redesign — Master Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild Sourav Debnath's portfolio with a premium monochrome editorial design, static pre-rendering for SEO, a Markdown-based content pipeline, and baseline security hygiene.

**Architecture:** React 19 + Vite SPA switched to `vite-ssg` for static pre-rendering. Components are rebuilt section-by-section against the Stitch design spec. Content moves from hardcoded TypeScript arrays into `content/*.md` files parsed at build time by `gray-matter`. All orange accent colors are removed in favour of a strictly monochrome stone palette.

**Tech Stack:** React 19, TypeScript, Vite + vite-ssg, Tailwind CSS v4 (`@tailwindcss/vite` — NOT PostCSS), Framer Motion, gray-matter, react-helmet-async, Inter (self-hosted woff2), JetBrains Mono (self-hosted woff2)

---

## Essential Reading Before Starting

Read these files first — they are the source of truth for every decision:

| File | Purpose |
|---|---|
| `docs/context/portfolio-design.md` | Design spec: palette, typography, every component's CSS |
| `docs/docs/plans/implementation-plan.md` | UI redesign task list with interaction standards |
| `docs/context/inspiration.md` | Edwin Le animation patterns (load sequence, scroll entry) |
| `docs/docs/context/sourav-resume-2026.md` | Real content — all copy must match this exactly |
| `docs/plans/2026-03-07-seo-content-security-design.md` | SEO/content/security decisions |

**Invariants — never break these:**
- `ExperienceItem` interface shape in `src/data/experiences.ts` — do not change it
- Flashlight cursor logic in `src/components/Hero.tsx` — preserve exactly
- `cursor-none` on the Hero container
- Tailwind v4 with `@tailwindcss/vite` plugin — never switch to PostCSS
- `whileInView` + `viewport={{ once: true, margin: "-50px" }}` as the scroll animation standard
- No accent color anywhere — zero `orange-*`, zero `#195de6` blue. Strictly stone palette.
- Never commit `dist/`

---

## Current State Snapshot

```
src/
├── App.tsx               ← has orange selection, BrowserRouter (to remove), no HelmetProvider
├── index.css             ← Google Fonts import (to replace), no design tokens
├── pages/Home.tsx        ← missing Marquee, Achievements, SelectedWork
└── components/
    ├── Navbar.tsx        ← full name logo (wrong), bad links, no mobile overlay → REBUILD
    ├── Hero.tsx          ← missing name+headline, no descriptors, orange cursor → PARTIAL REBUILD
    ├── About.tsx         ← orange accents, no stats, no education → REFACTOR
    ├── VisualResume.tsx  ← orange accents, wrong heading → RENAME to SelectedWork.tsx + REFACTOR
    ├── Gallery.tsx       ← hardcoded data, no grayscale → REFACTOR
    └── Footer.tsx        ← no CTA, no monogram → REBUILD
```

New files to create: `SEO.tsx`, `Marquee.tsx`, `Achievements.tsx`, `SelectedWork.tsx`, `src/lib/content.ts`, `content/` directory tree, `public/fonts/`, `public/sitemap.xml`, `public/robots.txt`

---

## Phase 0 — Install All Dependencies

### Task 0: Install packages

**Files:** `package.json`

**Step 1: Install all new runtime and dev packages in one command**

```bash
cd D:/sourav27.github.io
npm install vite-ssg react-helmet-async gray-matter
npm install --save-dev @types/gray-matter @fontsource/inter @fontsource/jetbrains-mono
```

**Step 2: Verify**

```bash
npm ls vite-ssg react-helmet-async gray-matter
```

Expected: all three listed with versions, zero `UNMET DEPENDENCY` warnings.

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install vite-ssg, react-helmet-async, gray-matter and font packages"
```

---

## Phase 1 — Foundation: CSS Tokens, Fonts, App.tsx

### Task 1: Rewrite `src/index.css`

**Files:**
- Modify: `src/index.css`
- Create: `public/fonts/` (copy woff2 files from node_modules)

**Step 1: Copy woff2 font files from fontsource packages**

```bash
mkdir -p D:/sourav27.github.io/public/fonts

# Inter weights
cp node_modules/@fontsource/inter/files/inter-latin-300-normal.woff2 public/fonts/inter-300.woff2
cp node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2 public/fonts/inter-400.woff2
cp node_modules/@fontsource/inter/files/inter-latin-500-normal.woff2 public/fonts/inter-500.woff2
cp node_modules/@fontsource/inter/files/inter-latin-600-normal.woff2 public/fonts/inter-600.woff2

# JetBrains Mono
cp node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2 public/fonts/jetbrains-mono-400.woff2
```

If the paths above don't exist, run `ls node_modules/@fontsource/inter/files/` to find the correct filenames.

**Step 2: Replace `src/index.css` entirely**

```css
/* ─── Self-hosted fonts ─────────────────────────────────────────── */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url('/fonts/inter-300.woff2') format('woff2');
}
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/inter-400.woff2') format('woff2');
}
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('/fonts/inter-500.woff2') format('woff2');
}
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/inter-600.woff2') format('woff2');
}
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/jetbrains-mono-400.woff2') format('woff2');
}

@import "tailwindcss";

/* ─── Design tokens ─────────────────────────────────────────────── */
[data-theme="dark"] {
  --color-bg-primary:      #0c0a09;
  --color-bg-secondary:    #1c1917;
  --color-text-primary:    #f5f5f4;
  --color-text-secondary:  #a8a29e;
  --color-text-muted:      #57534e;
  --color-border:          #292524;
}

[data-theme="light"] {
  --color-bg-primary:      #fafaf9;
  --color-bg-secondary:    #f5f5f4;
  --color-text-primary:    #1c1917;
  --color-text-secondary:  #57534e;
  --color-text-muted:      #a8a29e;
  --color-border:          #e7e5e4;
}

/* ─── Base ──────────────────────────────────────────────────────── */
html, body {
  background-color: #0c0a09;
  color: #f5f5f4;
  font-family: 'Inter', system-ui, sans-serif;
}

::selection {
  background: #292524;
  color: #f5f5f4;
}

/* ─── Marquee animation ─────────────────────────────────────────── */
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
```

**Step 3: Verify dev server loads with correct fonts**

```bash
npm run dev
```

Open browser → DevTools → Network tab → filter by "font". Confirm requests go to `localhost:5173/fonts/inter-*.woff2` — NOT `fonts.googleapis.com`.

**Step 4: Commit**

```bash
git add public/fonts/ src/index.css
git commit -m "feat: self-host Inter + JetBrains Mono, add CSS design tokens and marquee keyframe"
```

---

### Task 2: Update `src/App.tsx` and switch to vite-ssg

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`
- Modify: `package.json` (build script)

**Step 1: Update `package.json` build script**

Change:
```json
"build": "tsc -b && vite build"
```
To:
```json
"build": "vite-ssg build"
```

**Step 2: Rewrite `src/main.tsx`**

```tsx
import { ViteSSG } from 'vite-ssg'
import App from './App'
import './index.css'

export const createApp = ViteSSG(App)
```

**Step 3: Rewrite `src/App.tsx`**

```tsx
import { HelmetProvider } from 'react-helmet-async'
import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { Footer } from './components/Footer'

function App() {
  return (
    <HelmetProvider>
      <div
        className="min-h-screen font-sans text-stone-100 bg-stone-950"
        data-theme="dark"
      >
        <Navbar />
        <Home />
        <Footer />
      </div>
    </HelmetProvider>
  )
}

export default App
```

Changes from original:
- Removed `BrowserRouter`, `Routes`, `Route` (vite-ssg handles routing)
- Added `HelmetProvider` wrapper
- Added `data-theme="dark"` attribute
- Removed `selection:bg-orange-500 selection:text-white` (now in CSS)

**Step 4: Verify dev server still works**

```bash
npm run dev
```

Expected: site loads at `localhost:5173`, no console errors.

**Step 5: Test production build produces pre-rendered HTML**

```bash
npm run build
grep -i "stone" dist/index.html | head -5
```

Expected: Tailwind class names appear in the raw HTML, confirming pre-render worked. The file should NOT be just `<div id="root"></div>`.

**Step 6: Commit**

```bash
git add src/main.tsx src/App.tsx package.json
git commit -m "feat: switch to vite-ssg for static pre-rendering, add HelmetProvider"
```

---

## Phase 2 — Navbar Rebuild

### Task 3: Rebuild `src/components/Navbar.tsx`

**Files:**
- Modify: `src/components/Navbar.tsx`

**Design spec:**
- Fixed top bar, `z-50`, height `64px`
- Left: monogram `S.D.` — Inter 16px weight 500
- Right: `Work · About · Contact` text links — 14px weight 400 `text-stone-300` hover `text-stone-100`
- Transparent over Hero → `bg-stone-950/80 backdrop-blur-md border-b border-stone-800` after 80px scroll
- Mobile: animated hamburger → fullscreen overlay with large stacked links (48px)
- Page load: navbar fades in first (`delay: 0`)

**Step 1: Replace `src/components/Navbar.tsx` entirely**

```tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 80);
  });

  // Close menu on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navLinks = [
    { label: 'Work',    href: '#work' },
    { label: 'About',  href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* ── Main bar ── */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-stone-950/80 backdrop-blur-md border-b border-stone-800'
            : 'bg-transparent'
        }`}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0 }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Monogram */}
          <a
            href="#"
            className="text-stone-100 text-base font-medium tracking-wide hover:text-stone-400 transition-colors duration-150"
          >
            S.D.
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-stone-300 hover:text-stone-100 transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-stone-400 border border-stone-800 rounded px-3 py-1 hover:border-stone-600 hover:text-stone-100 transition-all duration-200"
            >
              Resume
            </a>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 z-50"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <motion.span
              className="block w-5 h-px bg-stone-100 origin-center"
              animate={menuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block w-5 h-px bg-stone-100 origin-center"
              animate={menuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
            />
          </button>
        </div>
      </motion.nav>

      {/* ── Mobile fullscreen overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-stone-950 flex flex-col items-center justify-center gap-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="text-5xl font-light text-stone-100 hover:text-stone-400 transition-colors"
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl text-stone-500 hover:text-stone-300 transition-colors mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => setMenuOpen(false)}
            >
              Resume ↗
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
```

**Step 2: Verify in dev**

```bash
npm run dev
```

Check: monogram "S.D." on left, 3 links + Resume on right. Scroll down → nav becomes frosted glass. Resize to mobile → hamburger appears, clicking opens fullscreen overlay, Escape closes it.

**Step 3: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: rebuild Navbar with monogram, scroll transparency, mobile fullscreen overlay"
```

---

## Phase 3 — Hero Rebuild

### Task 4: Rebuild `src/components/Hero.tsx`

**Files:**
- Modify: `src/components/Hero.tsx`

**Design spec:**
- Keep: flashlight cursor (`--x`/`--y` CSS vars), background grid, `cursor-none`
- Add: large name (88px/300 weight), rotating descriptors via `AnimatePresence`, text CTAs
- Change: cursor dot and blur from `orange-*` → stone
- Add: scroll indicator at bottom center
- Page load stagger: name (delay 0.15) → descriptor (delay 0.3) → CTAs (delay 0.45)

**Step 1: Replace `src/components/Hero.tsx` entirely**

```tsx
import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, AnimatePresence } from 'framer-motion';

const DESCRIPTORS = ['GenAI PM', 'Builder', 'Strategist'];

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [descriptorIndex, setDescriptorIndex] = useState(0);

  // Mouse tracking for flashlight
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const { left, top } = containerRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        mouseX.set(x);
        mouseY.set(y);
        containerRef.current.style.setProperty('--x', `${x}px`);
        containerRef.current.style.setProperty('--y', `${y}px`);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Rotating descriptors — cycle every 2.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setDescriptorIndex((i) => (i + 1) % DESCRIPTORS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-stone-950 cursor-none"
    >
      {/* Background grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Flashlight glow */}
      <motion.div
        className="fixed top-0 left-0 w-64 h-64 rounded-full bg-stone-100/5 blur-3xl pointer-events-none z-30 mix-blend-screen"
        style={{ x: mouseX, y: mouseY, translateX: '-50%', translateY: '-50%' }}
      />

      {/* Flashlight overlay mask */}
      <motion.div
        className="absolute inset-0 z-20 bg-stone-100/5 mix-blend-overlay pointer-events-none"
        style={{
          maskImage: 'radial-gradient(circle 250px at var(--x) var(--y), black, transparent)',
          WebkitMaskImage: 'radial-gradient(circle 250px at var(--x) var(--y), black, transparent)',
        }}
      />

      {/* Sharp cursor dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-stone-100 rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{ x: mouseX, y: mouseY, translateX: '-50%', translateY: '-50%' }}
      />

      {/* Main content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center px-8 md:px-16 lg:px-24 max-w-6xl mx-auto">

        {/* Name */}
        <motion.h1
          className="text-[clamp(48px,8vw,88px)] font-light text-stone-100 leading-none tracking-tight mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
        >
          Sourav Debnath
        </motion.h1>

        {/* Rotating descriptor */}
        <div className="h-9 overflow-hidden mb-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={descriptorIndex}
              className="text-2xl text-stone-400 font-light"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, delay: 0.3, ease: 'easeOut' }}
            >
              {DESCRIPTORS[descriptorIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Inline CTAs */}
        <motion.div
          className="flex gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <a
            href="https://linkedin.com/in/souravdebnath"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-stone-400 hover:text-stone-100 transition-colors duration-200"
          >
            LinkedIn
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-stone-400 hover:text-stone-100 transition-colors duration-200"
          >
            Resume
          </a>
          <a
            href="https://github.com/sourav27"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-stone-400 hover:text-stone-100 transition-colors duration-200"
          >
            GitHub
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <motion.div
          className="w-px h-10 bg-stone-700"
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originY: 0 }}
        />
        <span className="text-[10px] uppercase tracking-widest text-stone-600">scroll</span>
      </motion.div>
    </div>
  );
};
```

**Step 2: Verify in dev**

```bash
npm run dev
```

Check: large name renders, descriptor cycles through "GenAI PM → Builder → Strategist" every 2.5s, flashlight follows cursor, CTAs are text links, scroll indicator pulses at bottom.

**Step 3: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat: rebuild Hero with name headline, rotating descriptors, stone cursor, scroll indicator"
```

---

## Phase 4 — Marquee (New Component)

### Task 5: Create `src/components/Marquee.tsx`

**Files:**
- Create: `src/components/Marquee.tsx`

**Design spec:** CSS-driven infinite scroll. Stone-600 text, stone-800 borders. 35s loop.

**Step 1: Create `src/components/Marquee.tsx`**

```tsx
const ITEMS = [
  'AB InBev',
  'Bain & Company',
  'Vedanta',
  'IIT Madras',
  'IIM Bangalore',
];

export const Marquee = () => {
  // Duplicate items so the loop is seamless
  const track = [...ITEMS, ...ITEMS];

  return (
    <div className="border-t border-stone-800 border-b overflow-hidden py-4">
      <div
        className="flex gap-16 whitespace-nowrap"
        style={{ animation: 'marquee 35s linear infinite' }}
      >
        {track.map((item, i) => (
          <span
            key={i}
            className="text-sm uppercase tracking-widest text-stone-600 shrink-0"
          >
            {item}
            <span className="ml-16 text-stone-800">·</span>
          </span>
        ))}
      </div>
    </div>
  );
};
```

**Step 2: Temporarily add to Home.tsx to verify**

Add `<Marquee />` after `<Hero />` in `src/pages/Home.tsx` for a visual check.

**Step 3: Verify in dev**

```bash
npm run dev
```

Check: smooth infinite scroll, stone-600 text, no JS jank, thin border lines top and bottom.

**Step 4: Commit**

```bash
git add src/components/Marquee.tsx
git commit -m "feat: add CSS-driven Marquee ticker component"
```

---

## Phase 5 — About Refactor

### Task 6: Refactor `src/components/About.tsx`

**Files:**
- Modify: `src/components/About.tsx`

**Design spec:** Two-column desktop. Left: bio text. Right: stats row + education + competency pills. Remove all orange. Scroll entry with stagger.

**Step 1: Replace `src/components/About.tsx` entirely**

```tsx
import { motion } from 'framer-motion';

const STATS = [
  { value: '5.5+', label: 'Years Experience' },
  { value: '3+',   label: 'Products Launched' },
  { value: '500+', label: 'Peak MAU' },
];

const EDUCATION = [
  {
    institution: 'IIM Bangalore',
    degree: 'MBA, General Management',
    period: '2022–24',
    gpa: '3.2/4.0',
  },
  {
    institution: 'IIT Madras',
    degree: 'B.Tech Honours, Mechanical Engineering',
    period: '2014–18',
    gpa: '8.9/10.0',
  },
];

const COMPETENCIES = [
  'Product Leadership', 'Generative AI', 'Agentic Workflows',
  'RAG', 'Digital Transformation', 'User Research',
  'Context Engineering', 'MLOps',
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
};

export const About = () => {
  return (
    <section id="about" className="py-24 md:py-32 bg-stone-900">
      <div className="max-w-6xl mx-auto px-6">

        <motion.h2
          className="text-5xl font-semibold text-stone-100 mb-16"
          {...fadeUp}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          About
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-16">

          {/* Left — bio */}
          <motion.div
            className="space-y-5 text-lg text-stone-400 leading-relaxed"
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          >
            <p>
              Senior Product Manager with 5.5+ years of experience building and launching
              AI and traditional products from zero to scale.
            </p>
            <p>
              Currently leading Generative AI initiatives at{' '}
              <span className="text-stone-100">AB InBev</span> — building products that
              help the world's largest brewer make faster, smarter decisions.
            </p>
            <p>
              My background combines technical depth from{' '}
              <span className="text-stone-100">IIT Madras</span> with strategic business
              acumen from <span className="text-stone-100">IIM Bangalore</span>.
            </p>
          </motion.div>

          {/* Right — stats, education, competencies */}
          <motion.div
            className="space-y-10"
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          >
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pb-10 border-b border-stone-800">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-light text-stone-100">{stat.value}</div>
                  <div className="text-[11px] uppercase tracking-widest text-stone-600 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="space-y-4">
              <p className="text-[11px] uppercase tracking-widest text-stone-600">Education</p>
              {EDUCATION.map((edu) => (
                <div key={edu.institution} className="flex justify-between items-start">
                  <div>
                    <p className="text-stone-100 text-sm font-medium">{edu.institution}</p>
                    <p className="text-stone-500 text-xs mt-0.5">{edu.degree}</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-stone-500 text-xs">{edu.period}</p>
                    <p className="text-stone-600 text-xs">GPA {edu.gpa}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Competencies */}
            <div>
              <p className="text-[11px] uppercase tracking-widest text-stone-600 mb-3">
                Competencies
              </p>
              <div className="flex flex-wrap gap-2">
                {COMPETENCIES.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 border border-stone-800 rounded-full text-[11px] uppercase tracking-widest text-stone-600 hover:border-stone-600 hover:text-stone-400 transition-colors duration-200 cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
```

**Step 2: Verify in dev — scroll to About section**

Check: two-column layout, no orange anywhere, stats row, both education entries, competency pills with hover effect.

**Step 3: Commit**

```bash
git add src/components/About.tsx
git commit -m "feat: refactor About with stats, education, competency pills — remove orange"
```

---

## Phase 6 — SelectedWork (Rename + Refactor)

### Task 7: Rename and refactor VisualResume → SelectedWork

**Files:**
- Create: `src/components/SelectedWork.tsx`
- Delete: `src/components/VisualResume.tsx`

**Design spec:** Keep alternating layout. Remove orange. Design-system cards (`border-stone-800 rounded-lg p-12`). Large stat numbers (64px weight 300). Mix-blend overlay on hover. Scroll entry per card.

**Step 1: Create `src/components/SelectedWork.tsx`**

```tsx
import { motion } from 'framer-motion';
import { experiences } from '../data/experiences';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6, ease: 'easeOut' },
};

export const SelectedWork = () => {
  return (
    <section id="work" className="py-24 md:py-32 bg-stone-950">
      <div className="max-w-6xl mx-auto px-6">

        <motion.h2
          className="text-5xl font-semibold text-stone-100 mb-20"
          {...fadeUp}
        >
          Selected Work
        </motion.h2>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              className={`relative group flex flex-col ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } gap-0 border border-stone-800 rounded-lg overflow-hidden hover:border-stone-700 transition-colors duration-200`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              whileHover={{ scale: 1.01 }}
            >
              {/* Mix-blend hover overlay */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-[0.03] transition-opacity duration-200 pointer-events-none z-10 mix-blend-difference" />

              {/* Content */}
              <div className="flex-1 p-10 md:p-12 space-y-6">
                {/* Label */}
                <p className="text-[11px] uppercase tracking-widest text-stone-600">
                  {exp.company} · {exp.period}
                </p>

                {/* Role */}
                <h3 className="text-3xl md:text-4xl font-light text-stone-100 leading-tight">
                  {exp.role}
                </h3>

                {/* Description */}
                <p className="text-base text-stone-400 leading-relaxed max-w-lg">
                  {exp.description}
                </p>

                {/* Stats */}
                {exp.stats && exp.stats.length > 0 && (
                  <div className="grid grid-cols-3 gap-6 pt-6 border-t border-stone-800">
                    {exp.stats.map((stat) => (
                      <div key={stat.label}>
                        <div className="text-[40px] md:text-[56px] font-light text-stone-100 leading-none">
                          {stat.value}
                        </div>
                        <div className="text-[11px] uppercase tracking-widest text-stone-600 mt-2">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Skills */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {exp.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 border border-stone-800 rounded-full text-[11px] uppercase tracking-widest text-stone-600 hover:border-stone-600 hover:text-stone-400 transition-colors duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Testimonial */}
                {exp.testimonial && (
                  <div className="pt-6 border-t border-stone-800">
                    <p className="text-sm text-stone-400 italic leading-relaxed mb-3">
                      "{exp.testimonial.text}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-stone-800 flex items-center justify-center text-[10px] text-stone-400 font-medium">
                        {exp.testimonial.author[0]}
                      </div>
                      <div>
                        <p className="text-xs text-stone-300 font-medium">{exp.testimonial.author}</p>
                        <p className="text-xs text-stone-600">{exp.testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Image */}
              <div className="flex-1 min-h-[280px] md:min-h-0 relative overflow-hidden bg-stone-900">
                {exp.image ? (
                  <img
                    src={exp.image}
                    alt={exp.role}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-stone-800 text-8xl font-light">
                      {exp.company[0]}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

**Step 2: Delete old file**

```bash
rm src/components/VisualResume.tsx
```

**Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: zero errors. If `VisualResume` is still imported somewhere, update that import.

**Step 4: Verify in dev**

```bash
npm run dev
```

Check: "Selected Work" heading, alternating layout, no orange, large stat numbers, experience images are grayscale until hover.

**Step 5: Commit**

```bash
git add src/components/SelectedWork.tsx
git rm src/components/VisualResume.tsx
git commit -m "feat: rename VisualResume→SelectedWork, redesign cards with stat display and hover effects"
```

---

## Phase 7 — Achievements (New Section)

### Task 8: Create `src/data/achievements.ts`

**Files:**
- Create: `src/data/achievements.ts`

**Step 1: Create `src/data/achievements.ts`**

```ts
export interface AchievementItem {
  name: string;
  context: string;
  metric: string;
  year: string;
}

export const achievements: AchievementItem[] = [
  { name: 'Culture Champion Award',   context: 'AB InBev',               metric: 'Top 1% recognition',       year: '2025' },
  { name: '0→1 GenAI Copilot',        context: 'AB InBev',               metric: '500+ MAU, 20x growth',     year: '2024' },
  { name: '$1M+ Annual Savings',       context: 'AB InBev Supply Chain',  metric: '$1M+ cost avoidance',      year: '2024' },
  { name: 'National Runner Up + PPO', context: 'Accenture Strategy',     metric: 'Top 2 nationally',          year: '2023' },
  { name: '$10B+ Market POV',         context: 'Bain & Company',         metric: '5-yr India strategy',       year: '2023' },
  { name: "Chairman's Award",         context: 'Vedanta Limited',        metric: 'Highest individual award',  year: '2022' },
  { name: '$250M+ Profit Accrual',    context: 'Vedanta Industry 4.0',   metric: '$250M+ impact',             year: '2020' },
];
```

**Step 2: Commit**

```bash
git add src/data/achievements.ts
git commit -m "feat: add achievements data file"
```

---

### Task 9: Create `src/components/Achievements.tsx`

**Files:**
- Create: `src/components/Achievements.tsx`

**Design spec:** Table layout. 4 columns: Achievement · Context · Metric · Year. Each row fades in with stagger. `id="achievements"`.

**Step 1: Create `src/components/Achievements.tsx`**

```tsx
import { motion } from 'framer-motion';
import { achievements } from '../data/achievements';

export const Achievements = () => {
  return (
    <section id="achievements" className="py-24 md:py-32 bg-stone-900">
      <div className="max-w-6xl mx-auto px-6">

        <motion.h2
          className="text-5xl font-semibold text-stone-100 mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          Achievements
        </motion.h2>

        {/* Table header */}
        <div className="hidden md:grid grid-cols-[2fr_1.5fr_1.5fr_auto] gap-6 pb-4 border-b border-stone-800 mb-2">
          {['Achievement', 'Context', 'Metric', 'Year'].map((h) => (
            <span key={h} className="text-[11px] uppercase tracking-widest text-stone-600">
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {achievements.map((item, index) => (
          <motion.div
            key={item.name}
            className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1.5fr_auto] gap-2 md:gap-6 py-5 border-b border-stone-800 group hover:bg-stone-800/20 transition-colors duration-150 -mx-2 px-2 rounded"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: 'easeOut' }}
          >
            <span className="text-base text-stone-100 group-hover:text-stone-100 transition-colors">
              {item.name}
            </span>
            <span className="text-base text-stone-400">{item.context}</span>
            <span className="text-base text-stone-400">{item.metric}</span>
            <span className="text-base text-stone-600 md:text-right">{item.year}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
```

**Step 2: Verify in dev (after wiring in Home.tsx — done in Task 14)**

**Step 3: Commit**

```bash
git add src/components/Achievements.tsx
git commit -m "feat: add Achievements section with staggered table layout"
```

---

## Phase 8 — Gallery Refactor

### Task 10: Create `src/data/gallery.ts` and refactor `Gallery.tsx`

**Files:**
- Create: `src/data/gallery.ts`
- Modify: `src/components/Gallery.tsx`

**Design spec:** Monochrome (grayscale) images by default. On hover: color reveals + EXIF overlay appears + image scales up. JetBrains Mono for EXIF text. Stagger scroll entry.

**Step 1: Create `src/data/gallery.ts`**

```ts
export interface GalleryItem {
  src: string;
  alt: string;
  camera?: string;
  lens?: string;
  iso?: string;
  aperture?: string;
}

export const gallery: GalleryItem[] = [
  {
    src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80',
    alt: 'Camera on wooden surface',
    camera: 'Sony A7III', lens: '35mm f/1.4', iso: '100', aperture: 'f/2.8',
  },
  {
    src: 'https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&q=80',
    alt: 'Landscape at golden hour',
    camera: 'Canon R5', lens: '85mm f/1.2', iso: '200', aperture: 'f/1.8',
  },
  {
    src: 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?auto=format&fit=crop&q=80',
    alt: 'Architecture detail',
    camera: 'Leica Q2', lens: '28mm f/1.7', iso: '400', aperture: 'f/4',
  },
  {
    src: 'https://images.unsplash.com/photo-1500964757637-c85e8a162699?auto=format&fit=crop&q=80',
    alt: 'Desert landscape',
    camera: 'Fujifilm X-T4', lens: '16-55mm', iso: '160', aperture: 'f/5.6',
  },
];
```

**Step 2: Replace `src/components/Gallery.tsx` entirely**

```tsx
import { motion } from 'framer-motion';
import { gallery } from '../data/gallery';

export const Gallery = () => {
  return (
    <section id="gallery" className="py-24 md:py-32 bg-stone-950">
      <div className="max-w-6xl mx-auto px-6">

        <motion.h2
          className="text-5xl font-semibold text-stone-100 mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          Perspective
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {gallery.map((img, index) => (
            <motion.div
              key={index}
              className="relative aspect-square overflow-hidden group rounded-lg cursor-pointer"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
            >
              {/* Image — grayscale by default, colour on hover */}
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
              />

              {/* EXIF overlay — appears with colour on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-4 text-center">
                <p className="font-mono text-[13px] font-normal text-stone-100 mb-1">
                  {img.camera}
                </p>
                <p className="font-mono text-[11px] text-stone-400">
                  {img.lens}
                </p>
                <div className="flex gap-3 mt-2">
                  {img.iso && (
                    <span className="font-mono text-[11px] text-stone-500">
                      ISO {img.iso}
                    </span>
                  )}
                  {img.aperture && (
                    <span className="font-mono text-[11px] text-stone-500">
                      {img.aperture}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

**Step 3: Verify in dev**

```bash
npm run dev
```

Check: images appear in grayscale, hovering reveals full colour + EXIF overlay simultaneously, slight zoom on hover. EXIF text uses monospace font.

**Step 4: Commit**

```bash
git add src/data/gallery.ts src/components/Gallery.tsx
git commit -m "feat: gallery grayscale-until-hover with EXIF overlay and zoom transition"
```

---

## Phase 9 — Footer Rebuild

### Task 11: Rebuild `src/components/Footer.tsx`

**Files:**
- Modify: `src/components/Footer.tsx`

**Design spec:** Large "Let's build something." CTA, social text links, monogram "S.D." + copyright. `id="contact"`.

**Step 1: Replace `src/components/Footer.tsx` entirely**

```tsx
import { motion } from 'framer-motion';

const SOCIALS = [
  { label: 'Email',     href: 'mailto:debnath.sourabh@gmail.com' },
  { label: 'LinkedIn',  href: 'https://linkedin.com/in/souravdebnath' },
  { label: 'GitHub',    href: 'https://github.com/sourav27' },
  { label: 'Instagram', href: 'https://instagram.com' },
];

export const Footer = () => {
  return (
    <footer id="contact" className="bg-stone-950 border-t border-stone-800 pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">

        {/* CTA */}
        <motion.p
          className="text-[clamp(36px,6vw,72px)] font-light text-stone-100 leading-tight mb-16 max-w-3xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Let's build something.
        </motion.p>

        {/* Social links */}
        <motion.div
          className="flex flex-wrap gap-8 mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith('mailto') ? undefined : '_blank'}
              rel={s.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
              className="text-sm text-stone-400 hover:text-stone-100 hover:-translate-y-px transition-all duration-150"
            >
              {s.label}
            </a>
          ))}
        </motion.div>

        {/* Footer bar */}
        <div className="flex justify-between items-center border-t border-stone-800 pt-6">
          <span className="text-sm font-medium text-stone-600">S.D.</span>
          <span className="text-xs text-stone-600">
            © {new Date().getFullYear()} Sourav Debnath. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};
```

**Step 2: Verify in dev**

Check: large CTA text, social text links, monogram left + copyright right, hover lifts links slightly.

**Step 3: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: rebuild Footer with large CTA, social text links, monogram"
```

---

## Phase 10 — SEO

### Task 12: Create `src/components/SEO.tsx` and static assets

**Files:**
- Create: `src/components/SEO.tsx`
- Create: `public/sitemap.xml`
- Create: `public/robots.txt`

**Step 1: Create `src/components/SEO.tsx`**

```tsx
import { Helmet } from 'react-helmet-async';

export const SEO = () => (
  <Helmet>
    <title>Sourav Debnath | AI PM</title>
    <meta name="description" content="AI Product Manager | Solving Business Problems with Scalable AI Products" />
    <link rel="canonical" href="https://souravdebnath.com" />

    <meta property="og:title" content="Sourav Debnath | AI PM" />
    <meta property="og:description" content="AI Product Manager | Solving Business Problems with Scalable AI Products" />
    <meta property="og:url" content="https://souravdebnath.com" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://souravdebnath.com/og-image.jpg" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Sourav Debnath | AI PM" />
    <meta name="twitter:description" content="AI Product Manager | Solving Business Problems with Scalable AI Products" />
    <meta name="twitter:image" content="https://souravdebnath.com/og-image.jpg" />

    <script type="application/ld+json">{JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Sourav Debnath',
      jobTitle: 'Senior Product Manager',
      description: 'AI Product Manager building GenAI products at scale',
      url: 'https://souravdebnath.com',
      sameAs: [
        'https://linkedin.com/in/souravdebnath',
        'https://github.com/sourav27',
      ],
      alumniOf: [
        { '@type': 'CollegeOrUniversity', name: 'Indian Institute of Management Bangalore' },
        { '@type': 'CollegeOrUniversity', name: 'Indian Institute of Technology Madras' },
      ],
      worksFor: { '@type': 'Organization', name: 'AB InBev' },
    })}</script>
  </Helmet>
);
```

**Step 2: Create `public/sitemap.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://souravdebnath.com/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

**Step 3: Create `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://souravdebnath.com/sitemap.xml
```

**Step 4: Commit**

```bash
git add src/components/SEO.tsx public/sitemap.xml public/robots.txt
git commit -m "feat: add SEO component with meta tags, JSON-LD schema, sitemap, robots.txt"
```

---

## Phase 11 — Home Orchestration

### Task 13: Update `src/pages/Home.tsx`

**Files:**
- Modify: `src/pages/Home.tsx`

**Step 1: Replace `src/pages/Home.tsx` entirely**

```tsx
import { SEO } from '../components/SEO';
import { Hero } from '../components/Hero';
import { Marquee } from '../components/Marquee';
import { About } from '../components/About';
import { SelectedWork } from '../components/SelectedWork';
import { Achievements } from '../components/Achievements';
import { Gallery } from '../components/Gallery';

export const Home = () => {
  return (
    <main>
      <SEO />
      <Hero />
      <Marquee />
      <About />
      <SelectedWork />
      <Achievements />
      <Gallery />
    </main>
  );
};
```

**Step 2: Full visual check in dev**

```bash
npm run dev
```

Walk through the full page top-to-bottom:
- [ ] Navbar: "S.D." monogram, Work/About/Contact links, scroll goes frosted
- [ ] Hero: name, rotating descriptor, text CTAs, flashlight, scroll indicator
- [ ] Marquee: smooth infinite ticker
- [ ] About: two-column, stats, education, pills
- [ ] Selected Work: 4 cards alternating, large stats, grayscale images on hover reveal
- [ ] Achievements: table with 7 rows, stagger animation
- [ ] Gallery: grayscale photos, colour + EXIF on hover
- [ ] Footer: large CTA, social links, monogram

**Step 3: Commit**

```bash
git add src/pages/Home.tsx
git commit -m "feat: wire all sections in Home — Hero→Marquee→About→Work→Achievements→Gallery"
```

---

## Phase 12 — Security Hygiene

### Task 14: Fix external links and add CI audit

**Files:**
- Audit: `src/components/Hero.tsx`, `src/components/Navbar.tsx`, `src/components/Footer.tsx`, `src/components/SelectedWork.tsx`
- Modify: `.github/workflows/deploy.yml`

**Step 1: Audit all external links**

```bash
grep -rn 'href="http' src/
grep -rn 'target="_blank"' src/
```

Every `<a target="_blank">` must have `rel="noopener noreferrer"`. Every `href="http..."` that opens externally must have both `target="_blank"` and `rel="noopener noreferrer"`.

If you followed the component code in this plan exactly, all links already have the correct attributes. This step is a sanity check.

**Step 2: Add audit step to `.github/workflows/deploy.yml`**

Add after the `Install dependencies` step:

```yaml
      - name: Audit dependencies
        run: npm audit --audit-level=high
```

Full updated workflow:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Audit dependencies
        run: npm audit --audit-level=high

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Step 3: Verify audit passes locally**

```bash
npm audit --audit-level=high
```

Expected: `found 0 vulnerabilities`. If high-severity issues exist, run `npm audit fix` first.

**Step 4: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add npm audit to deployment pipeline, verify noopener noreferrer on external links"
```

---

## Phase 13 — Markdown Content Pipeline

> **Note:** This phase migrates hardcoded TypeScript data to `.md` files. It does NOT change any component rendering logic — only the data source. Complete Phases 0–12 first and verify the site works before running this phase.

### Task 15: Create content directory and Markdown files

**Files:** Create `content/` directory tree

**Step 1: Create directory structure**

```bash
mkdir -p D:/sourav27.github.io/content/experiences
mkdir -p D:/sourav27.github.io/public/images/experiences
mkdir -p D:/sourav27.github.io/public/images/logos
mkdir -p D:/sourav27.github.io/public/images/gallery
```

**Step 2: Create `content/experiences/ab-inbev.md`**

```md
---
id: ab-inbev
role: Senior Product Manager
company: AB InBev
period: May 2024 – Present
location: Bengaluru
image: /images/experiences/ab-inbev.jpg
logo: /images/logos/ab-inbev.svg
stats:
  - label: MAU Growth
    value: "20x"
  - label: Savings
    value: "$1M+"
  - label: Accuracy
    value: "91%"
skills: [GenAI, Product Strategy, Agentic Workflows, RLHF]
testimonial:
  text: "Sourav transformed how we access data. His vision for the Copilot has been a game-changer for our daily decision making."
  author: Jane Doe
  role: Global Director of Analytics
---

Leading Generative AI initiatives for the world's largest brewer. Spearheaded the enterprise Data Insights Copilot from 0-to-1, scaling to 500+ MAU across global business units in under a year.
```

**Step 3: Create `content/experiences/bain.md`**

```md
---
id: bain
role: Summer Associate
company: Bain & Company
period: Apr 2023 – Jun 2023
location: Mumbai
logo: /images/logos/bain.svg
stats:
  - label: Market Impact
    value: "$10B+"
  - label: Forecast Accuracy
    value: "+10%"
skills: [Strategy, Financial Modeling, Market Analysis]
---

Strategized Life Insurance business models and developed an integrated IT resource forecasting MVP for a Tier-1 client. Published a 5-year POV estimating the $10B+ Indian insurance market.
```

**Step 4: Create `content/experiences/vedanta-pm.md`**

```md
---
id: vedanta-pm
role: Product Manager
company: Vedanta Resources
period: Oct 2020 – May 2022
location: Mumbai
image: /images/experiences/vedanta-pm.jpg
logo: /images/logos/vedanta.svg
stats:
  - label: Transaction Vol
    value: "$5B+"
  - label: Sales Online
    value: "30%"
  - label: NPS
    value: "60+"
skills: [B2B E-commerce, Platform Growth, Digital Transformation]
testimonial:
  text: "The platform Sourav launched completely modernized our sales process. A truly user-centric product leader."
  author: John Smith
  role: Head of Sales
---

Launched a B2B e-commerce platform selling 5+ commodities, moving 30% of sales online within a year and handling $5B+ in annual transactions.
```

**Step 5: Create `content/experiences/vedanta-ai.md`**

```md
---
id: vedanta-ai
role: Smart Manufacturing & AI Lead
company: Vedanta Resources
period: Jul 2018 – Sep 2020
location: New Delhi
logo: /images/logos/vedanta.svg
stats:
  - label: Profit Accrual
    value: "$250M+"
  - label: AI Projects
    value: "25+"
skills: [Industry 4.0, Machine Learning, Data Science]
---

Established the AI Centre of Excellence and steered the Industry 4.0 roadmap across 10+ business units, certifying 100+ functional leaders as data scientists.
```

**Step 6: Create `content/achievements.md`**

```md
---
achievements:
  - name: Culture Champion Award
    context: AB InBev
    metric: Top 1% recognition
    year: "2025"
  - name: 0→1 GenAI Copilot
    context: AB InBev
    metric: 500+ MAU, 20x growth
    year: "2024"
  - name: $1M+ Annual Savings
    context: AB InBev Supply Chain
    metric: $1M+ cost avoidance
    year: "2024"
  - name: National Runner Up + PPO
    context: Accenture Strategy
    metric: Top 2 nationally
    year: "2023"
  - name: $10B+ Market POV
    context: Bain & Company
    metric: 5-yr India strategy
    year: "2023"
  - name: Chairman's Award
    context: Vedanta Limited
    metric: Highest individual award
    year: "2022"
  - name: $250M+ Profit Accrual
    context: Vedanta Industry 4.0
    metric: $250M+ impact
    year: "2020"
---
```

**Step 7: Create `content/gallery.md`**

```md
---
gallery:
  - src: /images/gallery/photo-1.jpg
    alt: Gallery photo 1
    camera: Sony A7III
    lens: 35mm f/1.4
    iso: "100"
    aperture: f/2.8
  - src: /images/gallery/photo-2.jpg
    alt: Gallery photo 2
    camera: Canon R5
    lens: 85mm f/1.2
    iso: "200"
    aperture: f/1.8
  - src: /images/gallery/photo-3.jpg
    alt: Gallery photo 3
    camera: Leica Q2
    lens: 28mm f/1.7
    iso: "400"
    aperture: f/4
  - src: /images/gallery/photo-4.jpg
    alt: Gallery photo 4
    camera: Fujifilm X-T4
    lens: 16-55mm
    iso: "160"
    aperture: f/5.6
---
```

**Step 8: Create `content/about.md`**

```md
---
stats:
  - label: Years Experience
    value: "5.5+"
  - label: Products Launched
    value: "3+"
  - label: Peak MAU
    value: "500+"
education:
  - institution: IIM Bangalore
    degree: MBA, General Management
    period: 2022–24
    gpa: "3.2/4.0"
  - institution: IIT Madras
    degree: B.Tech Honours, Mechanical Engineering
    period: 2014–18
    gpa: "8.9/10.0"
competencies:
  - Product Leadership
  - Generative AI
  - Agentic Workflows
  - RAG
  - Digital Transformation
  - User Research
  - Context Engineering
  - MLOps
---

Senior Product Manager with 5.5+ years of experience building and launching AI and traditional products from zero to scale. Currently leading Generative AI initiatives at AB InBev — building products that help the world's largest brewer make faster, smarter decisions.
```

**Step 9: Commit**

```bash
git add content/
git commit -m "feat: add markdown content files for all portfolio sections"
```

---

### Task 16: Create `src/lib/content.ts` parsing utility

**Files:**
- Create: `src/lib/content.ts`

**Step 1: Create `src/lib/content.ts`**

```ts
import matter from 'gray-matter';
import { readFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import type { ExperienceItem } from '../data/experiences';
import type { AchievementItem } from '../data/achievements';
import type { GalleryItem } from '../data/gallery';

const contentDir = resolve(process.cwd(), 'content');

// ── Experiences ──────────────────────────────────────────────────────
const EXPERIENCE_ORDER = ['ab-inbev', 'bain', 'vedanta-pm', 'vedanta-ai'];

export function loadExperiences(): ExperienceItem[] {
  const dir = join(contentDir, 'experiences');
  const files = readdirSync(dir).filter((f) => f.endsWith('.md'));

  const items = files.map((file) => {
    const raw = readFileSync(join(dir, file), 'utf-8');
    const { data, content } = matter(raw);
    return { ...data, description: content.trim() } as ExperienceItem;
  });

  return EXPERIENCE_ORDER
    .map((id) => items.find((i) => i.id === id))
    .filter(Boolean) as ExperienceItem[];
}

// ── Achievements ─────────────────────────────────────────────────────
export function loadAchievements(): AchievementItem[] {
  const raw = readFileSync(join(contentDir, 'achievements.md'), 'utf-8');
  const { data } = matter(raw);
  return data.achievements as AchievementItem[];
}

// ── Gallery ──────────────────────────────────────────────────────────
export function loadGallery(): GalleryItem[] {
  const raw = readFileSync(join(contentDir, 'gallery.md'), 'utf-8');
  const { data } = matter(raw);
  return data.gallery as GalleryItem[];
}

// ── About ────────────────────────────────────────────────────────────
export interface AboutData {
  stats: { label: string; value: string }[];
  education: { institution: string; degree: string; period: string; gpa: string }[];
  competencies: string[];
  bio: string;
}

export function loadAbout(): AboutData {
  const raw = readFileSync(join(contentDir, 'about.md'), 'utf-8');
  const { data, content } = matter(raw);
  return { ...data, bio: content.trim() } as AboutData;
}
```

**Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

If `fs`/`path` types are missing: `npm install --save-dev @types/node`

Expected: zero errors.

**Step 3: Commit**

```bash
git add src/lib/content.ts
git commit -m "feat: add gray-matter content parsing utility for markdown files"
```

---

### Task 17: Wire components to markdown content

**Files:**
- Modify: `src/components/SelectedWork.tsx`
- Modify: `src/components/Achievements.tsx`
- Modify: `src/components/Gallery.tsx`
- Modify: `src/components/About.tsx`

**Step 1: Update `SelectedWork.tsx` import**

Change:
```ts
import { experiences } from '../data/experiences';
```
To:
```ts
import { loadExperiences } from '../lib/content';
const experiences = loadExperiences();
```

**Step 2: Update `Achievements.tsx` import**

Change:
```ts
import { achievements } from '../data/achievements';
```
To:
```ts
import { loadAchievements } from '../lib/content';
const achievements = loadAchievements();
```

**Step 3: Update `Gallery.tsx` import**

Change:
```ts
import { gallery } from '../data/gallery';
```
To:
```ts
import { loadGallery } from '../lib/content';
const gallery = loadGallery();
```

**Step 4: Build and verify content flows from markdown**

```bash
npm run build
grep "AB InBev" dist/index.html
```

Expected: "AB InBev" appears in the raw HTML, confirming content is sourced from `content/experiences/ab-inbev.md` and pre-rendered.

**Step 5: Test a content edit round-trip**

Edit `content/experiences/ab-inbev.md` — change description to add " [TEST]" at the end. Run `npm run build`. Confirm `grep "TEST" dist/index.html` returns a match. Revert the edit.

**Step 6: Commit**

```bash
git add src/components/SelectedWork.tsx src/components/Achievements.tsx src/components/Gallery.tsx src/components/About.tsx
git commit -m "feat: wire all components to markdown content pipeline via gray-matter"
```

---

## Final Verification Checklist

Run these checks before pushing:

```bash
# 1. Full production build — must succeed with zero errors
npm run build

# 2. Pre-rendered content in HTML
grep -i "sourav debnath" dist/index.html

# 3. OG meta tag present
grep "og:title" dist/index.html

# 4. Sitemap and robots in dist
ls dist/sitemap.xml dist/robots.txt

# 5. No Google Fonts requests (self-hosted check)
grep "googleapis" dist/index.html  # should return nothing

# 6. No orange classes remain
grep -r "orange-" src/  # should return nothing

# 7. External links security
grep -rn 'target="_blank"' src/ | grep -v 'noopener'  # should return nothing

# 8. Dependency audit
npm audit --audit-level=high
```

All 8 checks must pass. Then:

```bash
git push origin main
```

---

## Task Execution Order

```
Phase 0  →  Task 0   (install deps)
Phase 1  →  Task 1   (CSS + fonts)
         →  Task 2   (App.tsx + vite-ssg)
Phase 2  →  Task 3   (Navbar)
Phase 3  →  Task 4   (Hero)
Phase 4  →  Task 5   (Marquee)
Phase 5  →  Task 6   (About)
Phase 6  →  Task 7   (SelectedWork)
Phase 7  →  Task 8   (achievements data)
         →  Task 9   (Achievements component)
Phase 8  →  Task 10  (Gallery)
Phase 9  →  Task 11  (Footer)
Phase 10 →  Task 12  (SEO)
Phase 11 →  Task 13  (Home orchestration) ← first full visual check here
Phase 12 →  Task 14  (Security + CI)
Phase 13 →  Task 15  (markdown files)
         →  Task 16  (content.ts utility)
         →  Task 17  (wire components)     ← second full build check here
```
