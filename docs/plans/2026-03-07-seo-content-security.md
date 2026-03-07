# SEO, Markdown Content Pipeline & Security Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add static pre-rendering for SEO, replace TypeScript data files with Markdown frontmatter, and apply baseline security hygiene to the portfolio.

**Architecture:** `vite-ssg` wraps the existing Vite build to pre-render the SPA to static HTML at build time. A `src/lib/content.ts` build utility uses `gray-matter` to parse `.md` files in `content/` and export typed arrays that are drop-in replacements for the existing `src/data/*.ts` exports. Security fixes are applied as targeted edits with no structural changes.

**Tech Stack:** vite-ssg, react-helmet-async, gray-matter, vite-plugin-content (or vite glob imports), Inter + JetBrains Mono woff2 (self-hosted)

**Design doc:** `docs/plans/2026-03-07-seo-content-security-design.md`
**UI redesign plan:** `context/implementation-plan.md`

---

## Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install runtime packages**

```bash
cd D:/sourav27.github.io
npm install vite-ssg react-helmet-async gray-matter
```

Expected: packages added to `dependencies` in `package.json`.

**Step 2: Install dev packages**

```bash
npm install --save-dev @types/gray-matter
```

**Step 3: Verify install**

```bash
npm ls vite-ssg react-helmet-async gray-matter
```

Expected: all three listed with version numbers, no `UNMET DEPENDENCY` warnings.

**Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add vite-ssg, react-helmet-async, gray-matter dependencies"
```

---

## Task 2: Switch Build to vite-ssg

**Files:**
- Modify: `package.json` (build script)
- Modify: `src/main.tsx`
- Modify: `vite.config.ts`

**Step 1: Update build script in `package.json`**

Change:
```json
"build": "tsc -b && vite build"
```
To:
```json
"build": "vite-ssg build"
```

**Step 2: Update `src/main.tsx` for vite-ssg**

`vite-ssg` requires the app entry to export a `ViteSSGContext` instead of calling `ReactDOM.render`. Replace the entire file:

```tsx
import { ViteSSG } from 'vite-ssg'
import App from './App'
import './index.css'

export const createApp = ViteSSG(App)
```

Note: `ViteSSG` accepts a root component. Since `App.tsx` wraps everything in `<BrowserRouter>`, you need to remove `BrowserRouter` from `App.tsx` and let `vite-ssg` handle routing. See Task 3.

**Step 3: Verify dev server still works**

```bash
npm run dev
```

Expected: dev server starts, site loads at `localhost:5173`. `vite-ssg` is a build-time tool only — dev server is unchanged.

**Step 4: Commit**

```bash
git add package.json src/main.tsx
git commit -m "chore: switch build entrypoint to vite-ssg"
```

---

## Task 3: Update App.tsx for vite-ssg Routing

**Files:**
- Modify: `src/App.tsx`

**Context:** `vite-ssg` handles routing internally. `BrowserRouter` from react-router-dom must be removed from `App.tsx`; vite-ssg injects its own router context. For a single-route SPA this is straightforward.

**Step 1: Update `src/App.tsx`**

Remove `BrowserRouter` wrapper and the `Routes`/`Route` structure. Since there is only one route (`/`), simplify to:

```tsx
import { HelmetProvider } from 'react-helmet-async'
import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { Footer } from './components/Footer'

function App() {
  return (
    <HelmetProvider>
      <div className="min-h-screen font-sans text-stone-100 bg-stone-950" data-theme="dark">
        <Navbar />
        <Home />
        <Footer />
      </div>
    </HelmetProvider>
  )
}

export default App
```

Changes made:
- Removed `BrowserRouter`, `Routes`, `Route` imports and usage
- Added `HelmetProvider` wrapper (required by react-helmet-async)
- Added `data-theme="dark"` (per design spec)
- Removed `selection:bg-orange-500 selection:text-white` (handled by CSS tokens)

**Step 2: Verify dev server**

```bash
npm run dev
```

Expected: site loads, all sections visible, no console errors about missing Router context.

**Step 3: Test production build**

```bash
npm run build
```

Expected: `dist/` generated with `index.html` containing rendered HTML content (not just `<div id="root"></div>`). Open `dist/index.html` in a text editor and confirm you can see the text "Sourav Debnath" in the raw HTML.

**Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: integrate react-helmet-async and remove BrowserRouter for vite-ssg"
```

---

## Task 4: Add SEO Meta Tags and JSON-LD

**Files:**
- Create: `src/components/SEO.tsx`
- Modify: `src/pages/Home.tsx`

**Step 1: Create `src/components/SEO.tsx`**

```tsx
import { Helmet } from 'react-helmet-async'

export const SEO = () => (
  <Helmet>
    <title>Sourav Debnath | AI PM</title>
    <meta name="description" content="AI Product Manager | Solving Business Problems with Scalable AI Products" />
    <link rel="canonical" href="https://souravdebnath.com" />

    {/* Open Graph */}
    <meta property="og:title" content="Sourav Debnath | AI PM" />
    <meta property="og:description" content="AI Product Manager | Solving Business Problems with Scalable AI Products" />
    <meta property="og:url" content="https://souravdebnath.com" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://souravdebnath.com/og-image.jpg" />

    {/* Twitter/X */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Sourav Debnath | AI PM" />
    <meta name="twitter:description" content="AI Product Manager | Solving Business Problems with Scalable AI Products" />
    <meta name="twitter:image" content="https://souravdebnath.com/og-image.jpg" />

    {/* JSON-LD Person Schema */}
    <script type="application/ld+json">{JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Sourav Debnath",
      "jobTitle": "Senior Product Manager",
      "description": "AI Product Manager building GenAI products at scale",
      "url": "https://souravdebnath.com",
      "sameAs": [
        "https://linkedin.com/in/souravdebnath",
        "https://github.com/sourav27"
      ],
      "alumniOf": [
        { "@type": "CollegeOrUniversity", "name": "Indian Institute of Management Bangalore" },
        { "@type": "CollegeOrUniversity", "name": "Indian Institute of Technology Madras" }
      ],
      "worksFor": { "@type": "Organization", "name": "AB InBev" }
    })}</script>
  </Helmet>
)
```

**Step 2: Add SEO component to `src/pages/Home.tsx`**

```tsx
import { SEO } from '../components/SEO'
import { Hero } from '../components/Hero'
import { About } from '../components/About'
import { VisualResume } from '../components/VisualResume'
import { Gallery } from '../components/Gallery'

export const Home = () => {
  return (
    <main>
      <SEO />
      <Hero />
      <About />
      <VisualResume />
      <Gallery />
    </main>
  )
}
```

**Step 3: Build and verify meta tags appear in static HTML**

```bash
npm run build && grep -i "og:title" dist/index.html
```

Expected: outputs the Open Graph title meta tag, confirming it was pre-rendered into the HTML.

**Step 4: Commit**

```bash
git add src/components/SEO.tsx src/pages/Home.tsx
git commit -m "feat: add SEO meta tags, Open Graph, and JSON-LD person schema"
```

---

## Task 5: Add sitemap.xml and robots.txt

**Files:**
- Create: `public/sitemap.xml`
- Create: `public/robots.txt`

**Step 1: Create `public/sitemap.xml`**

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

**Step 2: Create `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://souravdebnath.com/sitemap.xml
```

**Step 3: Verify both appear in build output**

```bash
npm run build && ls dist/sitemap.xml dist/robots.txt
```

Expected: both files listed.

**Step 4: Commit**

```bash
git add public/sitemap.xml public/robots.txt
git commit -m "feat: add sitemap.xml and robots.txt for search engine indexing"
```

---

## Task 6: Self-Host Fonts

**Files:**
- Modify: `src/index.css`
- Create: `public/fonts/` (directory + woff2 files)

**Step 1: Download font files**

Download the following `.woff2` files from Google Fonts or Fontsource and place in `public/fonts/`:

- Inter 300 (Light): `inter-300.woff2`
- Inter 400 (Regular): `inter-400.woff2`
- Inter 500 (Medium): `inter-500.woff2`
- Inter 600 (SemiBold): `inter-600.woff2`
- JetBrains Mono 400: `jetbrains-mono-400.woff2`

Alternatively, install from npm and copy from `node_modules`:
```bash
npm install --save-dev @fontsource/inter @fontsource/jetbrains-mono
```
Then copy the required woff2 files from `node_modules/@fontsource/inter/files/` to `public/fonts/`.

**Step 2: Update `src/index.css`**

Replace the Google Fonts `@import` line with `@font-face` declarations and add all design tokens:

```css
/* Self-hosted fonts */
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

/* Design tokens */
[data-theme="dark"] {
  --color-bg-primary:     #0c0a09;
  --color-bg-secondary:   #1c1917;
  --color-text-primary:   #f5f5f4;
  --color-text-secondary: #a8a29e;
  --color-text-muted:     #57534e;
  --color-border:         #292524;
}

[data-theme="light"] {
  --color-bg-primary:     #fafaf9;
  --color-bg-secondary:   #f5f5f4;
  --color-text-primary:   #1c1917;
  --color-text-secondary: #57534e;
  --color-text-muted:     #a8a29e;
  --color-border:         #e7e5e4;
}

html, body {
  background-color: #0c0a09;
  color: #f5f5f4;
}

::selection {
  background: #292524;
  color: #f5f5f4;
}

/* Marquee animation */
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
```

**Step 3: Verify fonts load in dev**

```bash
npm run dev
```

Open browser, check Network tab — confirm font requests go to `localhost:5173/fonts/` not `fonts.googleapis.com`.

**Step 4: Commit**

```bash
git add public/fonts/ src/index.css
git commit -m "feat: self-host Inter and JetBrains Mono fonts, add CSS design tokens"
```

---

## Task 7: Create Markdown Content Directory Structure

**Files:**
- Create: `content/experiences/ab-inbev.md`
- Create: `content/experiences/bain.md`
- Create: `content/experiences/vedanta-pm.md`
- Create: `content/experiences/vedanta-ai.md`
- Create: `content/achievements.md`
- Create: `content/gallery.md`
- Create: `content/about.md`

**Step 1: Create `content/experiences/ab-inbev.md`**

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

**Step 2: Create `content/experiences/bain.md`**

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

Strategized Life Insurance business models and developed IT resource forecasting tools. Published a 5-year POV on the $10B+ Indian market.
```

**Step 3: Create `content/experiences/vedanta-pm.md`**

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

Launched a B2B e-commerce platform managing $5B+ in annual transactions. Digitized 30% of sales within a year.
```

**Step 4: Create `content/experiences/vedanta-ai.md`**

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

**Step 5: Create `content/achievements.md`**

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

**Step 6: Create `content/gallery.md`**

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

**Step 7: Create `content/about.md`**

```md
---
stats:
  - label: Experience
    value: "5.5+"
    unit: yrs
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

My background combines technical depth from IIT Madras with strategic business acumen from IIM Bangalore.
```

**Step 8: Commit**

```bash
git add content/
git commit -m "feat: add markdown content files for experiences, achievements, gallery, and about"
```

---

## Task 8: Build Content Parsing Utility

**Files:**
- Create: `src/lib/content.ts`

**Context:** `vite-ssg` runs in a Node.js context at build time, so `fs` and `path` are available. We use `gray-matter` to parse frontmatter and the body. The utility exports typed arrays that are drop-in replacements for `src/data/experiences.ts` exports.

**Step 1: Create `src/lib/content.ts`**

```ts
import matter from 'gray-matter'
import { readFileSync, readdirSync } from 'fs'
import { join, resolve } from 'path'
import type { ExperienceItem } from '../data/experiences'
import type { AchievementItem } from '../data/achievements'
import type { GalleryItem } from '../data/gallery'

const contentDir = resolve(process.cwd(), 'content')

// --- Experiences ---

export function loadExperiences(): ExperienceItem[] {
  const dir = join(contentDir, 'experiences')
  const files = readdirSync(dir).filter(f => f.endsWith('.md'))

  // Preserve desired order
  const order = ['ab-inbev', 'bain', 'vedanta-pm', 'vedanta-ai']

  const items = files.map(file => {
    const raw = readFileSync(join(dir, file), 'utf-8')
    const { data, content } = matter(raw)
    return {
      ...data,
      description: content.trim(),
    } as ExperienceItem
  })

  return order
    .map(id => items.find(i => i.id === id))
    .filter(Boolean) as ExperienceItem[]
}

// --- Achievements ---

export interface AchievementItem {
  name: string
  context: string
  metric: string
  year: string
}

export function loadAchievements(): AchievementItem[] {
  const raw = readFileSync(join(contentDir, 'achievements.md'), 'utf-8')
  const { data } = matter(raw)
  return data.achievements as AchievementItem[]
}

// --- Gallery ---

export function loadGallery(): GalleryItem[] {
  const raw = readFileSync(join(contentDir, 'gallery.md'), 'utf-8')
  const { data } = matter(raw)
  return data.gallery as GalleryItem[]
}

// --- About ---

export interface AboutData {
  stats: { label: string; value: string; unit?: string }[]
  education: { institution: string; degree: string; period: string; gpa: string }[]
  competencies: string[]
  bio: string
}

export function loadAbout(): AboutData {
  const raw = readFileSync(join(contentDir, 'about.md'), 'utf-8')
  const { data, content } = matter(raw)
  return {
    ...data,
    bio: content.trim(),
  } as AboutData
}
```

**Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors. If `fs` or `path` types are missing, run `npm install --save-dev @types/node`.

**Step 3: Commit**

```bash
git add src/lib/content.ts
git commit -m "feat: add gray-matter content parsing utility for markdown files"
```

---

## Task 9: Wire Components to Markdown Content

**Files:**
- Modify: `src/components/About.tsx` (import from `content.ts`)
- Modify: `src/components/VisualResume.tsx` (import from `content.ts`)
- Modify: `src/components/Gallery.tsx` (import from `content.ts`)

**Context:** Components currently import from `src/data/experiences.ts` (static TS arrays). Replace those imports with calls to the content utility. The component render logic stays unchanged — only the data source changes.

**Step 1: Update `src/components/VisualResume.tsx`**

Change:
```ts
import { experiences } from '../data/experiences'
```
To:
```ts
import { loadExperiences } from '../lib/content'
const experiences = loadExperiences()
```

**Step 2: Update `src/components/Gallery.tsx`**

Change the hardcoded `images` array to:
```ts
import { loadGallery } from '../lib/content'
const images = loadGallery()
```

**Step 3: Update `src/components/About.tsx`**

```ts
import { loadAbout } from '../lib/content'
const { bio, stats, education, competencies } = loadAbout()
```

Then use these values in the JSX instead of hardcoded strings.

**Step 4: Build and verify**

```bash
npm run build
```

Expected: build succeeds. Open `dist/index.html` — confirm experience content (e.g. "AB InBev") appears in the raw HTML.

**Step 5: Commit**

```bash
git add src/components/VisualResume.tsx src/components/Gallery.tsx src/components/About.tsx
git commit -m "feat: wire components to markdown content pipeline via gray-matter"
```

---

## Task 10: Remove Legacy TypeScript Data Files

**Files:**
- Delete: `src/data/experiences.ts` (after verifying Task 9 build passes)
- Keep: `src/data/gallery.ts` (interface used by content.ts — keep interface, delete array)
- Keep: `src/data/achievements.ts` (interface used by content.ts — keep interface, delete array)

**Step 1: Strip array data from `src/data/gallery.ts`, keep only the interface**

```ts
export interface GalleryItem {
  src: string
  alt: string
  camera?: string
  lens?: string
  iso?: string
  aperture?: string
}
// Data now lives in content/gallery.md
```

**Step 2: Strip array data from `src/data/achievements.ts`, keep only the interface**

```ts
export interface AchievementItem {
  name: string
  context: string
  metric: string
  year: string
}
// Data now lives in content/achievements.md
```

**Step 3: Delete `src/data/experiences.ts`**

The `ExperienceItem` interface is re-exported from `src/lib/content.ts` now. Check for any remaining imports:

```bash
grep -r "from '../data/experiences'" src/
```

Expected: no results. If any remain, update them to import from `../lib/content`.

**Step 4: Build to confirm nothing broke**

```bash
npm run build
```

Expected: clean build, no TypeScript errors.

**Step 5: Commit**

```bash
git add src/data/ src/lib/content.ts
git commit -m "refactor: remove hardcoded TS data arrays, content now sourced from markdown"
```

---

## Task 11: Security — Fix External Links

**Files:**
- Modify: `src/components/Hero.tsx`
- Modify: `src/components/Navbar.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `src/components/VisualResume.tsx`

**Step 1: Audit all external `<a>` tags**

```bash
grep -rn 'target="_blank"' src/
```

Note every file and line number returned.

**Step 2: Add `rel="noopener noreferrer"` to every result**

For each `<a target="_blank">` found, ensure it reads:
```tsx
<a href="..." target="_blank" rel="noopener noreferrer">
```

**Step 3: Audit for any missed external links (without target="_blank")**

```bash
grep -rn 'href="http' src/
```

For any external `href` without `target="_blank"`, add both `target="_blank"` and `rel="noopener noreferrer"`.

**Step 4: Verify build**

```bash
npm run build
```

**Step 5: Commit**

```bash
git add src/
git commit -m "fix: add rel=noopener noreferrer to all external links"
```

---

## Task 12: Security — npm audit in CI

**Files:**
- Modify: `.github/workflows/deploy.yml`

**Step 1: Read current workflow**

Open `.github/workflows/deploy.yml` and find the step that runs `npm ci` or `npm install`.

**Step 2: Add audit step after install**

Insert after the install step:
```yaml
- name: Audit dependencies
  run: npm audit --audit-level=high
```

This fails the CI pipeline if any high-severity CVE is found in dependencies.

**Step 3: Run audit locally to confirm current state is clean**

```bash
npm audit --audit-level=high
```

Expected: `found 0 vulnerabilities` or only low/moderate severity. If high-severity vulnerabilities are found, run `npm audit fix` before committing.

**Step 4: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add npm audit step to fail deploy on high-severity vulnerabilities"
```

---

## Execution Order

Tasks must run in this order (each depends on the previous):

```
Task 1 (install deps)
  → Task 2 (vite-ssg build)
    → Task 3 (App.tsx routing)
      → Task 4 (SEO meta tags)
        → Task 5 (sitemap + robots.txt)
Task 6 (self-host fonts)         ← independent, can run after Task 1
Task 7 (markdown files)          ← independent, can run after Task 1
  → Task 8 (content.ts utility)
    → Task 9 (wire components)
      → Task 10 (delete legacy data files)
Task 11 (fix external links)     ← independent
Task 12 (CI audit)               ← independent
```

---

## Verification Checklist

After all tasks complete:

- [ ] `npm run build` succeeds with no TypeScript errors
- [ ] `dist/index.html` contains "Sourav Debnath" in raw HTML (not just `<div id="root">`)
- [ ] `dist/index.html` contains `og:title` meta tag
- [ ] `dist/sitemap.xml` and `dist/robots.txt` exist
- [ ] Network tab shows fonts loading from `/fonts/` not `fonts.googleapis.com`
- [ ] `grep -r 'target="_blank"' src/` — every result has `rel="noopener noreferrer"`
- [ ] `npm audit --audit-level=high` returns zero high-severity issues
- [ ] Editing `content/experiences/ab-inbev.md` and rebuilding reflects the change in `dist/index.html`
