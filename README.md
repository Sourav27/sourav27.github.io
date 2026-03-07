# sourav27.github.io

Personal portfolio website for **Sourav Debnath** — built with React 19, TypeScript, Vite, and Tailwind CSS v4. Deployed to GitHub Pages via GitHub Actions.

---

## Running the development server

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173` (or the next available port).

---

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start local dev server with hot reload |
| `npm run sync` | Regenerate `src/data/*.ts` from `content/*.md` |
| `npm run build` | Type-check, bundle, and pre-render to `dist/` |
| `npm run preview` | Serve the production `dist/` build locally |
| `npm run lint` | Run ESLint |
| `npx playwright test` | Run visual regression tests |

---

## Content pipeline

All portfolio content lives in `content/` as markdown files. The build pipeline is:

```
Edit content/*.md
  → npm run sync      ← regenerates src/data/*.ts from markdown
  → npm run build     ← bundles + pre-renders HTML for SEO
  → git push origin main
  → GitHub Actions deploys to GitHub Pages automatically
```

### Content files

| File | What it controls |
|------|-----------------|
| `content/experiences/*.md` | Work history cards (Selected Work section) |
| `content/achievements.md` | Achievements table |
| `content/gallery.md` | Photo gallery |
| `content/about.md` | Bio, stats, education, competencies |

---

## CRUD: Work experience

Each experience is a separate `.md` file in `content/experiences/`.

### Add a new experience

1. Create `content/experiences/<slug>.md` (use kebab-case, e.g. `google-pm.md`):

```markdown
---
id: google-pm
role: Senior Product Manager
company: Google
period: Jan 2025 – Present
location: Bangalore, India
logo: /images/logos/google.svg
image: /images/experiences/google.jpg
stats:
  - label: Users
    value: 1M+
  - label: Revenue
    value: $5M
  - label: Uptime
    value: 99.9%
skills:
  - Product Strategy
  - GenAI
  - Data Analytics
testimonial:
  text: "Sourav shipped faster than anyone I've worked with."
  author: Jane Doe
  role: VP Product, Google
---

Description of the role goes here. Supports **markdown**.
```

2. Add the `id` to the order array in `scripts/sync-content.ts`:

```ts
const EXPERIENCE_ORDER = ['ab-inbev', 'bain', 'vedanta-pm', 'vedanta-ai', 'google-pm'];
```

3. Sync and preview:

```bash
npm run sync
npm run dev
```

### Edit an existing experience

Open the relevant file (e.g. `content/experiences/ab-inbev.md`), edit frontmatter or body, then:

```bash
npm run sync
```

### Delete an experience

1. Delete the `.md` file from `content/experiences/`
2. Remove its `id` from `EXPERIENCE_ORDER` in `scripts/sync-content.ts`
3. Run `npm run sync`

### Reorder experiences

Change the order of ids in `EXPERIENCE_ORDER` in `scripts/sync-content.ts`, then run `npm run sync`.

---

## CRUD: Achievements

All achievements live in the frontmatter of `content/achievements.md` as a YAML list.

### Add / edit / delete an achievement

Open `content/achievements.md` and edit the `achievements` list:

```yaml
---
achievements:
  - name: Top 1% Global
    context: Bain & Company
    metric: Ranked top 1% of analysts globally
    year: "2022"
  - name: Best Innovation Award
    context: AB InBev
    metric: Won for GenAI Copilot product
    year: "2025"
---
```

Then sync:

```bash
npm run sync
```

---

## CRUD: Gallery

All gallery items live in the frontmatter of `content/gallery.md`.

### Add / edit / delete a photo

1. Place the image file in `public/images/gallery/`
2. Open `content/gallery.md` and add an entry:

```yaml
---
gallery:
  - src: /images/gallery/photo-1.jpg
    alt: Misty mountains at dawn
    camera: Sony A7IV
    lens: 24-70mm f/2.8
    iso: "400"
    aperture: f/4
  - src: /images/gallery/photo-5.jpg
    alt: Description of photo
    camera: Sony A7IV
    lens: 85mm f/1.8
    iso: "200"
    aperture: f/2
---
```

3. Sync:

```bash
npm run sync
```

---

## CRUD: About section

The About section is driven by `content/about.md`. Frontmatter holds structured data; the markdown body is the bio paragraph.

```markdown
---
stats:
  - label: Years Experience
    value: 5.5+
  - label: Products Launched
    value: "3+"
  - label: Peak MAU
    value: 500+
education:
  - institution: IIM Bangalore
    degree: MBA, General Management
    period: 2022–24
    gpa: 3.2/4.0
  - institution: IIT Madras
    degree: B.Tech Honours, Mechanical Engineering
    period: 2014–18
    gpa: 8.9/10.0
competencies:
  - Product Leadership
  - Generative AI
  - Agentic Workflows
---

Senior Product Manager with 5.5+ years of experience...
```

Edit the file, then sync:

```bash
npm run sync
```

---

## Deployment

Push to `main` → GitHub Actions runs `npm ci && npm run build` → deploys `dist/` to GitHub Pages automatically.

The build script (`tsc -b && vite build && node scripts/prerender.mjs`) pre-renders the full page to `dist/index.html` so crawlers and social previews see real HTML content.

---

## Project structure

```
content/                  ← edit these to update content
  about.md
  achievements.md
  gallery.md
  experiences/
    ab-inbev.md
    bain.md
    vedanta-ai.md
    vedanta-pm.md

src/
  components/             ← React section components
  data/                   ← AUTO-GENERATED by npm run sync — do not edit manually
  lib/content.ts          ← server-only fs loader (used by prerender, not browser)
  pages/Home.tsx          ← composes all sections

scripts/
  sync-content.ts         ← reads content/*.md → writes src/data/*.ts
  prerender.mjs           ← SSR bundle → patches dist/index.html

public/
  images/                 ← place experience and gallery images here
  fonts/                  ← self-hosted Inter + JetBrains Mono
  resume.pdf              ← linked from nav Resume button
```
