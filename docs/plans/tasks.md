# Portfolio Implementation — Task Tracker

Last updated: 2026-03-07

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
| Task 3: Rebuild `src/components/Navbar.tsx` | 🔲 todo | |

---

## Phase 3 — Hero

| Task | Status | Notes |
|---|---|---|
| Task 4: Rebuild `src/components/Hero.tsx` | 🔲 todo | |

---

## Phase 4 — Marquee

| Task | Status | Notes |
|---|---|---|
| Task 5: Create `src/components/Marquee.tsx` | 🔲 todo | |

---

## Phase 5 — About

| Task | Status | Notes |
|---|---|---|
| Task 6: Refactor `src/components/About.tsx` | 🔲 todo | |

---

## Phase 6 — SelectedWork

| Task | Status | Notes |
|---|---|---|
| Task 7: Rename VisualResume → SelectedWork | 🔲 todo | |

---

## Phase 7 — Achievements

| Task | Status | Notes |
|---|---|---|
| Task 8: Create `src/data/achievements.ts` | 🔲 todo | |
| Task 9: Create `src/components/Achievements.tsx` | 🔲 todo | |

---

## Phase 8 — Gallery

| Task | Status | Notes |
|---|---|---|
| Task 10: Create `src/data/gallery.ts` + refactor Gallery | 🔲 todo | |

---

## Phase 9 — Footer

| Task | Status | Notes |
|---|---|---|
| Task 11: Rebuild `src/components/Footer.tsx` | 🔲 todo | |

---

## Phase 10 — SEO

| Task | Status | Notes |
|---|---|---|
| Task 12: Create `src/components/SEO.tsx` + sitemap + robots | 🔲 todo | |

---

## Phase 11 — Home Orchestration

| Task | Status | Notes |
|---|---|---|
| Task 13: Update `src/pages/Home.tsx` | 🔲 todo | |

---

## Phase 12 — Security

| Task | Status | Notes |
|---|---|---|
| Task 14: External link audit + CI audit step | 🔲 todo | |

---

## Phase 13 — Markdown Content Pipeline

| Task | Status | Notes |
|---|---|---|
| Task 15: Create `content/` directory + markdown files | 🔲 todo | |
| Task 16: Create `src/lib/content.ts` | 🔲 todo | |
| Task 17: Wire components to markdown | 🔲 todo | |

---

## Visual Testing (Ralph Loop)

| Task | Status | Notes |
|---|---|---|
| Task V-0: Playwright setup | 🔲 todo | |
| Task V-1: Core visual test suite | 🔲 todo | |
| Task V-2: Ralph Loop protocol | 🔲 todo | reference doc only |
| Task V-3: Stitch comparison helper | 🔲 todo | |
