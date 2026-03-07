# Portfolio Implementation — Task Tracker

Last updated: 2026-03-08

## Blockers / Decisions Log

| Date | Decision |
|---|---|
| 2026-03-07 | `vite-ssg` is Vue-only. `vite-react-ssg` requires React Router v6 data routes — incompatible with our v7 setup. **Decision: skip SSG, keep standard Vite SPA build. SEO via react-helmet-async still works.** |

---

## Phase 0 — Dependencies

| Task | Status | Notes |
|---|---|---|
| Task 0: Install packages | ✅ done | vite-ssg removed, react-helmet-async + gray-matter installed |

---

## Phase 1 — Foundation

| Task | Status | Notes |
|---|---|---|
| Task 1: Rewrite `src/index.css` | ✅ done | Self-hosted fonts, design tokens, marquee keyframe |
| Task 2: Update `src/App.tsx` + SSG | ✅ done (partial) | App.tsx updated with HelmetProvider + data-theme. SSG skipped — standard Vite build retained. |

---

## Phase 2 — Navbar

| Task | Status | Notes |
|---|---|---|
| Task 3: Rebuild `src/components/Navbar.tsx` | ✅ done | Monogram S.D., scroll frosted glass, mobile fullscreen overlay, Escape key close |

---

## Phase 3 — Hero

| Task | Status | Notes |
|---|---|---|
| Task 4: Rebuild `src/components/Hero.tsx` | ✅ done | Name headline, rotating descriptors, stone cursor, scroll indicator, orange removed |

---

## Phase 4 — Marquee

| Task | Status | Notes |
|---|---|---|
| Task 5: Create `src/components/Marquee.tsx` | ✅ done | CSS-driven infinite scroll, stone-600 text |

---

## Phase 5 — About

| Task | Status | Notes |
|---|---|---|
| Task 6: Refactor `src/components/About.tsx` | ✅ done | Two-col layout, stats, education, competency pills, orange removed |

---

## Phase 6 — SelectedWork

| Task | Status | Notes |
|---|---|---|
| Task 7: Rename VisualResume → SelectedWork | ✅ done | SelectedWork.tsx created, VisualResume.tsx deleted, Home.tsx updated |

---

## Phase 7 — Achievements

| Task | Status | Notes |
|---|---|---|
| Task 8: Create `src/data/achievements.ts` | ✅ done | 7 achievements with name/context/metric/year |
| Task 9: Create `src/components/Achievements.tsx` | ✅ done | Staggered table layout, 7 rows |

---

## Phase 8 — Gallery

| Task | Status | Notes |
|---|---|---|
| Task 10: Create `src/data/gallery.ts` + refactor Gallery | ✅ done | Grayscale default, colour+EXIF on hover, data moved to gallery.ts |

---

## Phase 9 — Footer

| Task | Status | Notes |
|---|---|---|
| Task 11: Rebuild `src/components/Footer.tsx` | ✅ done | Large CTA, social text links, S.D. monogram |

---

## Phase 10 — SEO

| Task | Status | Notes |
|---|---|---|
| Task 12: Create `src/components/SEO.tsx` + sitemap + robots | ✅ done | OG tags, JSON-LD schema, sitemap.xml, robots.txt |

---

## Phase 11 — Home Orchestration

| Task | Status | Notes |
|---|---|---|
| Task 13: Update `src/pages/Home.tsx` | ✅ done | All sections wired: SEO→Hero→Marquee→About→Work→Achievements→Gallery. Build passes. |

---

## Phase 12 — Security

| Task | Status | Notes |
|---|---|---|
| Task 14: External link audit + CI audit step | ✅ done | `npm audit --audit-level=high` added to deploy.yml; all blank targets verified with noopener |

---

## Phase 13 — Markdown Content Pipeline

| Task | Status | Notes |
|---|---|---|
| Task 15: Create `content/` directory + markdown files | ✅ done | All 4 experience .md files, achievements.md, gallery.md, about.md |
| Task 16: Create `src/lib/content.ts` | ✅ done | Uses import.meta.glob + gray-matter; browser-safe utility for future SSG use |
| Task 17: Wire components to markdown | ⚠️ partial | gray-matter crashes React at runtime in SPA (no SSG). Components kept on TS data files. Markdown + content.ts preserved for when SSG is added. |

---

## Visual Testing (Ralph Loop)

| Task | Status | Notes |
|---|---|---|
| Task V-0: Playwright setup | ✅ done | playwright.config.ts, tests/visual/setup.ts, Chromium installed |
| Task V-1: Core visual test suite | ✅ done | 11/11 tests pass, baseline snapshots generated |
| Task V-2: Ralph Loop protocol | ✅ done | Reference doc only — protocol embedded in plan |
| Task V-3: Stitch comparison helper | ⏭️ skipped | Stitch URLs have expired; manual comparison not needed now that baselines exist |

---

## Phase 14 — UI Polish (PR #3, merged 2026-03-08)

| Task | Status | Notes |
|---|---|---|
| P-1: Navbar — remove scroll border, add theme toggle | ✅ done | Removed `border-b border-stone-800` on scroll; added sun/moon toggle button to desktop + mobile menus; `App.tsx` reads OS preference via `matchMedia` on mount and listens for changes |
| P-2: Hero — match "Hello! I'm" size to name | ✅ done | Both greeting and name set to `clamp(48px,8vw,88px) font-normal` |
| P-3: Hero typewriter — sentence case, fullstop, GenAI PM accent | ✅ done | Roles updated to `['GenAI PM.', 'Builder.', 'Strategist.']`; Inter font, normal tracking; "GenAI PM." renders in stone-100/stone-900, others in muted tone |
| P-4: Hero links — add Email, reorder, size base | ✅ done | Links reordered to Resume / Email / LinkedIn / GitHub; `text-base`; all external links have `rel="noopener noreferrer"` |
| P-5: AISection — add monochrome portfolio photo | ✅ done | Two-column layout with text left, `grayscale` photo right (`/images/portfolio.jpg`) |
| P-6: Hyperlink accent — replace orange with #195DE6 | ✅ done | `hover:text-orange-500` → `hover:text-[#195DE6]` in SelectedWork; `--color-accent: #195DE6` added to both theme tokens; `::selection` updated |
| P-7: SelectedWork KPIs — flex-wrap layout | ✅ done | Grid → `flex flex-wrap gap-x-8 gap-y-6`; value font reduced to `36px`/`48px`; `break-all` on value, `whitespace-nowrap` on label |
| P-8: Footer — scroll-to-top button | ✅ done | Circle button with chevron-up SVG added to footer bar right side; `cursor-pointer` set |
| P-9: Gallery — asymmetric 1+3 layout + Instagram link | ✅ done | Large `aspect-[3/4]` image left, 3 smaller in right column; "View more on Instagram" link left-aligned below grid |
| P-10: Footer CTA — hero-scale typography | ✅ done | `<p>` → `<h2>`; `clamp(48px,8vw,88px) font-normal`; explicit `<br />` for two-line break |

### Light Mode (Option B — Tailwind dark: class strategy)

| Item | Status | Notes |
|---|---|---|
| Tailwind dark variant | ✅ done | `@variant dark (&:where(.dark, .dark *))` added to `index.css` |
| App.tsx theme management | ✅ done | `useState('dark')` → `useEffect` reads `matchMedia` on mount; toggles `.dark` class on `<html>` and `data-theme` attr; listens for OS changes |
| All components themed | ✅ done | Every component updated with light defaults + `dark:` prefixed overrides (Hero, Navbar, Marquee, About, Achievements, AISection, Gallery, Footer, SelectedWork) |
| Playwright verified | ✅ done | `colorScheme: 'light'` → no `.dark` class, body `rgb(250,250,249)`; `colorScheme: 'dark'` → `.dark` class, body `rgb(12,10,9)` |

### Testing

| Item | Status | Notes |
|---|---|---|
| Visual snapshots updated | ✅ done | All 11/11 Playwright tests pass with new snapshots |
| Test selectors fixed | ✅ done | Footer `Email` link scoped to `footer` locator (avoids strict mode conflict with hero Email); footer CTA selector updated to `footer h2`; hero typewriter retry loop added |
