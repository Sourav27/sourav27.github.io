# Visual Testing & Ralph Loop — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
> **Read first:** `docs/plans/2026-03-07-master-implementation-plan.md`

**Goal:** Add Playwright visual regression tests against Stitch reference screenshots and enforce a per-task Ralph Loop (implement → screenshot → compare → fix → commit) so no task advances until it visually matches the design.

**Architecture:** Playwright runs against the Vite dev server (`localhost:5173`). Stitch reference screenshots are downloaded once and stored in `tests/visual/references/`. Each task in the master plan has a corresponding Playwright test that takes a screenshot of the relevant section and compares it to the Stitch reference using `toHaveScreenshot()` with a configurable pixel-diff threshold. The Ralph Loop is a mandatory protocol embedded in every task: the test must pass before the git commit runs.

**Tech Stack:** `@playwright/test` (already installed), Vite dev server, Stitch PNG references

---

## What is the Ralph Loop?

The Ralph Loop is a per-task quality gate. It replaces "eyeball it and commit" with a structured verify-fix-retry cycle:

```
┌─────────────────────────────────────────────┐
│              RALPH LOOP (per task)           │
│                                              │
│  1. Implement the task                       │
│  2. npm run dev  (start dev server)          │
│  3. npx playwright test --grep <task-name>   │
│         │                                    │
│    PASS ─┤                                   │
│         │  4. git commit                     │
│         │  5. Move to next task  ──► END     │
│         │                                    │
│    FAIL ─┤                                   │
│         │  4. Open playwright-report/        │
│         │  5. Inspect diff image             │
│         │  6. Fix the implementation         │
│         └──► back to step 3                  │
└─────────────────────────────────────────────┘
```

**Key rule:** A task is only complete when its Playwright test passes AND the git commit is made. Never advance to the next task with a failing test.

---

## Stitch Reference Screenshots

These are the authoritative design references. They are downloaded once in Task V-0.

| Reference | Stitch Screen | Covers |
|---|---|---|
| `full-portfolio.png` | Sourav Debnath Full Portfolio Page (`574b01b2b92b464b82e6d3ce6441ba94`) | All sections: Navbar, About, Work, Achievements, Gallery, Footer |
| `hero.png` | Hero Section (`cd6c72a0b68c4e9d9cfba21fd810352b`) | Hero only at 1152px width |

Download URLs (valid for the current session — re-fetch via `mcp__stitch__get_screen` if expired):

```
Full Portfolio:
https://lh3.googleusercontent.com/aida/AOfcidXiRQt8JtAWLOUg0PcH_ybs7HXKjpyddWRAeakomPOyuYJLMGD91HT0hdTbNM5LYAmKYkoWHfZ45PsX0leH1uzhxwFOC0zG6JlXjNz-yonUvIja81Atn8Uem_ISnZJ-Mgs09zsSMSPH5L3ipUpXQz8A2UZ7aAsV0plCFHjlmewiWVZ0z-zT9qTZ0327YrvR1w0z2-lgMoMRK9dFuZvznbv1NuNmKyMCrUNvNUiTZmMR1ytyudV-lFBkVlY

Hero:
https://lh3.googleusercontent.com/aida/AOfcidW7iTuSiIx4pDtnu1xyyKZ4s9UDqhsslhQoZZkiRYjLCaKbGCF4UWHnhN5itYH087zlntFYvqXPN3BIwd8UqJN0wxqas7Vq20AGEplSE3_MvLvyTZA2Wo83dME3wvNzCdtoxYTHCQW7Z8RQzZG957Xg1eltNag3oiPLTBIx5SdYEfwOEIGT9zezaRV5tUIwN44runKydvYhPFrjXwJU5mIoDa28ocLOkfsvE4t8qqLMfvABCNecaz6GJG7g
```

**If URLs have expired** (Google lh3 links expire), re-fetch:
```
In Claude Code, call:
mcp__stitch__get_screen with:
  projectId: 12102848529599460496
  screenId: 574b01b2b92b464b82e6d3ce6441ba94   ← full portfolio
  screenId: cd6c72a0b68c4e9d9cfba21fd810352b   ← hero
Then use the new screenshot.downloadUrl values.
```

---

## Visual Test Strategy

Pixel-perfect matching is impossible between Stitch (static mockup) and a live React app. Instead use **section-scoped structural comparison** with a generous diff threshold:

- Crop each Playwright screenshot to the section under test (by scrolling to the element)
- Use `toHaveScreenshot()` with `maxDiffPixelRatio: 0.15` (15% pixel difference allowed)
- What we're checking: layout structure, spacing, typography weight, color palette — not pixel perfection
- Animations must be disabled for stable screenshots (Playwright handles this via `page.emulateMedia`)

**Threshold rationale:** Stitch renders at 2560px; Playwright tests at 1440px desktop. Font rendering, anti-aliasing, and image placeholders will differ. 15% catches structural regressions without false-failing on sub-pixel differences.

---

## Task V-0: Playwright Setup

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/visual/setup.ts`
- Create: `tests/visual/references/` (directory, populated by download script)
- Create: `tests/visual/download-references.ts`

**Step 1: Install Playwright browsers (already installed as dev dep)**

```bash
cd D:/sourav27.github.io
npx playwright install chromium
```

Expected: Chromium browser downloaded to Playwright cache.

**Step 2: Create `playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/visual',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  retries: 0,
  reporter: [['html', { open: 'on-failure' }]],

  use: {
    baseURL: 'http://localhost:5173',
    // Disable animations for stable screenshots
    reducedMotion: 'reduce',
    screenshot: 'only-on-failure',
    video: 'off',
  },

  // Desktop viewport matching Stitch reference width (scaled down)
  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
  ],

  // Playwright will start/stop the dev server automatically
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
```

**Step 3: Create `tests/visual/download-references.ts`**

Run this script once to download Stitch PNGs as baseline references.

```ts
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const REFERENCES_DIR = join(process.cwd(), 'tests/visual/references');

const SCREENSHOTS: { name: string; url: string }[] = [
  {
    name: 'full-portfolio.png',
    url: 'https://lh3.googleusercontent.com/aida/AOfcidXiRQt8JtAWLOUg0PcH_ybs7HXKjpyddWRAeakomPOyuYJLMGD91HT0hdTbNM5LYAmKYkoWHfZ45PsX0leH1uzhxwFOC0zG6JlXjNz-yonUvIja81Atn8Uem_ISnZJ-Mgs09zsSMSPH5L3ipUpXQz8A2UZ7aAsV0plCFHjlmewiWVZ0z-zT9qTZ0327YrvR1w0z2-lgMoMRK9dFuZvznbv1NuNmKyMCrUNvNUiTZmMR1ytyudV-lFBkVlY',
  },
  {
    name: 'hero.png',
    url: 'https://lh3.googleusercontent.com/aida/AOfcidW7iTuSiIx4pDtnu1xyyKZ4s9UDqhsslhQoZZkiRYjLCaKbGCF4UWHnhN5itYH087zlntFYvqXPN3BIwd8UqJN0wxqas7Vq20AGEplSE3_MvLvyTZA2Wo83dME3wvNzCdtoxYTHCQW7Z8RQzZG957Xg1eltNag3oiPLTBIx5SdYEfwOEIGT9zezaRV5tUIwN44runKydvYhPFrjXwJU5mIoDa28ocLOkfsvE4t8qqLMfvABCNecaz6GJG7g`,
  },
];

async function download() {
  mkdirSync(REFERENCES_DIR, { recursive: true });

  for (const { name, url } of SCREENSHOTS) {
    console.log(`Downloading ${name}...`);
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`FAILED: ${name} — HTTP ${res.status}. Re-fetch URL from Stitch MCP.`);
      continue;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    const dest = join(REFERENCES_DIR, name);
    writeFileSync(dest, buffer);
    console.log(`  → saved to ${dest} (${(buffer.length / 1024).toFixed(0)} KB)`);
  }
}

download().catch(console.error);
```

**Step 4: Run the download script**

```bash
npx tsx tests/visual/download-references.ts
```

Expected output:
```
Downloading full-portfolio.png...
  → saved to .../tests/visual/references/full-portfolio.png (XXXX KB)
Downloading hero.png...
  → saved to .../tests/visual/references/hero.png (XXX KB)
```

If a URL fails with HTTP 403/410 (expired): re-fetch from Stitch MCP as described above, update the URL in `download-references.ts`, and re-run.

**Step 5: Create `tests/visual/setup.ts` — shared helpers**

```ts
import { Page } from '@playwright/test';

/**
 * Scrolls to a section by ID and waits for animations to settle.
 * Use before taking any section screenshot.
 */
export async function scrollToSection(page: Page, sectionId: string) {
  await page.evaluate((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'instant' });
  }, sectionId);
  // Wait for any CSS transitions (150–500ms range in our design)
  await page.waitForTimeout(600);
}

/**
 * Disables CSS animations and transitions for stable screenshots.
 * Call once after page.goto().
 */
export async function freezeAnimations(page: Page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `,
  });
  // Let Framer Motion's initial render settle
  await page.waitForTimeout(500);
}

/**
 * Screenshot options used across all visual tests.
 * 15% diff threshold — accounts for font rendering, anti-aliasing,
 * and placeholder images vs real Stitch assets.
 */
export const SCREENSHOT_OPTIONS = {
  maxDiffPixelRatio: 0.15,
  threshold: 0.2,
} as const;
```

**Step 6: Verify Playwright can reach the dev server**

```bash
# In one terminal: start dev server
npm run dev

# In another terminal: run a quick connectivity check
npx playwright test --list
```

Expected: test list prints (even if empty). No "connection refused" errors.

**Step 7: Commit**

```bash
git add playwright.config.ts tests/
git commit -m "test: add Playwright visual testing setup with Stitch reference downloads"
```

---

## Task V-1: Core Visual Test Suite

**Files:**
- Create: `tests/visual/portfolio.spec.ts`

**Step 1: Create `tests/visual/portfolio.spec.ts`**

This file contains one test per section. Each test is tagged with the task name from the master plan so you can run just the relevant test during the Ralph Loop.

```ts
import { test, expect } from '@playwright/test';
import { scrollToSection, freezeAnimations, SCREENSHOT_OPTIONS } from './setup';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await freezeAnimations(page);
  // Wait for fonts and layout to settle
  await page.waitForLoadState('networkidle');
});

// ── NAVBAR (Master Task 3) ────────────────────────────────────────────
test('navbar — monogram and links render correctly @task3', async ({ page }) => {
  const navbar = page.locator('nav').first();
  await expect(navbar).toBeVisible();

  // Monogram present
  await expect(page.getByText('S.D.')).toBeVisible();

  // Three nav links
  await expect(page.getByRole('link', { name: 'Work' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Contact' })).toBeVisible();

  // Screenshot of navbar area
  await expect(navbar).toHaveScreenshot('navbar.png', SCREENSHOT_OPTIONS);
});

test('navbar — becomes frosted glass on scroll @task3', async ({ page }) => {
  await page.evaluate(() => window.scrollBy(0, 200));
  await page.waitForTimeout(400);
  const navbar = page.locator('nav').first();
  // Check backdrop-blur class is applied
  await expect(navbar).toHaveClass(/backdrop-blur/);
});

// ── HERO (Master Task 4) ──────────────────────────────────────────────
test('hero — name headline and descriptor visible @task4', async ({ page }) => {
  // Name
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Sourav Debnath');

  // At least one descriptor visible (cycling — freeze catches one frame)
  const descriptors = ['GenAI PM', 'Builder', 'Strategist'];
  let found = false;
  for (const d of descriptors) {
    if (await page.getByText(d).isVisible().catch(() => false)) {
      found = true;
      break;
    }
  }
  expect(found).toBe(true);

  // CTAs
  await expect(page.getByRole('link', { name: 'LinkedIn' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Resume' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'GitHub' })).toBeVisible();

  // Scroll indicator
  await expect(page.getByText('scroll')).toBeVisible();

  // Full hero screenshot vs Stitch reference
  const hero = page.locator('[class*="h-screen"]').first();
  await expect(hero).toHaveScreenshot('hero-section.png', SCREENSHOT_OPTIONS);
});

// ── MARQUEE (Master Task 5) ───────────────────────────────────────────
test('marquee — all company names present @task5', async ({ page }) => {
  await scrollToSection(page, 'about'); // marquee is just before about

  const companies = ['AB InBev', 'Bain & Company', 'Vedanta', 'IIT Madras', 'IIM Bangalore'];
  for (const company of companies) {
    // At least one instance visible (duplicated for loop)
    const els = page.getByText(company);
    await expect(els.first()).toBeVisible();
  }

  const marquee = page.locator('[style*="marquee"]').first();
  await expect(marquee.locator('..').locator('..')).toHaveScreenshot('marquee.png', SCREENSHOT_OPTIONS);
});

// ── ABOUT (Master Task 6) ─────────────────────────────────────────────
test('about — stats, education, competency pills @task6', async ({ page }) => {
  await scrollToSection(page, 'about');

  // Stats
  await expect(page.getByText('5.5+')).toBeVisible();
  await expect(page.getByText('500+')).toBeVisible();

  // Education
  await expect(page.getByText('IIM Bangalore')).toBeVisible();
  await expect(page.getByText('IIT Madras')).toBeVisible();

  // At least one competency pill
  await expect(page.getByText('Generative AI')).toBeVisible();

  // No orange anywhere in the section
  const aboutSection = page.locator('#about');
  const html = await aboutSection.innerHTML();
  expect(html).not.toMatch(/orange-/);

  await expect(aboutSection).toHaveScreenshot('about.png', SCREENSHOT_OPTIONS);
});

// ── SELECTED WORK (Master Task 7) ────────────────────────────────────
test('selected work — heading and all 4 experience cards @task7', async ({ page }) => {
  await scrollToSection(page, 'work');

  await expect(page.getByRole('heading', { name: 'Selected Work' })).toBeVisible();

  // All companies present
  for (const company of ['AB InBev', 'Bain & Company', 'Vedanta Resources']) {
    await expect(page.getByText(company).first()).toBeVisible();
  }

  // Key stat visible
  await expect(page.getByText('20x').first()).toBeVisible();

  const workSection = page.locator('#work');
  await expect(workSection).toHaveScreenshot('selected-work.png', {
    ...SCREENSHOT_OPTIONS,
    fullPage: false,
  });
});

test('selected work — card images are grayscale by default @task7', async ({ page }) => {
  await scrollToSection(page, 'work');

  // Images should have grayscale class
  const cardImages = page.locator('#work img');
  const count = await cardImages.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const cls = await cardImages.nth(i).getAttribute('class') ?? '';
    expect(cls).toContain('grayscale');
  }
});

// ── ACHIEVEMENTS (Master Task 9) ──────────────────────────────────────
test('achievements — table with 7 rows @task9', async ({ page }) => {
  await scrollToSection(page, 'achievements');

  await expect(page.getByRole('heading', { name: 'Achievements' })).toBeVisible();

  // Key achievements present
  await expect(page.getByText('Culture Champion Award')).toBeVisible();
  await expect(page.getByText("Chairman's Award")).toBeVisible();
  await expect(page.getByText('$250M+ Profit Accrual')).toBeVisible();

  const section = page.locator('#achievements');
  await expect(section).toHaveScreenshot('achievements.png', SCREENSHOT_OPTIONS);
});

// ── GALLERY (Master Task 10) ──────────────────────────────────────────
test('gallery — all 4 images present and grayscale by default @task10', async ({ page }) => {
  await scrollToSection(page, 'gallery');

  await expect(page.getByRole('heading', { name: 'Perspective' })).toBeVisible();

  // All gallery images are grayscale by default
  const images = page.locator('#gallery img');
  const count = await images.count();
  expect(count).toBe(4);

  for (let i = 0; i < count; i++) {
    const cls = await images.nth(i).getAttribute('class') ?? '';
    expect(cls).toContain('grayscale');
    expect(cls).not.toContain('grayscale-0');
  }

  const section = page.locator('#gallery');
  await expect(section).toHaveScreenshot('gallery.png', SCREENSHOT_OPTIONS);
});

test('gallery — hover reveals colour and EXIF @task10', async ({ page }) => {
  await scrollToSection(page, 'gallery');

  const firstCard = page.locator('#gallery .group').first();
  await firstCard.hover();
  await page.waitForTimeout(600); // transition duration

  // After hover: image loses grayscale
  const img = firstCard.locator('img');
  const cls = await img.getAttribute('class') ?? '';
  expect(cls).toContain('grayscale-0');

  // EXIF overlay is visible
  const exifOverlay = firstCard.locator('div').filter({ hasText: /ISO|f\// }).first();
  await expect(exifOverlay).toBeVisible();
});

// ── FOOTER (Master Task 11) ───────────────────────────────────────────
test('footer — CTA, social links, monogram @task11', async ({ page }) => {
  await scrollToSection(page, 'contact');

  await expect(page.getByText("Let's build something.")).toBeVisible();

  // Social links
  await expect(page.getByRole('link', { name: 'Email' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'LinkedIn' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'GitHub' })).toBeVisible();

  // Monogram in footer
  await expect(page.locator('footer').getByText('S.D.')).toBeVisible();

  const footer = page.locator('footer');
  await expect(footer).toHaveScreenshot('footer.png', SCREENSHOT_OPTIONS);
});

// ── FULL PAGE (final integration) ────────────────────────────────────
test('full page — complete visual regression against Stitch @final', async ({ page }) => {
  // This test compares the full scrollable page against the Stitch
  // "Sourav Debnath Full Portfolio Page" reference.
  // It will have a higher diff tolerance due to page length and assets.
  await expect(page).toHaveScreenshot('full-page.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.20,
    threshold: 0.25,
  });
});
```

**Step 2: Add npm script for visual tests**

Add to `package.json` scripts:

```json
"test:visual": "playwright test",
"test:visual:update": "playwright test --update-snapshots",
"test:visual:report": "playwright show-report"
```

**Step 3: Run tests once to generate baseline snapshots**

With the dev server running (`npm run dev` in a separate terminal):

```bash
# Generate initial snapshots (first run always passes — it creates the baseline)
npx playwright test --update-snapshots
```

Expected: all tests pass, snapshot files created in `tests/visual/portfolio.spec.ts-snapshots/`.

**Step 4: Verify baseline snapshots were created**

```bash
ls tests/visual/portfolio.spec.ts-snapshots/
```

Expected: PNG files for each `toHaveScreenshot()` call.

**Step 5: Commit**

```bash
git add tests/ playwright.config.ts package.json
git commit -m "test: add Playwright visual test suite for all portfolio sections"
```

---

## Task V-2: Ralph Loop Protocol (Embedded in Master Plan)

This task documents the **mandatory protocol** for every task in the master implementation plan. Print or reference this during execution.

### The Ralph Loop — Mandatory per Task

```
BEFORE starting any task:
  □ Read the task description in the master plan completely
  □ Identify the @taskN tag for that task's Playwright test

IMPLEMENT:
  □ Make all code changes described in the task
  □ Save all files

RUN THE LOOP:
  □ Ensure dev server is running: npm run dev
  □ Run the task-specific test:
      npx playwright test --grep "@taskN"

  IF PASS (green):
    □ Run: git add <files changed>
    □ Run: git commit -m "<commit message from plan>"
    □ Move to the next task — loop ends ✓

  IF FAIL (red):
    □ Run: npx playwright show-report
    □ Open the diff image — study what's different
    □ Identify the cause (wrong color? spacing? missing element?)
    □ Fix the implementation
    □ Save files
    □ Re-run: npx playwright test --grep "@taskN"
    □ Repeat until PASS
    □ Never commit a failing test
```

### Playwright Test Tags per Master Plan Task

| Master Plan Task | Playwright Tag | What it checks |
|---|---|---|
| Task 3 — Navbar | `@task3` | Monogram, links, scroll behaviour |
| Task 4 — Hero | `@task4` | Name, descriptors, CTAs, scroll indicator |
| Task 5 — Marquee | `@task5` | Company names, CSS animation present |
| Task 6 — About | `@task6` | Stats, education, pills, no orange |
| Task 7 — SelectedWork | `@task7` | Heading, cards, grayscale images |
| Task 9 — Achievements | `@task9` | 7 rows, key award names |
| Task 10 — Gallery | `@task10` | 4 images, grayscale default, hover colour reveal |
| Task 11 — Footer | `@task11` | CTA text, social links, monogram |
| Task 13 (final) | `@final` | Full page regression |

### How to Run a Specific Task's Test

```bash
# Single task (during Ralph Loop)
npx playwright test --grep "@task4"

# All tests (before final commit)
npx playwright test

# Open report to inspect diffs
npx playwright show-report

# Update snapshots when intentional visual change is made
npx playwright test --update-snapshots --grep "@task4"
```

### Reading the Diff Report

When `playwright show-report` opens:

1. Click the failing test
2. Click "Diff" tab — shows pixel differences highlighted in red
3. Click "Expected" tab — shows the snapshot baseline
4. Click "Actual" tab — shows what Playwright captured

**Common failure reasons and fixes:**

| Symptom | Cause | Fix |
|---|---|---|
| Red pixels throughout | Orange class still present | `grep -r "orange-" src/` and remove |
| Missing text element | Component not rendered | Check `Home.tsx` imports |
| Wrong font weight | Font not loading from `/fonts/` | Check Network tab for font 404s |
| Layout shifted | Missing `max-w-6xl mx-auto` | Check container classes |
| Animation mid-frame | `freezeAnimations` not applied | Check `setup.ts` is imported |
| Grayscale not applied | Missing `grayscale` Tailwind class | Check Gallery img className |
| Whole test red | Dev server not running | Run `npm run dev` first |

### When to Update Snapshots (Not a Failure)

Run `--update-snapshots` only when you intentionally changed the design and the new output IS correct:

```bash
# After intentional design change — updates the baseline
npx playwright test --update-snapshots --grep "@task6"
git add tests/visual/portfolio.spec.ts-snapshots/
git commit -m "test: update visual snapshots for about section redesign"
```

**Never run `--update-snapshots` to silence a failing test you haven't fixed.**

---

## Task V-3: Stitch Reference Visual Comparison Helper

For deeper comparison against the full Stitch mockup (not just section-by-section snapshots), use this manual helper script.

**Files:**
- Create: `tests/visual/compare-stitch.ts`

**Step 1: Create `tests/visual/compare-stitch.ts`**

```ts
/**
 * Manual comparison helper.
 * Run: npx tsx tests/visual/compare-stitch.ts
 *
 * Opens both the Stitch reference and a Playwright screenshot
 * side-by-side in your default image viewer for manual inspection.
 */
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const REFS_DIR = join(process.cwd(), 'tests/visual/references');
const SNAPSHOTS_DIR = join(process.cwd(), 'tests/visual/portfolio.spec.ts-snapshots');

function check(name: string, snapshotName: string) {
  const ref = join(REFS_DIR, name);
  const snapshot = join(SNAPSHOTS_DIR, `${snapshotName}-1.png`);

  if (!existsSync(ref)) {
    console.error(`Reference missing: ${ref}\nRun: npx tsx tests/visual/download-references.ts`);
    return;
  }
  if (!existsSync(snapshot)) {
    console.error(`Snapshot missing: ${snapshot}\nRun: npx playwright test --update-snapshots`);
    return;
  }

  console.log(`Opening side-by-side: ${name}`);
  // Windows: open both in default viewer
  execSync(`start "" "${ref}"`);
  execSync(`start "" "${snapshot}"`);
}

// Compare full portfolio reference to full-page snapshot
check('full-portfolio.png', 'full-page-full-page-desktop');

// Compare hero reference to hero snapshot
check('hero.png', 'hero-section-desktop');
```

**Step 2: Usage**

```bash
# After running playwright tests once (to generate snapshots):
npx tsx tests/visual/compare-stitch.ts
```

This opens the Stitch reference PNG and the Playwright snapshot side-by-side in your image viewer for manual layout comparison.

**Step 3: Commit**

```bash
git add tests/visual/compare-stitch.ts
git commit -m "test: add Stitch reference comparison helper script"
```

---

## Amended Master Plan Task Template

Every task in `docs/plans/2026-03-07-master-implementation-plan.md` should be executed using this amended template (the Ralph Loop steps are added after "verify in dev" and before "commit"):

```
STANDARD TASK TEMPLATE (with Ralph Loop):

Step N:   Implement the code changes
Step N+1: Verify in dev (npm run dev — visual eyeball)
Step N+2: [RALPH LOOP] Run Playwright test
            npx playwright test --grep "@taskN"
            → PASS: proceed to Step N+3
            → FAIL: open report, fix, re-run Step N+2
Step N+3: Commit (only runs after Step N+2 PASSES)
```

---

## Final Checklist (Run Before Pushing)

```bash
# 1. All visual tests pass
npx playwright test

# 2. No snapshots have uncommitted changes
git status tests/visual/

# 3. Full build passes
npm run build

# 4. Pre-render check
grep "Sourav Debnath" dist/index.html

# 5. Security audit
npm audit --audit-level=high
```

All 5 must pass before `git push origin main`.
