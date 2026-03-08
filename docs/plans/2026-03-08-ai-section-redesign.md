# AISection Redesign — Personal Statement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace AISection with a personal statement section — scroll-driven word-by-word quote highlight on the left, parallax circular portrait on the right, theme-reactive halo behind the image.

**Architecture:** Single component rewrite (`AISection.tsx`). Uses Framer Motion `useScroll` + `useTransform` for both the parallax image drift and scroll-progress-based word highlight. Word colour is driven by a `useMotionValueEvent` subscription that updates a React state array, mapping scroll progress `[0, 1]` to each word's lit/unlit state.

**Tech Stack:** React 19, TypeScript, Framer Motion (`useScroll`, `useTransform`, `useMotionValueEvent`), Tailwind CSS v4

---

### Task 1: Rewrite AISection shell — layout only, no animations yet

**Files:**
- Modify: `src/components/AISection.tsx`

**Step 1: Replace the file contents with the new static layout**

Remove all existing content. Write the two-column layout with the label, quote text (plain, no word-splitting yet), and the circular image. No motion, no scroll hooks yet — just verify the layout renders correctly.

```tsx
import { useRef } from 'react';

const QUOTE = 'Passionate about shaping the future of AI through user-centric design thinking.';

export const AISection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="bg-white dark:bg-stone-950 py-24 md:py-32 px-8 md:px-16 lg:px-24"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">

        {/* Text — left */}
        <div className="flex-1 flex flex-col gap-6">
          <span className="text-xs uppercase tracking-widest text-stone-500">
            Personal Statement
          </span>
          <p className="text-3xl md:text-4xl font-light leading-relaxed text-stone-500 dark:text-stone-500">
            {QUOTE}
          </p>
        </div>

        {/* Portrait — right */}
        <div className="flex-shrink-0 p-2 rounded-full bg-stone-200 dark:bg-stone-800 ring-1 ring-stone-300 dark:ring-stone-700">
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden">
            <img
              src="/images/SDPasspic.jpg"
              alt="Sourav Debnath"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
};
```

**Step 2: Run dev server and verify visually**

```bash
npm run dev
```

Check:
- Two columns on desktop, stacked on mobile
- Circular image with halo visible
- Label above quote in muted uppercase
- Quote renders in muted stone colour
- Halo switches colour between light/dark theme

**Step 3: Commit**

```bash
git add src/components/AISection.tsx
git commit -m "feat: AISection — new layout shell, circular portrait, personal statement"
```

---

### Task 2: Add word-by-word scroll highlight

**Files:**
- Modify: `src/components/AISection.tsx`

**Step 1: Split the quote into words and add scroll tracking**

Replace the plain `<p>` with a word-split version. Use `useScroll` targeting the section ref, then `useMotionValueEvent` to update a `litCount` state that tracks how many words are illuminated.

The full rewritten component:

```tsx
import { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

const QUOTE = 'Passionate about shaping the future of AI through user-centric design thinking.';
const WORDS = QUOTE.split(' ');

export const AISection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [litCount, setLitCount] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    // Highlight words across the middle 60% of scroll range (0.2 → 0.8)
    // so words start lighting up once section is well in view
    const adjusted = Math.max(0, (progress - 0.2) / 0.6);
    setLitCount(Math.round(adjusted * WORDS.length));
  });

  return (
    <section
      ref={sectionRef}
      className="bg-white dark:bg-stone-950 py-24 md:py-32 px-8 md:px-16 lg:px-24"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">

        {/* Text — left */}
        <div className="flex-1 flex flex-col gap-6">
          <span className="text-xs uppercase tracking-widest text-stone-500">
            Personal Statement
          </span>
          <p className="text-3xl md:text-4xl font-light leading-relaxed">
            {WORDS.map((word, i) => (
              <span
                key={i}
                className={[
                  'transition-colors duration-300 mr-[0.3em]',
                  i < litCount
                    ? 'text-stone-900 dark:text-stone-100'
                    : 'text-stone-400 dark:text-stone-500',
                ].join(' ')}
              >
                {word}
              </span>
            ))}
          </p>
        </div>

        {/* Portrait — right */}
        <div className="flex-shrink-0 p-2 rounded-full bg-stone-200 dark:bg-stone-800 ring-1 ring-stone-300 dark:ring-stone-700">
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden">
            <img
              src="/images/SDPasspic.jpg"
              alt="Sourav Debnath"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
};
```

**Step 2: Verify scroll behaviour**

```bash
npm run dev
```

Check:
- Words start muted and illuminate left-to-right as you scroll through the section
- All words are lit by the time the section exits the viewport
- Scrolling back up dims words again (reactive, not one-shot)
- `transition-colors duration-300` gives a smooth colour fade, not a snap

**Step 3: Commit**

```bash
git add src/components/AISection.tsx
git commit -m "feat: AISection — scroll-driven word-by-word highlight on personal statement"
```

---

### Task 3: Add parallax drift to the portrait

**Files:**
- Modify: `src/components/AISection.tsx`

**Step 1: Wrap the portrait in a motion.div with y transform**

Add `useTransform` to map `scrollYProgress` → a `y` value for the image container. The same `scrollYProgress` from Task 2 is reused — no new scroll hook needed.

Replace the portrait block with:

```tsx
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

// Inside the component, after scrollYProgress:
const imageY = useTransform(scrollYProgress, [0, 1], ['0px', '-40px']);

// JSX — replace the portrait div:
<motion.div
  style={{ y: imageY }}
  className="flex-shrink-0 p-2 rounded-full bg-stone-200 dark:bg-stone-800 ring-1 ring-stone-300 dark:ring-stone-700"
>
  <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden">
    <img
      src="/images/SDPasspic.jpg"
      alt="Sourav Debnath"
      className="w-full h-full object-cover"
    />
  </div>
</motion.div>
```

The full final component with all three tasks integrated:

```tsx
import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

const QUOTE = 'Passionate about shaping the future of AI through user-centric design thinking.';
const WORDS = QUOTE.split(' ');

export const AISection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [litCount, setLitCount] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const adjusted = Math.max(0, (progress - 0.2) / 0.6);
    setLitCount(Math.round(adjusted * WORDS.length));
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['0px', '-40px']);

  return (
    <section
      ref={sectionRef}
      className="bg-white dark:bg-stone-950 py-24 md:py-32 px-8 md:px-16 lg:px-24"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">

        {/* Text — left */}
        <div className="flex-1 flex flex-col gap-6">
          <span className="text-xs uppercase tracking-widest text-stone-500">
            Personal Statement
          </span>
          <p className="text-3xl md:text-4xl font-light leading-relaxed">
            {WORDS.map((word, i) => (
              <span
                key={i}
                className={[
                  'transition-colors duration-300 mr-[0.3em]',
                  i < litCount
                    ? 'text-stone-900 dark:text-stone-100'
                    : 'text-stone-400 dark:text-stone-500',
                ].join(' ')}
              >
                {word}
              </span>
            ))}
          </p>
        </div>

        {/* Portrait — right */}
        <motion.div
          style={{ y: imageY }}
          className="flex-shrink-0 p-2 rounded-full bg-stone-200 dark:bg-stone-800 ring-1 ring-stone-300 dark:ring-stone-700"
        >
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden">
            <img
              src="/images/SDPasspic.jpg"
              alt="Sourav Debnath"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
};
```

**Step 2: Verify parallax**

```bash
npm run dev
```

Check:
- Portrait drifts upward subtly as you scroll through the section
- Motion feels smooth, not jumpy
- Word highlight and parallax work simultaneously without conflict

**Step 3: Build check**

```bash
npm run build
```

Expected: no TypeScript errors, clean build.

**Step 4: Commit**

```bash
git add src/components/AISection.tsx
git commit -m "feat: AISection — parallax portrait drift, complete personal statement section"
```
