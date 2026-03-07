import matter from 'gray-matter';
import type { ExperienceItem } from '../data/experiences';
import type { AchievementItem } from '../data/achievements';
import type { GalleryItem } from '../data/gallery';

// Vite bundles these at build time as raw strings — no fs/Node required
const experienceRaw = import.meta.glob('/content/experiences/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;
const singleFiles = import.meta.glob('/content/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;

const EXPERIENCE_ORDER = ['ab-inbev', 'bain', 'vedanta-pm', 'vedanta-ai'];

// ── Experiences ──────────────────────────────────────────────────────
export function loadExperiences(): ExperienceItem[] {
  const items = Object.entries(experienceRaw).map(([, raw]) => {
    const { data, content } = matter(raw);
    return { ...data, description: content.trim() } as ExperienceItem;
  });

  return EXPERIENCE_ORDER
    .map((id) => items.find((i) => i.id === id))
    .filter(Boolean) as ExperienceItem[];
}

// ── Achievements ─────────────────────────────────────────────────────
export function loadAchievements(): AchievementItem[] {
  const raw = singleFiles['/content/achievements.md'];
  const { data } = matter(raw);
  return data.achievements as AchievementItem[];
}

// ── Gallery ──────────────────────────────────────────────────────────
export function loadGallery(): GalleryItem[] {
  const raw = singleFiles['/content/gallery.md'];
  const { data } = matter(raw);
  return data.gallery as GalleryItem[];
}

// ── About ────────────────────────────────────────────────────────────
export interface AboutData {
  stats: { label: string; value: string }[];
  education: { institution: string; degree: string; period: string; gpa: string }[];
  competencies: string[];
  bio: string;
}

export function loadAbout(): AboutData {
  const raw = singleFiles['/content/about.md'];
  const { data, content } = matter(raw);
  return { ...data, bio: content.trim() } as AboutData;
}
