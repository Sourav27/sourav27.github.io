# Inspiration Sites

---

## edwinle.com

### Color Palette
- Background: `#010101` (near-black), panels at `#151515`, mid-dark `#202020`
- Primary text: `#ffffff`
- Secondary text: `#a6a6a6` (mid-gray)
- Muted: `#666` (dark gray)
- Accent: `#09f` (bright cyan-blue) — used for links and interactive states
- Purple: `#5b0080` — appears in subtle background elements
- Borders: `#f2f2f2` (light gray, used sparingly)

### Typography
- **Primary font**: Inter (weights 400, 500, 600, 700, 900)
- **Secondary font**: Geist (weights 400, 500, 700)
- **Monospace**: Fragment Mono
- Hero headline: 72–96px, weight 500 — restrained, not aggressive bold
- Large padding on hero: `240px 120px 120px` (top-heavy, breathing room)

### Navigation
- Fixed top bar, `z-index: 2`, transparent over hero
- Left: monogram logo "E.L." with tight `gap: 10px` grouping
- Right: hamburger icon (36×36px) — two lines (`width: 14px, height: 2px`) that animate on open
- Hamburger opens a **fullscreen overlay** (`position: fixed; z-index: 4`) with large nav links
- Overlay is `pointer-events: none` by default, toggled to `auto` on open

### Page Load Animation Sequence
- Built in Framer — animations are JavaScript/runtime-driven, not CSS `@keyframes`
- Initial state: dark background (`#010101`), all content at `opacity: 0`
- Staggered entrance: elements fade + translate in sequentially from top to bottom
- Nav bar enters first, then hero headline, then descriptor text, then CTAs
- Timing is smooth, ~600–800ms total entrance sequence
- `will-change: transform` applied broadly for GPU acceleration

### Scroll-Triggered Animations
- **Opacity fade-in**: Sections start at `opacity: 0`, animate to `1` as they enter viewport
- **Translate-up**: Elements slide up ~20–40px as they fade in (common entry pattern)
- **Stagger by gap**: Sections are spaced `144px` apart — natural scroll-trigger rhythm
- **Sticky elements**: Some containers use `position: sticky; top: 0; height: 100vh` — content pins as you scroll past
- **No parallax** on text — only background layers shift
- Performance-first: uses `transform` not `left/top` for all motion

### Hero Section
- `min-height: 100vh`, content anchored with large top padding
- Rotating text descriptors: one visible at a time, crossfade or slide transition via Framer runtime
- Background element (`#1umhnc6`): off-canvas at `top: 140px; right: -140px`, uses `filter: brightness(.6) contrast(2) invert(.2)` + `mix-blend-mode: luminosity` for depth effect
- `will-change: transform` on background for scroll sync

### Card / Section Entry Animations
- Cards in a list with `gap: 24px` between items
- Each card triggers independently as scroll position reaches it
- Cards use `mix-blend-mode: difference` on hover overlay element — creates color inversion on the card surface
- Project cards: large (contain images + skill tags), hover lifts with subtle scale

### Marquee / Ticker
- Horizontal company/client marquee used as a section divider
- Slow, infinite CSS-driven scroll (not JS) — smooth, no jank
- Text is muted gray, strip has thin borders top and bottom

### Hover Effects
- Links: color shifts to `#09f` accent + underline
- Cards: scale up slightly, overlay blend mode creates inversion effect
- Hamburger: lines animate to X (rotate transform)
- All transitions: subtle, ~200ms ease

### Overall Animation Philosophy
- **Scroll-driven, performance-first**: heavy use of `will-change`, GPU-accelerated transforms
- **Stagger over simultaneity**: elements never all enter at once
- **Depth through filters**: `mix-blend-mode`, `brightness`, `contrast` create layering without heavy assets
- **Framer runtime**: no raw CSS `@keyframes` — motion is all runtime-controlled for flexibility
- **60fps target**: spacing and trigger zones designed to maintain smooth scrolling

---

## danial.si

### Color Palette
- Background: white `#ffffff`
- Cards / sections: light gray `#f0f0f0`
- Primary text: black `#000000`
- Accent: iOS blue `#007AFF`

### Navigation
- Inline horizontal links at top: Home · Email · LinkedIn · Resume · Projects · About me
- No hamburger — fully visible at all times
- Minimal, flat, no sticky behavior

### Hero
- One-liner value proposition, centered
- Inline CTAs: Email, LinkedIn, Resume — text links only
- No animation, no cursor effects — purely typographic

### Section Structure
- Case studies list (text-heavy, no images)
- Side projects list
- Awards table: three columns — Award · Organization · Year
- Mentorship table: similar tabular layout

### Key Design Pattern
- **Information density without clutter**: tight spacing, clear hierarchy, no decoration
- Tables for structured data (awards, mentorship) — scannable, concise
- No scroll animations — static, fast, content-first

---

## Design Takeaways for Sourav's Portfolio

| Pattern | Source | Applied As |
|---|---|---|
| Monogram nav logo "S.D." | Edwin Le | Navbar left element |
| Rotating hero descriptors | Edwin Le | AnimatePresence cycling text |
| Staggered scroll entrance (fade + translate-up) | Edwin Le | `whileInView` + `initial: { opacity:0, y:20 }` |
| Sticky section with scroll pin | Edwin Le | Consider for Selected Work section |
| Marquee company ticker | Edwin Le | Divider between Hero and About |
| Fullscreen mobile nav overlay | Edwin Le | Mobile hamburger menu |
| Depth via `mix-blend-mode` | Edwin Le | Keep in Hero flashlight effect |
| Achievements table | Danial.si | Achievements section layout |
| Information-dense typography | Danial.si | Achievements, About stats |
