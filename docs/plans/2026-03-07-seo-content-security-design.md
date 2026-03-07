# Design: SEO, Markdown Content Pipeline & Security
**Date**: 2026-03-07
**Status**: Approved
**Scope**: Additive to `context/implementation-plan.md` (UI redesign plan)

---

## Context

Portfolio site for Sourav Debnath — React SPA, Vite + Tailwind v4, GitHub Pages, custom domain `souravdebnath.com`. Three concerns not covered in the UI redesign plan: search engine discoverability, content editing without TypeScript knowledge, and baseline security hygiene.

---

## Decisions

| Topic | Choice | Rationale |
|---|---|---|
| SEO approach | Static pre-rendering via `vite-ssg` | Custom domain + ranking intent requires real HTML, not client-rendered content |
| Content pipeline | Markdown files with YAML frontmatter in `content/` | Git-based workflow, no CMS, no TypeScript for content updates |
| Security | Basic hygiene only | Static portfolio — no server, no user data, no attack surface beyond dependency CVEs |

---

## 1. SEO — Static Pre-rendering

### Package
- `vite-ssg` — wraps the existing Vite build, pre-renders all routes to static HTML
- `react-helmet-async` — manages `<head>` content per route

### Meta Tags
```html
<title>Sourav Debnath | AI PM</title>
<meta name="description" content="AI Product Manager | Solving Business Problems with Scalable AI Products">
<link rel="canonical" href="https://souravdebnath.com">

<!-- Open Graph (LinkedIn / Twitter previews) -->
<meta property="og:title" content="Sourav Debnath | AI PM">
<meta property="og:description" content="AI Product Manager | Solving Business Problems with Scalable AI Products">
<meta property="og:url" content="https://souravdebnath.com">
<meta property="og:type" content="website">
<meta property="og:image" content="https://souravdebnath.com/og-image.jpg">
```

### JSON-LD Structured Data
Person schema in `<head>` — enables Google Knowledge Panel eligibility:
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Sourav Debnath",
  "jobTitle": "Senior Product Manager",
  "description": "AI Product Manager building GenAI products at scale",
  "url": "https://souravdebnath.com",
  "sameAs": [
    "https://linkedin.com/in/souravdebnath",
    "https://github.com/sourav27"
  ],
  "alumniOf": [
    { "@type": "CollegeOrUniversity", "name": "Indian Institute of Management Bangalore" },
    { "@type": "CollegeOrUniversity", "name": "Indian Institute of Technology Madras" }
  ],
  "worksFor": { "@type": "Organization", "name": "AB InBev" }
}
```

### Build & Deploy
- Change `package.json` build script: `"build": "vite-ssg build"`
- `vite.config.ts`: no changes needed beyond what `vite-ssg` docs require
- GitHub Actions pipeline unchanged — still runs `npm run build`, deploys `dist/`
- Add `public/sitemap.xml` and `public/robots.txt` as static files (single-URL sitemap)
- Add `public/og-image.jpg` — 1200×630px OG image (to be designed separately)

---

## 2. Markdown Content Pipeline

### Content Directory Structure
```
content/
├── experiences/
│   ├── ab-inbev.md
│   ├── bain.md
│   ├── vedanta-pm.md
│   └── vedanta-ai.md
├── achievements.md       ← single file, array in frontmatter
├── gallery.md            ← single file, array in frontmatter + EXIF
└── about.md
public/
└── images/
    ├── experiences/      ← feature images referenced in experience frontmatter
    ├── logos/            ← company logos
    └── gallery/          ← gallery photos
```

### Experience File Format
```md
---
id: ab-inbev
role: Senior Product Manager
company: AB InBev
period: May 2024 – Present
location: Bengaluru
image: /images/experiences/ab-inbev.jpg
logo: /images/logos/ab-inbev.svg
stats:
  - label: MAU Growth
    value: "20x"
  - label: Savings
    value: "$1M+"
  - label: Accuracy
    value: "91%"
skills: [GenAI, Product Strategy, Agentic Workflows, RLHF]
testimonial:
  text: "Sourav transformed how we access data..."
  author: Jane Doe
  role: Global Director of Analytics
---

Leading Generative AI initiatives for the world's largest brewer. Spearheaded the enterprise Data Insights Copilot from 0-to-1, scaling to 500+ MAU across global business units.
```

### Achievements File Format (`content/achievements.md`)
```md
---
achievements:
  - name: Culture Champion Award
    context: AB InBev
    metric: Top 1% recognition
    year: "2025"
  - name: 0→1 GenAI Copilot
    context: AB InBev
    metric: 500+ MAU, 20x growth
    year: "2024"
  - name: $1M+ Annual Savings
    context: AB InBev Supply Chain
    metric: $1M+ cost avoidance
    year: "2024"
  - name: National Runner Up + PPO
    context: Accenture Strategy
    metric: Top 2 nationally
    year: "2023"
  - name: $10B+ Market POV
    context: Bain & Company
    metric: 5-yr India strategy
    year: "2023"
  - name: Chairman's Award
    context: Vedanta Limited
    metric: Highest individual award
    year: "2022"
  - name: $250M+ Profit Accrual
    context: Vedanta Industry 4.0
    metric: $250M+ impact
    year: "2020"
---
```

### Gallery File Format (`content/gallery.md`)
```md
---
gallery:
  - src: /images/gallery/photo-1.jpg
    alt: Description of photo
    camera: Sony A7III
    lens: 35mm f/1.4
    iso: "400"
    aperture: f/2.8
  - src: /images/gallery/photo-2.jpg
    alt: Description of photo
    camera: Canon R5
    lens: 85mm f/1.2
    iso: "200"
    aperture: f/1.8
---
```

### Build Utility (`src/lib/content.ts`)
- Uses `gray-matter` to parse frontmatter from each `.md` file
- Validates output against existing `ExperienceItem`, `AchievementItem`, `GalleryItem` interfaces
- Exports typed arrays identical in shape to the current `experiences.ts` and `achievements.ts` exports
- Components import from `content.ts` — zero component changes needed
- Existing `src/data/experiences.ts` and `src/data/achievements.ts` are deleted once migration is verified

### Packages
- `gray-matter` — frontmatter parser
- `vite-plugin-markdown` (or raw `fs` reads in `vite.config.ts` via `vite-plugin-content`) — makes `.md` files importable at build time

---

## 3. Security Hygiene

### External Links
- Every `<a target="_blank">` across the codebase gets `rel="noopener noreferrer"`
- Files to audit: `Hero.tsx`, `Navbar.tsx`, `Footer.tsx`, `SelectedWork.tsx`
- Add an ESLint rule (`eslint-plugin-jsx-a11y` → `anchor-has-content`) or a custom rule to catch future violations

### Self-hosted Fonts
- Remove Google Fonts `@import` from `index.css`
- Download as `.woff2`: Inter weights 300, 400, 500, 600 + JetBrains Mono weight 400
- Store in `public/fonts/`
- Replace with `@font-face` declarations in `index.css`
- Benefits: removes Google tracking pixel, eliminates render-blocking external request, improves LCP

### Dependency Audit in CI
Add to `.github/workflows/deploy.yml` before the build step:
```yaml
- name: Audit dependencies
  run: npm audit --audit-level=high
```
Fails the deploy pipeline if a high-severity CVE is found in any dependency.

---

## Out of Scope
- CSP headers (GitHub Pages cannot serve custom HTTP headers)
- Subresource integrity
- Dark/light mode toggle (intentional permanent dark mode per design spec)
- Case study sub-pages (noted as future work in implementation plan)
