# AISection Redesign — Personal Statement with Scroll-Driven Word Highlight

**Date**: 2026-03-08
**Component**: `src/components/AISection.tsx`
**Status**: Design approved

---

## Overview

Replace the current AISection (headline + body text left, greyscale photo right) with a personal statement section featuring a scroll-driven word-highlight quote and a parallax circular portrait on the right.

---

## Layout

Two-column on desktop (`md:flex-row`), stacked on mobile (`flex-col`) — normal document flow, no sticky, no overlap.

| Column | Content |
|---|---|
| Left (~55%) | Uppercase label + word-by-word illuminating quote |
| Right (~45%) | Circular portrait with parallax drift + themed halo |

Section padding matches site standard: `py-24 md:py-32 px-8 md:px-16 lg:px-24`.

---

## Quote Content

```
Passionate about shaping the future of AI through user-centric design thinking.
```

Split into individual `<span>` words. Each word animates from muted (`stone-500` dark / `stone-400` light) to bright (`stone-100` dark / `stone-900` light) based on scroll progress.

Above the quote, a small label:
```
Personal Statement
```
Styled: `text-xs uppercase tracking-widest text-stone-500`.

---

## Word Highlight Mechanic

- Use Framer Motion `useScroll` with `target` ref on the section element.
- `scrollYProgress` maps `[0, 1]` across the section's scroll range.
- Quote split into `N` words. Word `i` highlights when `scrollYProgress >= i / N`.
- Use `useTransform` + `motionValue` subscriptions, or map progress in a `motion.span` style.
- Transition: `color` CSS transition `duration-300` on each span for smooth illumination.
- No JS timers — purely scroll-driven.

---

## Image Treatment

- **Shape**: Circle (`rounded-full`), fixed size `w-64 h-64 md:w-80 md:h-80`.
- **Photo**: Full colour (`/images/SDPasspic.jpg` or `portfolio.png` — whichever is the portrait).
- **Halo background**: A disc behind the image circle:
  - Light mode: `bg-stone-200`
  - Dark mode: `bg-stone-800`
  - Implemented via a wrapper `div` with `rounded-full` and theme-responsive background, slightly larger than the image (`p-2` or `p-3` padding).
- **Ring border**: `ring-1 ring-stone-700 dark:ring-stone-600` on the outer wrapper.

---

## Parallax

- Framer Motion `useScroll` on the section ref, same `scrollYProgress` used for word highlights.
- `useTransform(scrollYProgress, [0, 1], ['0px', '-40px'])` applied as `y` on the image `motion.div`.
- Subtle upward drift as user scrolls through the section.

---

## Theme Behaviour

| Element | Light mode | Dark mode |
|---|---|---|
| Section background | `bg-white` | `bg-stone-950` |
| Label | `text-stone-500` | `text-stone-500` |
| Word (unlit) | `text-stone-400` | `text-stone-500` |
| Word (lit) | `text-stone-900` | `text-stone-100` |
| Halo background | `bg-stone-200` | `bg-stone-800` |

---

## Files Changed

- `src/components/AISection.tsx` — full rewrite of component internals (interface stays the same)

No new files, no data changes, no routing changes.
