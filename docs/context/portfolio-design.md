# Portfolio Design Direction

> Synthesized from inspiration analysis (edwinle.com, danial.si) and REQUIREMENTS.md.
> This is the single source of truth for visual and structural decisions.

---

## 1. Identity & Tone

**Positioning**: AI Product Leader shaping the future at scale.
**Register**: Premium, editorial, human-centric. Not a UX designer portfolio (no case study deep-dives). A GM/PM portfolio — metrics, impact, narrative.

---

## 2. Color Palette — Monochrome

| Role | Token | Hex |
|---|---|---|
| Background | `stone-950` | `#0c0a09` |
| Section alternates | `stone-900` | `#1c1917` |
| Primary text | `stone-100` | `#f5f5f4` |
| Secondary text | `stone-400` | `#a8a29e` |
| Muted (labels, timestamps) | `stone-600` | `#57534e` |
| Borders | `stone-800` | `#292524` |

**No accent color.** Interaction states (hover, focus) use `stone-200` / `stone-100` lightening only — no color shifts.

**Migration**: Remove all `orange-*` classes site-wide.
- Custom cursor dot: `stone-100`
- Selection highlight: `bg-stone-800 text-stone-100`

---

## 3. Typography — Sans-serif Only

**Font**: Inter (with `system-ui` fallback)

| Element | Size | Weight | Color |
|---|---|---|---|
| Hero headline | 80–96px | 300 (light) | `stone-100` |
| Section headings | 48–56px | 600 | `stone-100` |
| Body | 18px | 400 | `stone-400` |
| Labels / tags | 11–12px, uppercase, `tracking-widest` | 500 | `stone-500` |
| Nav links | 14px | 400 | `stone-300` |

Restrained elegance — the 300 weight on the hero headline mirrors Edwin Le's approach: large but not aggressive.

**Nav monogram**: "S.D." — mirrors Edwin Le's "E.L." device.

---

## 4. Navigation

**Structure**: Fixed top bar, full-width.
- Left: Monogram "S.D."
- Right: `Work · About · Contact` (3 links max)

**Scroll behavior**: Transparent over Hero → `bg-stone-950/80 backdrop-blur-md` once user scrolls past Hero.

**Mobile**: Hamburger icon → fullscreen overlay with large-type nav links (Edwin Le pattern). Links stacked vertically, center-aligned, large font (48px+).

**Replace** the current Navbar component entirely.

---

## 5. Section Structure (Page Order)

### 5.1 Hero
- Keep flashlight / spotlight cursor effect — it's distinctive.
- Large name + role statement.
- **Rotating text descriptors**: cycle through "GenAI PM", "Builder", "Strategist" using Framer Motion `AnimatePresence`. One descriptor visible at a time, crossfade or slide transition.
- Inline CTAs below headline: LinkedIn · Resume · GitHub (text links, no buttons with heavy styling).

### 5.2 Marquee Divider
- Horizontal scrolling ticker, infinite loop, CSS `animation: scroll linear infinite`.
- Content: `AB InBev · Bain & Company · Vedanta · IIT Madras · IIM Bangalore`
- Purpose: playful section break that also communicates credibility.
- Slow scroll (~30–40s full loop). No interaction needed.
- Style: `stone-600` text, `stone-800` border top and bottom.

### 5.3 About
- Two-column layout (desktop): personal statement left, stats + education right.
- Keep competency tags from current About component.
- Stats examples: years of experience, products shipped, team sizes led.

### 5.4 Selected Work (formerly VisualResume)
- Rename section heading to "Selected Work".
- Keep alternating left/right card layout but evolve toward editorial feel:
  - Large impact stat (e.g. "500+ MAU") as a display number
  - Pull-quote or one-line testimonial if available
  - Company + role as label above the title
  - Hover: `mix-blend-mode: difference` overlay + `scale: 1.02` (see Section 6.3)
- Data source: `src/data/experiences.ts` — do not change the `ExperienceItem` interface shape.
- Mobile: single-column stack.

### 5.5 Achievements
- New compact section inspired by Danial.si's awards table.
- Grid or table layout: achievement name · context · metric / outcome.
- Examples: "0→1 GenAI Copilot · AB InBev · 500+ MAU", "$1M+ Savings · Supply Chain AI".
- No images, purely typographic.

### 5.6 Gallery ("Perspective")
- Move image data to `src/data/gallery.ts` as `GalleryItem[]`:
  ```ts
  interface GalleryItem {
    src: string;
    camera?: string;
    lens?: string;
    iso?: string;
    aperture?: string;
    alt: string;
  }
  ```
- Keep EXIF hover overlay behavior.
- Layout: consider masonry or asymmetric grid instead of uniform squares — gives editorial texture.

### 5.7 Contact / Footer
- Section CTA: `"Let's build something."` (large, light weight)
- Social links: Email · LinkedIn · GitHub · Instagram
- Footer: monogram "S.D." + copyright line.

---

## 6. Animation Conventions

### 6.1 Page Load Sequence (Edwin Le pattern)
Staggered entrance on first load — elements enter sequentially, never all at once:
1. **Navbar** — enters first (fade in)
2. **Hero headline** — fades + translates up ~20px
3. **Rotating descriptor** — enters after headline
4. **CTAs** (LinkedIn / Resume / GitHub) — last to appear

Total sequence: ~600–800ms. Implement with Framer Motion `initial / animate` + `delay` offsets. Add `will-change: transform` on elements that animate position.

### 6.2 Scroll-Triggered Entry
| Pattern | Implementation |
|---|---|
| Section entry | `whileInView` + `viewport={{ once: true, margin: "-50px" }}` |
| Entry motion | `initial: { opacity: 0, y: 24 }` → `animate: { opacity: 1, y: 0 }` — **always include translate-up, not just fade** |
| Card stagger | Each card triggers independently as scroll reaches it, `delay: index * 0.1` |
| Rotating hero descriptors | `AnimatePresence` with crossfade |
| Marquee | CSS `@keyframes scroll` — not JS-driven (better perf) |

### 6.3 Card Hover
- Default: `scale: 1.02` + subtle border lightening, `transition: 200ms ease`
- Enhanced (Edwin Le): render a transparent overlay div with `mix-blend-mode: difference` — on hover, it fills with white, creating a color inversion effect on the card surface. Adds depth without color changes.

### 6.4 Hero Background
- Position off-canvas: `top: 140px; right: -140px` — creates asymmetric depth
- Apply `filter: brightness(0.6) contrast(2) invert(0.2)` + `mix-blend-mode: luminosity`
- Add `will-change: transform` for scroll sync performance

### 6.5 Sticky Section Pinning (Selected Work — optional)
Inspired by Edwin Le: `position: sticky; top: 0; height: 100vh` on the section container. Content pins as user scrolls past. Consider applying to the Selected Work section for dramatic editorial feel. **Only implement if scroll performance is stable.**

### 6.6 Rules
- **Stagger over simultaneity**: nothing enters all at once
- **GPU-first**: always use `transform` (not `top`/`left`) for motion
- **Avoid**: parallax scroll, heavy 3D transforms, JS-driven marquee
- **Framer Motion gotcha**: If `whileInView` animations don't fire, add `margin: "-50px"` to the `viewport` prop — most common failure mode.

---

## 7. Layout Principles

- **Max content width**: `max-w-6xl` centered with `mx-auto px-6`
- **Section padding**: `py-24 md:py-32`
- **Mobile-first**: all alternating left/right layouts collapse to single-column on mobile (`flex-col` default, `md:flex-row` for alternating)
- **No unintentional horizontal scroll** (only the marquee scrolls horizontally)

---

## 8. What to Preserve

- Custom flashlight cursor in Hero — keep exactly as-is, it's the most distinctive element.
- `ExperienceItem` interface in `src/data/experiences.ts` — do not change the shape.
- Tailwind v4 + `@tailwindcss/vite` plugin setup (not PostCSS).
- GitHub Actions deploy pipeline.
- `cursor-none` on Hero container + custom motion cursor.
- `whileInView` + `viewport={{ once: true }}` as the scroll animation standard.

---

## 9. What to Migrate / Rebuild

| Current | Target |
|---|---|
| Navbar | Rebuild per Section 4 spec (monogram + 3 links + scroll transparency) |
| Footer | Rebuild with "Let's build something." CTA + social links |
| Gallery hardcoded data | Move to `src/data/gallery.ts` as `GalleryItem[]` |
| All `orange-*` classes | Remove — replace with monochrome equivalents |
| Selection highlight | Change to `bg-stone-800 text-stone-100` |

---

## 11. Design System (from Stitch — screen `56c4d84ccb56429390e2301789c87ec2`)

> Retrieved from the Design System Reference Sheet generated in Stitch. Use these as the implementation source of truth.

### Color Tokens

| Token | Dark Mode | Light Mode |
|---|---|---|
| `--color-bg-primary` | `#0c0a09` (stone-950) | `#fafaf9` (stone-50) |
| `--color-bg-secondary` | `#1c1917` (stone-900) | `#f5f5f4` (stone-100) |
| `--color-text-primary` | `#f5f5f4` (stone-100) | `#1c1917` (stone-900) |
| `--color-text-secondary` | `#a8a29e` (stone-400) | `#57534e` (stone-600) |
| `--color-text-muted` | `#57534e` (stone-600) | `#a8a29e` (stone-400) |
| `--color-border` | `#292524` (stone-800) | `#e7e5e4` (stone-200) |

> **Override note**: Stitch auto-applied `#195de6` (blue) as an accent. **This is wrong — remove it.** The palette is strictly monochrome. No accent color is used anywhere.

### Typography

| Role | Font | Size | Weight | Notes |
|---|---|---|---|---|
| Hero Headline | Inter | 88px | 300 (light) | Restrained elegance |
| Section Heading | Inter | 48px | 600 | `stone-100` / `stone-900` |
| Body | Inter | 18px | 400 | `stone-400` / `stone-600`, line-height 1.7 |
| Label / Tag | Inter | 12px | 500 | Uppercase, `tracking-widest` |
| Nav Link | Inter | 14px | 400 | `stone-300` / `stone-700` |
| Monogram | Inter | 16px | 500 | "S.D." |
| Code / Mono | JetBrains Mono | 13px | 400 | EXIF overlays, timestamps |

### Spacing

| Token | Value | Tailwind |
|---|---|---|
| Content max-width | 1440px | `max-w-6xl` + `mx-auto` |
| Section vertical padding | 96px | `py-24` |
| Section horizontal gutter | 24px | `px-6` |
| Card gap | 24px | `gap-6` |
| Section gap (stagger rhythm) | 144px | `gap-36` (between major sections) |

### Border Radius

| Scale | Value | Usage |
|---|---|---|
| Default | `8px` (0.5rem) | Cards, inputs |
| Large | `16px` (1rem) | Feature cards |
| Full | `9999px` | Pill tags (competency labels) |

### Components

#### Navbar
- `position: fixed; top: 0; width: 100%; z-index: 50`
- Over Hero: `background: transparent`
- On scroll: `background: color-mix(in srgb, var(--color-bg-primary) 80%, transparent); backdrop-filter: blur(12px)`
- Bottom border: `1px solid var(--color-border)`
- Height: `64px`; content max-width `max-w-6xl mx-auto px-6`

#### Competency Tag (pill)
- `border: 1px solid var(--color-border)`
- `border-radius: 9999px`
- `padding: 4px 12px`
- `font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase`
- Color: `var(--color-text-muted)`

#### Work Card
- `border: 1px solid var(--color-border)`
- `border-radius: 8px`
- `padding: 48px`
- Stat number: `64px, weight 300, var(--color-text-primary)`
- Label: `12px uppercase tracking-widest, var(--color-text-muted)`
- Hover: `transform: scale(1.02); transition: 200ms ease`

#### Marquee Strip
- `border-top: 1px solid var(--color-border)`
- `border-bottom: 1px solid var(--color-border)`
- `padding: 16px 0`
- Text: `14px uppercase tracking-widest, var(--color-text-muted)`
- Animation: `animation: marquee 35s linear infinite`

#### Achievement Table Row
- `border-bottom: 1px solid var(--color-border)`
- `padding: 20px 0`
- Column headers: `12px uppercase tracking-widest, var(--color-text-muted)`
- Body: `16px, var(--color-text-secondary)`

### Mode Switching
- Dark mode is the **default and primary** mode.
- Light mode is a toggle variant — same layout, token swap only.
- Implement via a `data-theme="dark|light"` attribute on `<html>` with CSS custom properties.
- No JavaScript animation needed for the switch — CSS handles it via variable reassignment.

---

## 10. Out of Scope (Future)

- Blog / LinkedIn post syndication
- Project case study deep-dive pages (requires multi-page routing + GitHub Pages 404 hack)
- Dark/light mode toggle (monochrome dark is the intentional permanent state)
