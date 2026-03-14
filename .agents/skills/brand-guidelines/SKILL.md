---
name: brand-guidelines
description: Applies Sourav Debnath's personal brand colors, typography, and design system to portfolio components and artifacts. Use when adding new sections, creating UI components, styling artifacts, or whenever visual consistency with the existing portfolio design is needed. Also use when the user asks about the design system, color tokens, fonts, or brand style.
license: Complete terms in LICENSE.txt
---

# Personal Brand Guidelines — Sourav Debnath

## Overview

This skill defines the visual identity for `sourav27.github.io`. These guidelines must be applied consistently across all portfolio components and artifacts.

**Brand values**: Minimalism · AI Driven · Impact First

---

## Design Tokens

Tokens are defined as CSS custom properties in `src/index.css`, scoped to `[data-theme="dark"]` and `[data-theme="light"]`. Always use `var(--color-*)` — never hardcode hex values in components.

### Dark Mode (`[data-theme="dark"]`)

| Token | Value | Role |
|---|---|---|
| `--color-bg-primary` | `#0f1619` | Page background — deep charcoal-blue |
| `--color-bg-secondary` | `#1a2228` | Section alternates, card fills |
| `--color-text-primary` | `#f0f2f4` | Headings, primary body text |
| `--color-text-secondary` | `#9aaab8` | Body text, descriptions |
| `--color-text-muted` | `#708090` | Labels, metadata, placeholders |
| `--color-border` | `#253038` | Dividers, card borders, separators |
| `--color-accent` | `#9aaab8` | Interactive accent (slate gray) |

### Light Mode (`[data-theme="light"]`)

| Token | Value | Role |
|---|---|---|
| `--color-bg-primary` | `#ffffff` | Page background — white |
| `--color-bg-secondary` | `#f4f4f4` | Section alternates, card fills |
| `--color-text-primary` | `#36454f` | Headings, primary body text — charcoal |
| `--color-text-secondary` | `#708090` | Body text, descriptions — slate gray |
| `--color-text-muted` | `#a8b4be` | Labels, metadata, placeholders |
| `--color-border` | `#d3d3d3` | Dividers, card borders — light gray |
| `--color-accent` | `#36454f` | Interactive accent — charcoal |

### Selection Highlight

```css
::selection {
  background: #36454f;
  color: #fff;
}
```

---

## Typography

### Fonts

| Font | Weights | Use |
|---|---|---|
| **Inter** | 300, 400, 500, 600 | All UI text, headings, body |
| **JetBrains Mono** | 400 | Code snippets, monospaced labels only |

Both fonts are **self-hosted** in `public/fonts/` as `.woff2` files and declared via `@font-face` in `src/index.css`.

- IMPORTANT: Do not import Google Fonts or add new font packages — use only what's already hosted.
- Fallback stack: `system-ui, sans-serif` for Inter; `monospace` for JetBrains Mono.

### Type Scale

- **Hero / display**: `clamp(36px, 8vw, 88px)` — fluid, tracks viewport
- **Section headings**: `text-4xl md:text-5xl` (Tailwind), `font-semibold`
- **Card headings**: `text-3xl md:text-4xl`, `font-light`
- **Body**: `text-base` or `text-lg`, `leading-relaxed`
- **Labels / metadata**: `text-[11px] uppercase tracking-widest` — used for categories, dates, skills tags
- **Micro**: `text-xs`, `text-[10px]` — captions, footer details

---

## Palette Summary

The brand palette is a **cool-toned grayscale** (Modern Minimalist):

- **Charcoal** `#36454f` — primary text/accent in light mode
- **Slate gray** `#708090` — secondary text, accent in dark mode
- **Light gray** `#d3d3d3` — borders in light mode
- **Near-white** `#f0f2f4` — primary text in dark mode
- **Deep charcoal-blue** `#0f1619` — dark mode background

There is **no orange, no purple, no bright blue accent**. The palette is intentionally restrained — all emphasis comes from contrast and spacing, not color.

---

## Styling Rules

### Always

- Use `var(--color-*)` tokens for all colors. Both dark and light modes must work.
- Apply colors via `style={{ color: 'var(--color-text-primary)' }}` (inline) or paired Tailwind `dark:` classes where applicable.
- Use `border-t`, `border-b` etc. with `style={{ borderColor: 'var(--color-border)' }}`.
- Prefer `font-light` for large display text, `font-normal` for mid-size, `font-medium`/`font-semibold` for UI labels.

### Never

- Hardcode hex colors in component files.
- Use `text-stone-*`, `bg-white`, `dark:bg-stone-950` or other raw Tailwind color classes — use tokens instead.
- Use blue (`#195DE6`) or orange as accents — these are from the old palette and have been removed.
- Install new font or icon packages (use Inter + JetBrains Mono already hosted; icons via Lucide React).

---

## Animation & Motion

- **Library**: Framer Motion — all animations use this, no CSS keyframes for component motion.
- **Scroll-triggered**: `whileInView` + `viewport={{ once: true }}` — standard pattern everywhere.
- **Stagger children**: `transition={{ delay: index * 0.1 }}`
- **Entry**: `initial={{ opacity: 0, y: 24 }}` → `animate/whileInView={{ opacity: 1, y: 0 }}`
- **Duration**: `0.5`–`0.7s` with `ease: 'easeOut'`
- **CSS-only animations**: `marquee` (horizontal scroll) and `blink` (cursor) are defined as `@keyframes` in `src/index.css`.

---

## Component Patterns

### Section structure

```tsx
<section className="py-24 md:py-32" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
  <div className="max-w-6xl mx-auto px-6">
    <motion.h2
      className="text-4xl md:text-5xl font-semibold mb-16"
      style={{ color: 'var(--color-text-primary)' }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      Section Title
    </motion.h2>
    {/* content */}
  </div>
</section>
```

Alternating sections use `--color-bg-secondary` for the background to create visual rhythm (e.g., About, Achievements use secondary; Hero, SelectedWork, Gallery use primary).

### Skill / tag pills

```tsx
<span
  className="px-3 py-1 rounded-full text-[11px] uppercase tracking-widest transition-colors duration-200"
  style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
>
  Tag
</span>
```

### Stat display

```tsx
<div className="text-[36px] md:text-[48px] font-light leading-none" style={{ color: 'var(--color-text-primary)' }}>
  20x
</div>
<div className="text-[11px] uppercase tracking-widest mt-2" style={{ color: 'var(--color-text-muted)' }}>
  MAU Growth
</div>
```

### Hover interactions

Use inline `onMouseEnter`/`onMouseLeave` to swap token values:

```tsx
onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text-primary)')}
onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
```

---

## Asset & Icon Rules

- **Images**: stored in `public/images/` — logos in `public/images/logos/`, experience images in `public/images/experiences/`.
- **Image treatment**: use `grayscale` by default, `group-hover:grayscale-0` on cards for reveal effect.
- **Logos**: `brightness-0 opacity-40` in light mode; `invert opacity-40` in dark mode.
- **Icons**: Lucide React only. Do not install additional icon libraries.
- **Reference as root-relative**: `/images/logos/foo.svg` (not `./` relative paths).

---

## Layout

- **Max content width**: `max-w-6xl mx-auto`
- **Section padding**: `py-24 md:py-32` vertical, `px-6` horizontal
- **Grid**: `grid md:grid-cols-2 gap-16` for two-column layouts
- **Responsive text**: `clamp()` for hero sizes; Tailwind responsive prefixes (`md:`, `lg:`) for everything else

---

## Quick Reference

```
bg:          var(--color-bg-primary) / var(--color-bg-secondary)
text:        var(--color-text-primary) / var(--color-text-secondary) / var(--color-text-muted)
borders:     var(--color-border)
accent:      var(--color-accent)

font-body:   Inter (300–600), system-ui fallback
font-mono:   JetBrains Mono (400)

section-pad: py-24 md:py-32 px-6
max-width:   max-w-6xl mx-auto
heading:     text-4xl md:text-5xl font-semibold
display:     clamp(36px, 8vw, 88px) font-normal
label:       text-[11px] uppercase tracking-widest
```
