/**
 * Content sync script.
 * Reads content/*.md files and writes src/data/*.ts files.
 * Run: npm run sync
 */
import matter from 'gray-matter';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const CONTENT = join(ROOT, 'content');
const DATA = join(ROOT, 'src', 'data');

// ── Experiences ──────────────────────────────────────────────────────
const EXPERIENCE_ORDER = ['ab-inbev', 'bain', 'vedanta-pm', 'vedanta-ai'];

function syncExperiences() {
  const dir = join(CONTENT, 'experiences');
  const files = readdirSync(dir).filter((f) => f.endsWith('.md'));

  const items = files.map((file) => {
    const raw = readFileSync(join(dir, file), 'utf-8');
    const { data, content } = matter(raw);
    return { ...data, description: content.trim() };
  });

  const ordered = EXPERIENCE_ORDER
    .map((id) => items.find((i: any) => i.id === id))
    .filter(Boolean);

  const out = `// AUTO-GENERATED — edit content/experiences/*.md and run npm run sync
export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  logo: string;
  image: string;
  stats: { label: string; value: string }[];
  skills: string[];
  testimonial?: {
    text: string;
    author: string;
    role: string;
    avatar?: string;
  };
}

export const experiences: ExperienceItem[] = ${JSON.stringify(ordered, null, 2)};
`;

  writeFileSync(join(DATA, 'experiences.ts'), out, 'utf-8');
  console.log(`✓ experiences.ts — ${ordered.length} items`);
}

// ── Achievements ─────────────────────────────────────────────────────
function syncAchievements() {
  const raw = readFileSync(join(CONTENT, 'achievements.md'), 'utf-8');
  const { data } = matter(raw);
  const items = data.achievements;

  const out = `// AUTO-GENERATED — edit content/achievements.md and run npm run sync
export interface AchievementItem {
  name: string;
  context: string;
  metric: string;
  year: string;
}

export const achievements: AchievementItem[] = ${JSON.stringify(items, null, 2)};
`;

  writeFileSync(join(DATA, 'achievements.ts'), out, 'utf-8');
  console.log(`✓ achievements.ts — ${items.length} items`);
}

// ── Gallery ──────────────────────────────────────────────────────────
function syncGallery() {
  const raw = readFileSync(join(CONTENT, 'gallery.md'), 'utf-8');
  const { data } = matter(raw);
  const items = data.gallery;

  const out = `// AUTO-GENERATED — edit content/gallery.md and run npm run sync
export interface GalleryItem {
  src: string;
  alt: string;
  camera?: string;
  lens?: string;
  iso?: string;
  aperture?: string;
}

export const gallery: GalleryItem[] = ${JSON.stringify(items, null, 2)};
`;

  writeFileSync(join(DATA, 'gallery.ts'), out, 'utf-8');
  console.log(`✓ gallery.ts — ${items.length} items`);
}

// ── Personal Statement ────────────────────────────────────────────────
function syncPersonalStatement() {
  const raw = readFileSync(join(CONTENT, 'personal-statement.md'), 'utf-8');
  const { data } = matter(raw);

  const out = `// AUTO-GENERATED — edit content/personal-statement.md and run npm run sync
export interface PersonalStatementData {
  quote: string;
  image: string;
  imageAlt: string;
}

export const personalStatement: PersonalStatementData = ${JSON.stringify(data, null, 2)};
`;

  writeFileSync(join(DATA, 'personal-statement.ts'), out, 'utf-8');
  console.log('✓ personal-statement.ts');
}

// ── Run ──────────────────────────────────────────────────────────────
syncExperiences();
syncAchievements();
syncGallery();
syncPersonalStatement();
console.log('\nSync complete. Run npm run build to deploy changes.');
