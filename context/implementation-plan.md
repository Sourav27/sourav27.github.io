# Portfolio Redesign — Implementation Plan

> Source of truth: `context/portfolio-design.md` + `context/inspiration.md`
> Stitch screens: Full Portfolio (574b01b2b92b464b82e6d3ce6441ba94), Case Study (7395af45f5d748eab9d8a5c2ed1c50ce), Hero (cd6c72a0b68c4e9d9cfba21fd810352b)
> Resume data: `context/sourav-resume-2026.md`

---

## Current State

| File | Status | Issues |
|---|---|---|
| `App.tsx` | Needs update | `selection:bg-orange-500` accent, no `data-theme` |
| `index.css` | Needs update | Missing CSS tokens, wrong font imports, no marquee keyframes |
| `Navbar.tsx` | Rebuild | Full name logo (not monogram), wrong links, no mobile overlay |
| `Hero.tsx` | Partial rebuild | Missing name/headline, no rotating descriptors, no CTAs, orange cursor |
| `About.tsx` | Refactor | Orange accents, no stats, no education block |
| `VisualResume.tsx` → `SelectedWork.tsx` | Rename + Refactor | Orange accents, wrong heading, outdated card style |
| `Gallery.tsx` | Refactor | Hardcoded data, uniform grid, non-monospace EXIF font |
| `Footer.tsx` | Rebuild | No CTA, no monogram, incomplete |
| `Marquee.tsx` | Create | Does not exist |
| `Achievements.tsx` | Create | Does not exist |
| `src/data/gallery.ts` | Create | Does not exist |
| `src/data/achievements.ts` | Create | Does not exist |

---

## Stitch Screen Summary

### Screen 1: Sourav Debnath Full Portfolio Page
- 13,966 × 2,560px — the main reference for all sections
- Sections in order: Navbar → Hero → Marquee → About → Selected Work → Achievements → Gallery → Contact/Footer
- Nav: "Work · About · Contact · Resume" text links + dark mode toggle + "S.D." monogram
- Marquee: company names in stone-600, stone-800 borders top/bottom
- Achievements: 4-column table (Award · Context · Metric · Year)
- Gallery: 4 images in 2×2 grid with EXIF hover overlay
- **Override**: Remove Stitch-injected `#195de6` blue — zero accent color anywhere

### Screen 2: Case Study — Data Insights Copilot
- 9,446 × 2,560px — a full case study page (separate from the portfolio SPA)
- Sections: Header → Hero headline → Context → Problem Statement → Methodology → Metrics → Next CTA → Footer
- **Out of scope for this plan** — requires multi-page routing (GitHub Pages 404 hack). Tracked as future work.

### Screen 3: Hero Section
- 922 × 1,152px (screenshot only, no HTML generated)
- Shows: large name in light-weight type, rotating descriptor, flashlight effect
- Reference for Hero layout and proportions

---

## Phase 1 — Foundation (Global Tokens & CSS)

### Task 1.1 — `index.css`
**File**: `src/index.css`

Replace current contents with:
- Import Inter (weights 300, 400, 500, 600) + JetBrains Mono (weight 400) from Google Fonts
- Add CSS custom properties for both dark and light themes under `[data-theme="dark"]` and `[data-theme="light"]`:
  ```css
  --color-bg-primary:    #0c0a09 / #fafaf9
  --color-bg-secondary:  #1c1917 / #f5f5f4
  --color-text-primary:  #f5f5f4 / #1c1917
  --color-text-secondary:#a8a29e / #57534e
  --color-text-muted:    #57534e / #a8a29e
  --color-border:        #292524 / #e7e5e4
  ```
- Add `::selection` rule: `background: #292524; color: #f5f5f4` (remove orange)
- Add `@keyframes marquee` for the ticker:
  ```css
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  ```
- Set `html` default to `data-theme="dark"` via body defaults

### Task 1.2 — `App.tsx`
**File**: `src/App.tsx`

- Add `data-theme="dark"` to the root `<div>` (or `<html>` via `useEffect`)
- Change `selection:bg-orange-500 selection:text-white` → remove (handled by CSS)
- Change base classes: `bg-stone-950 text-stone-100` stays, accent ref removed

---

## Phase 2 — Navbar Rebuild

### Task 2.1 — `Navbar.tsx` (full rebuild)
**File**: `src/components/Navbar.tsx`

**Desktop**:
- Fixed top bar, `z-50`, height `64px`
- Left: Monogram `S.D.` — Inter 16px, weight 500, `text-stone-100`
- Right: `Work · About · Contact` — 14px, weight 400, `text-stone-300`, hover `text-stone-100`
- Scroll behavior: transparent over Hero → `bg-stone-950/80 backdrop-blur-md border-b border-stone-800` after 80px scroll
- Use `useScroll` + `useMotionValueEvent` (already in codebase — keep pattern)

**Mobile**:
- Replace current `<button>Menu</button>` stub with animated hamburger icon (two `<span>` lines)
- On open: render fullscreen overlay (`fixed inset-0 z-50 bg-stone-950`) with large stacked nav links — 48px Inter, centered, `text-stone-100`
- Hamburger animates to X on open (rotate transform via Framer Motion)
- Close on link click or Escape key

**Page load animation**:
- Navbar itself: `initial={{ opacity: 0, y: -8 }}` → `animate={{ opacity: 1, y: 0 }}` on mount, `delay: 0`

**Anchor links**: `href="#work"`, `href="#about"`, `href="#contact"` + external `href` for Resume PDF

---

## Phase 3 — Hero Rebuild

### Task 3.1 — `Hero.tsx` (partial rebuild)
**File**: `src/components/Hero.tsx`

**Keep exactly as-is**:
- `containerRef` + mouse position tracking via CSS `--x`/`--y` custom properties
- Background grid
- Flashlight blur div (`mix-blend-screen`)
- Sharp cursor dot — change color from `bg-orange-500` → `bg-stone-100`
- `cursor-none` on container

**Add / change**:

1. **Name headline** (currently missing):
   ```
   Sourav Debnath
   ```
   — Inter, ~88px desktop / ~56px mobile, weight 300 (light), `text-stone-100`
   — Page load: `initial={{ opacity: 0, y: 20 }}` → `animate`, `delay: 0.15`

2. **Rotating descriptor** (currently missing):
   — Cycle through `["GenAI PM", "Builder", "Strategist"]` using `AnimatePresence`
   — Crossfade transition, 2.5s interval
   — 24px Inter, weight 400, `text-stone-400`
   — Page load: `delay: 0.3`

3. **Inline CTAs** (currently icon-only, bottom-right):
   — Replace icon links with text links: `LinkedIn · Resume · GitHub`
   — 14px, `text-stone-400`, hover `text-stone-100`, no heavy button styling
   — Page load: `delay: 0.45`

4. **Scroll indicator**:
   — Small animated arrow or "scroll" label at bottom center
   — Subtle bounce animation loop, `text-stone-600`

5. **Remove orange**:
   — `bg-orange-600 mix-blend-overlay` mask layer → change to `bg-stone-100/5 mix-blend-overlay` or remove if it clashes
   — Cursor dot: `bg-orange-500` → `bg-stone-100`
   — Cursor blur: `bg-orange-500/10` → `bg-stone-100/5`

---

## Phase 4 — Marquee (New Component)

### Task 4.1 — `Marquee.tsx`
**File**: `src/components/Marquee.tsx` (create)

- Pure CSS-driven infinite scroll — no JS animation
- Items: `AB InBev · Bain & Company · Vedanta · IIT Madras · IIM Bangalore`
- Separator between items: `·` or `—`
- Duplicate the item list twice side-by-side so the loop is seamless
- Styles:
  - `border-top: 1px solid var(--color-border)` + `border-bottom`
  - `padding: 16px 0`
  - `font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em`
  - `color: var(--color-text-muted)`
  - `animation: marquee 35s linear infinite`
- No hover interaction needed

---

## Phase 5 — About Refactor

### Task 5.1 — `About.tsx`
**File**: `src/components/About.tsx`

**Layout**: Two-column desktop (`md:grid-cols-2`), single-column mobile

**Left column — personal statement**:
- Remove orange `<span>` accents → plain `text-stone-100` for emphasis
- Update copy to match resume: "5.5+ years building and launching AI products from zero to scale. Currently at AB InBev leading GenAI products."
- Body: 18px Inter, `text-stone-400`, line-height 1.7

**Right column**:
1. **Stats row** (new):
   - `5.5+ yrs` Experience · `3+` Products Launched · `500+ MAU` at peak
   - Display number: `text-stone-100`, label: 12px uppercase `text-stone-600`

2. **Education** (new):
   - IIM Bangalore — MBA, General Management (2022–24), CGPA 3.2/4.0
   - IIT Madras — B.Tech Honours, Mechanical Engineering (2014–18), CGPA 8.9/10.0
   - Style: label in muted, institution in `text-stone-100`

3. **Competency tags** (keep, restyle):
   - Remove `hover:bg-orange-500/20 hover:text-orange-500`
   - Apply design system pill: `border border-stone-800 rounded-full px-3 py-1 text-[11px] uppercase tracking-widest text-stone-600`
   - Hover: `border-stone-600 text-stone-400`
   - Tags: `Product Leadership · Generative AI · Agentic Workflows · RAG · Digital Transformation · User Research · Context Engineering · MLOps`

**Section heading**: Inter 48px, weight 600, `text-stone-100` (remove `font-serif`)

---

## Phase 6 — VisualResume → Selected Work

### Task 6.1 — `SelectedWork.tsx`
**File**: Rename `src/components/VisualResume.tsx` → `src/components/SelectedWork.tsx`
Update import in `Home.tsx` accordingly.

**Rename**: Section heading `"Professional Journey"` → `"Selected Work"`. Add `id="work"`.

**Card changes** (for each `ExperienceItem`):
- Wrap card in `border border-stone-800 rounded-lg p-12` (from design system Work Card spec)
- Add hover: `whileHover={{ scale: 1.02 }}` + `transition={{ duration: 0.2 }}`
- Add `mix-blend-mode: difference` hover overlay (a child `<div>` with `opacity-0 group-hover:opacity-5 bg-white absolute inset-0`)
- Company + role label above title: `12px uppercase tracking-widest text-stone-600`
- Stat number: `text-[64px]` or `text-6xl`, weight 300 (light), `text-stone-100`
- Remove orange: period/company line uses `text-stone-600` instead of `text-orange-500`
- Skills tags: match design system pill (same as About competency tags)
- Testimonial block: remove orange, use `border-stone-800` border

**Alternating layout**: keep `md:flex-row` / `md:flex-row-reverse` pattern.

**Scroll animation**: update `margin` from `-100px` → `-50px` per spec.

---

## Phase 7 — Achievements (New Section)

### Task 7.1 — `src/data/achievements.ts`
**File**: `src/data/achievements.ts` (create)

```ts
export interface AchievementItem {
  name: string;
  context: string;
  metric: string;
  year: string;
}

export const achievements: AchievementItem[] = [
  { name: 'Culture Champion Award',       context: 'AB InBev',               metric: 'Top 1% recognition',  year: '2025' },
  { name: '0→1 GenAI Copilot',           context: 'AB InBev',               metric: '500+ MAU, 20x growth', year: '2024' },
  { name: '$1M+ Annual Savings',          context: 'AB InBev Supply Chain',  metric: '$1M+ cost avoidance',  year: '2024' },
  { name: 'National Runner Up + PPO',     context: 'Accenture Strategy',     metric: 'Top 2 nationally',     year: '2023' },
  { name: '$10B+ Market POV',             context: 'Bain & Company',         metric: '5-yr India strategy',  year: '2023' },
  { name: 'Chairman\'s Award',            context: 'Vedanta Limited',        metric: 'Highest individual award', year: '2022' },
  { name: '$250M+ Profit Accrual',        context: 'Vedanta Industry 4.0',   metric: '$250M+ impact',        year: '2020' },
];
```

### Task 7.2 — `Achievements.tsx`
**File**: `src/components/Achievements.tsx` (create)

- `id="achievements"`, `py-24 bg-stone-900`
- Section heading: "Achievements" — 48px, weight 600
- Table layout: 4 columns — Achievement · Context · Metric · Year
- Column headers: `12px uppercase tracking-widest text-stone-600`
- Each row: `border-b border-stone-800 py-5`
- Achievement name: `16px text-stone-100`
- Context + Metric: `16px text-stone-400`
- Year: `16px text-stone-600`
- `whileInView` row stagger: `delay: index * 0.05`
- Mobile: collapse to 2 columns (Achievement + Metric), hide Context or wrap below

---

## Phase 8 — Gallery Refactor

### Task 8.1 — `src/data/gallery.ts`
**File**: `src/data/gallery.ts` (create)

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
  // Move existing 4 Unsplash URLs here with their existing EXIF data
  // (replace with real photos when available)
];
```

### Task 8.2 — `Gallery.tsx`
**File**: `src/components/Gallery.tsx`

- Import `gallery` from `src/data/gallery.ts` — remove hardcoded array
- EXIF overlay text: switch from default sans to `font-mono` (JetBrains Mono via CSS)
- Layout: keep 2×2 grid for now; add `aspect-[3/4]` variation on alternating items for asymmetric feel (optional)
- Remove any orange references

**Monochrome-until-hover behavior** (new):
- All gallery images render in `grayscale(100%)` by default
- On hover: `grayscale(0%)` — color is revealed simultaneously with the EXIF overlay
- CSS transition on filter: `transition: filter 500ms ease`
- This means the existing opacity-based EXIF overlay and the grayscale lift happen together on hover

**Zoom on hover** (new):
- Image scales from `scale(1.0)` → `scale(1.05)` on hover
- Transition: `transform 500ms ease` (same duration as filter, so both animate together)
- Overflow `hidden` on the container clips the zoom

**Implementation pattern**:
```css
.gallery-img {
  filter: grayscale(100%);
  transform: scale(1.0);
  transition: filter 500ms ease, transform 500ms ease;
}
.gallery-item:hover .gallery-img {
  filter: grayscale(0%);
  transform: scale(1.05);
}
```
Or via Tailwind: `grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105`

---

## Phase 9 — Footer Rebuild

### Task 9.1 — `Footer.tsx`
**File**: `src/components/Footer.tsx`

**Structure**:
```
[ Let's build something. ]        ← large CTA, full width, centered
[ Email · LinkedIn · GitHub · Instagram ]
[ S.D.              © 2026 Sourav Debnath. All rights reserved. ]
```

- CTA: `"Let's build something."` — Inter, ~56px desktop / ~36px mobile, weight 300 (light), `text-stone-100`
- CTA `whileInView` entrance animation
- Social links: text links (not icon-only) — 14px, `text-stone-400`, hover `text-stone-100`
  - Email: `mailto:debnath.sourabh@gmail.com`
  - LinkedIn: `https://linkedin.com/in/souravdebnath`
  - GitHub: (link TBD)
  - Instagram: (link TBD)
- Footer bar: monogram `S.D.` left, copyright right — `text-stone-600`, 12px
- Background: `bg-stone-950`, top border `border-t border-stone-800`
- `id="contact"`

---

## Phase 10 — Home Orchestration

### Task 10.1 — `Home.tsx`
**File**: `src/pages/Home.tsx`

Update section order to match Stitch Full Portfolio Page:
```tsx
<Hero />
<Marquee />
<About />
<SelectedWork />    {/* id="work", renamed from VisualResume */}
<Achievements />
<Gallery />
{/* Footer rendered in App.tsx */}
```

Import new components: `Marquee`, `Achievements`, `SelectedWork` (replaces `VisualResume`).

---

## Phase 11 — Case Study Page (Future / Out of Scope)

The Stitch screen "Case Study: Data Insights Copilot" represents a full separate page. **Not implemented in this plan** because:
- Requires multi-page routing on GitHub Pages (404 redirect hack)
- Portfolio-design.md Section 10 explicitly marks this as future work

When ready, implement as:
1. Add `404.html` redirect hack for GitHub Pages SPA routing
2. New route `/work/data-insights-copilot`
3. New page `src/pages/CaseStudy.tsx` using data from `experiences.ts`
4. "View Case Study" CTA links from VisualResume cards

---

## Implementation Order

Execute phases in dependency order — each phase is independently testable:

```
Phase 1  →  Phase 2  →  Phase 3  →  Phase 4
                                      ↓
Phase 10 ←  Phase 9  ←  Phase 8  ←  Phase 5
                                      ↓
                         Phase 7  →  Phase 6
```

Simplified sequence:
1. **Task 1.1** CSS tokens + keyframes + fonts
2. **Task 1.2** App.tsx cleanup
3. **Task 2.1** Navbar rebuild
4. **Task 3.1** Hero rebuild
5. **Task 4.1** Marquee component
6. **Task 5.1** About refactor
7. **Task 6.1** VisualResume → Selected Work
8. **Task 7.1 + 7.2** Achievements data + component
9. **Task 8.1 + 8.2** Gallery data migration + refactor
10. **Task 9.1** Footer rebuild
11. **Task 10.1** Home orchestration

---

## Global Interaction Standards

These apply across ALL components — not component-specific.

### Hover States for Interactive Elements

Every clickable/tappable element must have a deliberate hover state. No raw default browser styling.

| Element | Default | Hover |
|---|---|---|
| Nav links | `text-stone-300` | `text-stone-100`, no underline |
| Monogram "S.D." | `text-stone-100` | `text-stone-400`, `transition-colors 150ms` |
| CTA text links (Hero, Footer) | `text-stone-400` | `text-stone-100`, `transition-colors 200ms` |
| Competency / skill pills | `border-stone-800 text-stone-600` | `border-stone-600 text-stone-400`, `transition 200ms` |
| Work cards | `scale(1.0)` | `scale(1.02)`, `transition 200ms ease` |
| Footer social links | `text-stone-400` | `text-stone-100` + slight `translateY(-1px)`, `transition 150ms` |
| Mobile nav overlay links | `text-stone-300` | `text-stone-100`, crossfade |
| Hamburger icon | default | lines slide to X (rotate 45deg / -45deg), `transition 200ms ease` |
| Achievements table rows | default | `text-stone-100` on name, `bg-stone-800/30` row tint, `transition 150ms` |
| Resume / external link button | `text-stone-400 border-stone-800` | `border-stone-600 text-stone-100`, `transition 200ms` |

**Rule**: All hover transitions use `ease` or `ease-out` easing. Duration between 150–300ms. Never `linear` for UI hover states.

---

### Scroll Animations (whileInView standard)

Every section and its child elements must animate in as the user scrolls. Nothing should be visible at full opacity on page load except the Hero.

**Standard entry pattern** (apply to every section's top-level container and key children):
```tsx
initial={{ opacity: 0, y: 24 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, margin: "-50px" }}
transition={{ duration: 0.6, ease: "easeOut" }}
```

**Per-component scroll animation requirements**:

| Component | What animates | Stagger |
|---|---|---|
| Marquee | Section fades in as a block | None (CSS animates content) |
| About — heading | Fades + slides up | — |
| About — left column | Fades + slides up | `delay: 0.15` |
| About — stats | Each stat number counts up or fades in | `delay: index * 0.1` |
| About — right column | Fades + slides up | `delay: 0.3` |
| About — each pill tag | Fades in | `delay: index * 0.04` |
| SelectedWork — heading | Fades + slides up | — |
| SelectedWork — each card | Fades + slides up independently | `delay: 0` (each triggers own viewport entry) |
| Achievements — heading | Fades + slides up | — |
| Achievements — each row | Fades + slides up | `delay: index * 0.05` |
| Gallery — heading | Fades + slides up | — |
| Gallery — each image | Fades in + `scale(0.96)` → `scale(1)` | `delay: index * 0.08` |
| Footer CTA | Fades + slides up, large and slow | `duration: 0.8` |
| Footer social links | Fade in as group | `delay: 0.2` |

**Note**: Stat numbers in About and SelectedWork cards can use a simple counter animation (count from 0 to value on entry) using a `useEffect` + `useInView` hook for added impact.

---

## Invariants (Never Break)

- `ExperienceItem` interface shape in `experiences.ts` — do not change
- Flashlight cursor logic in `Hero.tsx` — keep exactly
- `cursor-none` on Hero container
- `whileInView` + `viewport={{ once: true, margin: "-50px" }}` as animation standard
- Tailwind v4 + `@tailwindcss/vite` (not PostCSS)
- GitHub Actions deploy pipeline — never commit `dist/`
- No `#195de6` blue anywhere — strictly monochrome stone palette
