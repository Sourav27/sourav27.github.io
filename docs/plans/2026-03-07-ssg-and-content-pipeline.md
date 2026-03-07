# SSG & Markdown Content Pipeline — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enable static pre-rendering (SSG) for SEO and wire the existing `content/*.md` files to the component data layer so content editors can update markdown and rebuild.

**Architecture:** Two independent phases. Phase 1 adds a lightweight content-sync script (`scripts/sync-content.ts`) that reads `content/*.md` files and writes the `src/data/*.ts` files — no SSG required, solves the markdown editing workflow immediately. Phase 2 adds true SSG via Vite's SSR build API: a server entry (`src/entry-server.tsx`) + a prerender script (`scripts/prerender.mjs`) that injects `renderToString` output into `dist/index.html` after the client build. Once SSG is in place, `src/lib/content.ts` (which already uses `readFileSync`) can replace the sync script entirely.

**Tech Stack:** React 19, Vite 7, `react-dom/server` (already in react-dom), `gray-matter` (already installed), `js-yaml` (gray-matter dep, already present), TypeScript + `tsx` for running scripts.

**Essential reading before starting:**
- `docs/plans/tasks.md` — task tracker with all prior decisions and blockers
- `src/lib/content.ts` — existing gray-matter parser (uses `import.meta.glob`, crashes browser — rewrite in Phase 2)
- `src/data/experiences.ts`, `src/data/achievements.ts`, `src/data/gallery.ts` — current TS data files (source of truth until Phase 2)
- `content/` directory — all markdown files already written and matching the TS data
- `vite.config.ts` — minimal config, `@vitejs/plugin-react` + `@tailwindcss/vite`

**Invariants — never break these:**
- `ExperienceItem` interface in `src/data/experiences.ts` — do not change shape
- `cursor-none` + flashlight logic in `src/components/Hero.tsx` — do not touch
- Tailwind v4 with `@tailwindcss/vite` — never switch to PostCSS
- All external links must have `rel="noopener noreferrer"`
- Playwright visual tests must continue to pass after every task

---

## Phase 1 — Content Sync Script (immediate, no SSG required)

This phase solves Task 17 without SSG. A Node.js script reads `content/*.md` files and overwrites the TypeScript data files in `src/data/`. Content editors edit markdown → run `npm run sync` → TypeScript data files update → `npm run build` deploys updated content.

### Task S-1: Create `scripts/sync-content.ts`

**Files:**
- Create: `scripts/sync-content.ts`
- Modify: `package.json` (add `sync` script)

**Step 1: Install `tsx` as a dev dependency (needed to run TypeScript scripts directly)**

```bash
cd D:/sourav27.github.io
npm install --save-dev tsx
```

Verify: `npx tsx --version` — prints a version number.

**Step 2: Create `scripts/sync-content.ts`**

```ts
/**
 * Content sync script.
 * Reads content/*.md files and writes src/data/*.ts files.
 * Run: npm run sync
 */
import matter from 'gray-matter';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';

const ROOT = process.cwd();
const CONTENT = join(ROOT, 'content');
const DATA = join(ROOT, 'src', 'data');

// ── Experiences ──────────────────────────────────────────────────────
const EXPERIENCE_ORDER = ['ab-inbev', 'bain', 'vedanta-pm', 'vedanta-ai'];

function syncExperiences() {
  const dir = join(CONTENT, 'experiences');
  const files = readdirSync(dir).filter((f) => f.endsWith('.md'));

  const items = files.map((file) => {
    const raw = readFileSync(join(dir, file), 'utf-8');
    const { data, content } = matter(raw);
    return { ...data, description: content.trim() };
  });

  const ordered = EXPERIENCE_ORDER
    .map((id) => items.find((i: any) => i.id === id))
    .filter(Boolean);

  const out = `// AUTO-GENERATED — edit content/experiences/*.md and run npm run sync
export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  logo: string;
  image?: string;
  stats: { label: string; value: string }[];
  skills: string[];
  testimonial?: {
    text: string;
    author: string;
    role: string;
    avatar?: string;
  };
}

export const experiences: ExperienceItem[] = ${JSON.stringify(ordered, null, 2)};
`;

  writeFileSync(join(DATA, 'experiences.ts'), out, 'utf-8');
  console.log(`✓ experiences.ts — ${ordered.length} items`);
}

// ── Achievements ─────────────────────────────────────────────────────
function syncAchievements() {
  const raw = readFileSync(join(CONTENT, 'achievements.md'), 'utf-8');
  const { data } = matter(raw);
  const items = data.achievements;

  const out = `// AUTO-GENERATED — edit content/achievements.md and run npm run sync
export interface AchievementItem {
  name: string;
  context: string;
  metric: string;
  year: string;
}

export const achievements: AchievementItem[] = ${JSON.stringify(items, null, 2)};
`;

  writeFileSync(join(DATA, 'achievements.ts'), out, 'utf-8');
  console.log(`✓ achievements.ts — ${items.length} items`);
}

// ── Gallery ──────────────────────────────────────────────────────────
function syncGallery() {
  const raw = readFileSync(join(CONTENT, 'gallery.md'), 'utf-8');
  const { data } = matter(raw);
  const items = data.gallery;

  const out = `// AUTO-GENERATED — edit content/gallery.md and run npm run sync
export interface GalleryItem {
  src: string;
  alt: string;
  camera?: string;
  lens?: string;
  iso?: string;
  aperture?: string;
}

export const gallery: GalleryItem[] = ${JSON.stringify(items, null, 2)};
`;

  writeFileSync(join(DATA, 'gallery.ts'), out, 'utf-8');
  console.log(`✓ gallery.ts — ${items.length} items`);
}

// ── Run ──────────────────────────────────────────────────────────────
syncExperiences();
syncAchievements();
syncGallery();
console.log('\nSync complete. Run npm run build to deploy changes.');
```

**Step 3: Add `sync` script to `package.json`**

In the `scripts` block, add:

```json
"sync": "tsx scripts/sync-content.ts"
```

**Step 4: Run sync and verify output**

```bash
npm run sync
```

Expected output:
```
✓ experiences.ts — 4 items
✓ achievements.ts — 7 items
✓ gallery.ts — 4 items

Sync complete. Run npm run build to deploy changes.
```

Check that `src/data/experiences.ts` now has an `// AUTO-GENERATED` comment at the top and the array is populated.

**Step 5: Verify TypeScript compiles and build passes**

```bash
npx tsc --noEmit
npm run build
```

Expected: zero TS errors, clean build.

**Step 6: Run Playwright tests**

```bash
npx playwright test
```

Expected: 11/11 pass. If any fail, run `npx playwright test --update-snapshots` to refresh baselines (auto-generated data may reformat strings slightly).

**Step 7: Test the round-trip — edit markdown, sync, verify**

Add ` [SYNC-TEST]` to the end of the description body in `content/experiences/ab-inbev.md`. Run:

```bash
npm run sync
grep "SYNC-TEST" src/data/experiences.ts
```

Expected: line found. Revert the edit, run `npm run sync` again, confirm `[SYNC-TEST]` is gone.

**Step 8: Commit**

```bash
git add scripts/sync-content.ts src/data/ package.json package-lock.json
git commit -m "feat: add content sync script — edit content/*.md and run npm run sync"
```

---

### Task S-2: Update `src/lib/content.ts` comment and cleanup

`content.ts` currently has dead `import.meta.glob` code that crashes in the browser (but isn't called anywhere — components now import from `src/data/` directly). Update it to be a proper server-side-only utility with a clear comment, so it's ready for Phase 2.

**Files:**
- Modify: `src/lib/content.ts`

**Step 1: Replace `src/lib/content.ts` entirely**

```ts
/**
 * Server-side content loader — reads markdown files using Node.js fs.
 *
 * USAGE: Only safe to import in server/prerender contexts (Node.js).
 * Do NOT import this in browser component files — it will crash.
 *
 * In a standard Vite SPA build, use src/data/*.ts files instead.
 * In an SSG/prerender build (Phase 2), import from here.
 */
import matter from 'gray-matter';
import { readFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import type { ExperienceItem } from '../data/experiences';
import type { AchievementItem } from '../data/achievements';
import type { GalleryItem } from '../data/gallery';

const contentDir = resolve(process.cwd(), 'content');

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

export function loadAchievements(): AchievementItem[] {
  const raw = readFileSync(join(contentDir, 'achievements.md'), 'utf-8');
  const { data } = matter(raw);
  return data.achievements as AchievementItem[];
}

export function loadGallery(): GalleryItem[] {
  const raw = readFileSync(join(contentDir, 'gallery.md'), 'utf-8');
  const { data } = matter(raw);
  return data.gallery as GalleryItem[];
}

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

Expected: zero errors.

**Step 3: Commit**

```bash
git add src/lib/content.ts
git commit -m "refactor: restore content.ts to fs-based server-only loader, add clear usage comment"
```

---

## Phase 2 — Static Pre-Rendering via Vite SSR

This phase adds true SSG: Vite builds a server bundle, a prerender script calls `renderToString`, and the HTML output is injected into `dist/index.html` before deploy. The site becomes a pre-rendered SPA — crawlers see real HTML, JS still hydrates on the client.

**How Vite SSR works (you need to know this):**

Standard Vite build produces a browser bundle. Vite also supports an SSR build (`vite build --ssr`) that produces a CommonJS/ESM bundle that runs in Node.js. We use this server bundle to call `renderToString(<App />)` and write the result into the already-built `dist/index.html`. The browser JS still hydrates the HTML — users get a fully interactive SPA; crawlers get real HTML content.

### Task S-3: Create `src/entry-server.tsx`

This is the server-side entry point. It exports a single `render` function.

**Files:**
- Create: `src/entry-server.tsx`

**Step 1: Create `src/entry-server.tsx`**

```tsx
import { renderToString } from 'react-dom/server';
import { StrictMode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

export async function render(): Promise<{ html: string; helmet: string }> {
  const helmetContext: Record<string, any> = {};

  const html = renderToString(
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <App />
      </HelmetProvider>
    </StrictMode>
  );

  // Extract helmet tags (title, meta) for injection into <head>
  const { helmet } = helmetContext;
  const helmetHtml = helmet
    ? [
        helmet.title?.toString() ?? '',
        helmet.meta?.toString() ?? '',
        helmet.link?.toString() ?? '',
        helmet.script?.toString() ?? '',
      ].join('\n')
    : '';

  return { html, helmet: helmetHtml };
}
```

**Step 2: Verify TypeScript sees the file**

```bash
npx tsc --noEmit
```

Expected: zero errors. (`renderToString` is part of `react-dom/server` — no extra install needed.)

**Step 3: Commit**

```bash
git add src/entry-server.tsx
git commit -m "feat: add SSR entry point with renderToString and helmet extraction"
```

---

### Task S-4: Create `scripts/prerender.mjs`

This script runs after `vite build`. It builds the server bundle, calls `render()`, and patches `dist/index.html`.

**Files:**
- Create: `scripts/prerender.mjs`

**Step 1: Create `scripts/prerender.mjs`**

```mjs
/**
 * Prerender script — runs after vite build.
 * Builds SSR bundle, renders app to HTML, patches dist/index.html.
 *
 * Run: node scripts/prerender.mjs
 * (Called automatically via npm run build — see package.json)
 */
import { build } from 'vite';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, join } from 'path';
import { pathToFileURL } from 'url';

const ROOT = process.cwd();

async function prerender() {
  console.log('[prerender] Building server bundle...');

  // Build the server-side bundle
  await build({
    build: {
      ssr: 'src/entry-server.tsx',
      outDir: '.ssr-temp',
      emptyOutDir: true,
      rollupOptions: {
        output: { format: 'esm' },
      },
    },
    // Silence output
    logLevel: 'warn',
  });

  console.log('[prerender] Rendering HTML...');

  // Import the server bundle
  const serverEntry = pathToFileURL(
    join(ROOT, '.ssr-temp', 'entry-server.js')
  ).href;
  const { render } = await import(serverEntry);

  const { html: appHtml, helmet: helmetHtml } = await render();

  // Read Vite's client-built index.html
  const template = readFileSync(join(ROOT, 'dist', 'index.html'), 'utf-8');

  // Inject helmet tags into <head>
  let result = template.replace('</head>', `${helmetHtml}\n  </head>`);

  // Inject rendered app HTML into #root
  result = result.replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>`
  );

  // Write back to dist/index.html
  writeFileSync(join(ROOT, 'dist', 'index.html'), result, 'utf-8');

  console.log('[prerender] ✓ dist/index.html patched with pre-rendered HTML');
  console.log('[prerender] Cleaning up server bundle...');

  // Remove temp server bundle
  const { rmSync } = await import('fs');
  rmSync(join(ROOT, '.ssr-temp'), { recursive: true, force: true });

  console.log('[prerender] Done.');
}

prerender().catch((e) => {
  console.error('[prerender] FAILED:', e);
  process.exit(1);
});
```

**Step 2: Add `.ssr-temp` to `.gitignore`**

```bash
echo ".ssr-temp" >> .gitignore
```

**Step 3: Commit**

```bash
git add scripts/prerender.mjs .gitignore
git commit -m "feat: add prerender script — SSR bundle + renderToString patch to dist/index.html"
```

---

### Task S-5: Wire prerender into the build pipeline

**Files:**
- Modify: `package.json`

**Step 1: Update the build script**

Read `package.json` first, then change:

```json
"build": "tsc -b && vite build"
```

To:

```json
"build": "tsc -b && vite build && node scripts/prerender.mjs"
```

**Step 2: Run the full build and verify**

```bash
npm run build
```

Expected output ends with:
```
[prerender] ✓ dist/index.html patched with pre-rendered HTML
[prerender] Done.
```

**Step 3: Verify pre-rendered content in the HTML**

```bash
grep -i "Sourav Debnath" dist/index.html
grep "og:title" dist/index.html
grep -c "stone-" dist/index.html
```

Expected:
- `grep -i "Sourav Debnath"` → at least one match (name is in the rendered HTML, not just JS)
- `grep "og:title"` → one match (helmet injected meta tags)
- `grep -c "stone-"` → number > 0 (Tailwind class names in pre-rendered markup)

Also verify `<div id="root">` is NOT empty:

```bash
grep 'id="root">' dist/index.html | head -1 | cut -c1-80
```

Expected: shows `<div id="root"><div class=...` (has content inside, not just `></div>`).

**Step 4: Run Playwright tests — they should still pass**

```bash
npx playwright test
```

Expected: 11/11 pass. The pre-rendered HTML does not break hydration.

**Step 5: Commit**

```bash
git add package.json
git commit -m "feat: integrate prerender into build pipeline — npm run build now produces pre-rendered HTML"
```

---

### Task S-6: Wire `src/lib/content.ts` to components (completes Task 17)

Now that the build runs in Node.js context (the prerender script), `content.ts` with `readFileSync` works correctly during server render. Wire it up.

**Important:** The data must be available at the module level (not fetched async) because `renderToString` is synchronous. The existing `content.ts` already does this correctly — all `loadX()` functions are synchronous.

**Files:**
- Modify: `src/components/SelectedWork.tsx`
- Modify: `src/components/Achievements.tsx`
- Modify: `src/components/Gallery.tsx`

**Step 1: Update `SelectedWork.tsx`**

Change:
```ts
import { experiences } from '../data/experiences';
```
To:
```ts
import { loadExperiences } from '../lib/content';
const experiences = loadExperiences();
```

**Step 2: Update `Achievements.tsx`**

Change:
```ts
import { achievements } from '../data/achievements';
```
To:
```ts
import { loadAchievements } from '../lib/content';
const achievements = loadAchievements();
```

**Step 3: Update `Gallery.tsx`**

Change:
```ts
import { gallery } from '../data/gallery';
```
To:
```ts
import { loadGallery } from '../lib/content';
const gallery = loadGallery();
```

**Step 4: Configure Vite to treat `fs`/`path` as external in server build**

The prerender script's Vite build call already marks Node built-ins as external by default. Verify nothing extra is needed by running:

```bash
npm run build
```

If build fails with `Cannot find module 'fs'` or similar, add this to `scripts/prerender.mjs` inside the `build({...})` call:

```mjs
ssr: {
  noExternal: [],
  external: ['fs', 'path', 'url'],
},
```

**Step 5: Verify content flows from markdown to HTML**

```bash
npm run build
grep "AB InBev" dist/index.html | head -3
```

Expected: "AB InBev" appears in `dist/index.html` as rendered text (not just in a JS string). This confirms markdown → content.ts → component → pre-rendered HTML pipeline is complete.

**Step 6: Test the full markdown round-trip**

Edit `content/experiences/ab-inbev.md` — change description to end with ` [PIPELINE-TEST]`. Run:

```bash
npm run build
grep "PIPELINE-TEST" dist/index.html
```

Expected: found. Revert the edit, rebuild, confirm it's gone.

**Step 7: Run Playwright tests**

```bash
npx playwright test
```

Expected: 11/11 pass.

**Step 8: Commit**

```bash
git add src/components/SelectedWork.tsx src/components/Achievements.tsx src/components/Gallery.tsx
git commit -m "feat: wire components to markdown via content.ts — completes Task 17"
```

---

### Task S-7: Update CI/CD for SSR build

The GitHub Actions workflow needs `node scripts/prerender.mjs` to run as part of the build, which it will automatically since `npm run build` now calls it. But verify no environment issues.

**Files:**
- Read: `.github/workflows/deploy.yml`
- Modify if needed

**Step 1: Verify the workflow build step**

The current `deploy.yml` runs `npm run build`. Since we updated the build script to include prerender, no change is needed. But check that the workflow doesn't have any `--ssr` flags or special handling that would conflict.

```bash
grep "build" .github/workflows/deploy.yml
```

Expected: just `run: npm run build`.

**Step 2: Add `.ssr-temp` to the artifact exclusion (safety)**

The `upload-pages-artifact` action uploads `./dist` only — `.ssr-temp` is in the root and won't be included. Confirm:

```bash
grep "path:" .github/workflows/deploy.yml
```

Expected: `path: ./dist`. No action needed.

**Step 3: Run the final full verification checklist**

```bash
# 1. Full build with prerender
npm run build

# 2. Pre-rendered content in HTML
grep -i "sourav debnath" dist/index.html

# 3. OG meta tag present (from helmet injection)
grep "og:title" dist/index.html

# 4. Sitemap and robots in dist
ls dist/sitemap.xml dist/robots.txt

# 5. No Google Fonts
grep "googleapis" dist/index.html || echo "clean"

# 6. No orange classes in src
grep -r "orange-" src/ || echo "clean"

# 7. External link security
grep -rn 'target="_blank"' src/ | grep -v 'noopener' || echo "clean"

# 8. Dependency audit
npm audit --audit-level=high

# 9. Playwright tests
npx playwright test
```

All 9 checks must pass.

**Step 4: Commit**

```bash
git add .github/workflows/deploy.yml  # only if changed
git commit -m "ci: verify SSR prerender pipeline works end-to-end in build"
```

---

## Final State After Both Phases

**Content editing workflow:**
```
Edit content/*.md
  → npm run sync      (Phase 1: updates src/data/*.ts)
  → npm run build     (Phase 2: prerender uses readFileSync directly, bypasses sync)
  → git push origin main
  → GitHub Actions deploys pre-rendered HTML
```

**After Phase 2, `npm run sync` is no longer needed** — `npm run build` reads markdown directly via `content.ts`. Keep the sync script for local development convenience (fast preview without full build).

**Build pipeline (after Phase 2):**
```
tsc -b              (TypeScript type check)
vite build          (client bundle → dist/)
node scripts/prerender.mjs
  → vite build --ssr src/entry-server.tsx → .ssr-temp/
  → import .ssr-temp/entry-server.js
  → render() → renderToString(<App />) + helmet tags
  → patch dist/index.html
  → rm -rf .ssr-temp
```

**What remains for the future:**
- Real images in `public/images/` (currently using Unsplash URLs for gallery)
- Real resume PDF at `public/resume.pdf`
- OG image at `public/og-image.jpg`
- V-3 Stitch comparison helper (re-fetch from Stitch MCP when needed)

---

## Task Execution Order

```
Phase 1 (no SSG needed — do first):
  Task S-1  →  content sync script
  Task S-2  →  clean up content.ts

Phase 2 (SSG):
  Task S-3  →  entry-server.tsx
  Task S-4  →  prerender.mjs
  Task S-5  →  wire into build pipeline  ← first full SSG build check
  Task S-6  →  wire content.ts to components  ← completes Task 17
  Task S-7  →  CI/CD verification  ← final check before push
```
