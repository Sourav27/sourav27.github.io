/**
 * Server-side content loader — reads markdown files using Node.js fs.
 *
 * USAGE: Only safe to import in server/prerender contexts (Node.js).
 * Do NOT import this in browser component files — it will crash.
 *
 * In a standard Vite SPA build, use src/data/*.ts files instead.
 * In an SSG/prerender build (Phase 2), import from here.
 */
import matter from 'gray-matter';
import { readFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import type { ExperienceItem } from '../data/experiences';
import type { AchievementItem } from '../data/achievements';
import type { GalleryItem } from '../data/gallery';

const contentDir = resolve(process.cwd(), 'content');

const EXPERIENCE_ORDER = ['ab-inbev', 'bain', 'vedanta-pm', 'vedanta-ai'];

export function loadExperiences(): ExperienceItem[] {
  const dir = join(contentDir, 'experiences');
  const files = readdirSync(dir).filter((f) => f.endsWith('.md'));
  const items = files.map((file) => {
    const raw = readFileSync(join(dir, file), 'utf-8');
    const { data, content } = matter(raw);
    return { ...data, description: content.trim() } as ExperienceItem;
  });
  return EXPERIENCE_ORDER
    .map((id) => items.find((i) => i.id === id))
    .filter(Boolean) as ExperienceItem[];
}

export function loadAchievements(): AchievementItem[] {
  const raw = readFileSync(join(contentDir, 'achievements.md'), 'utf-8');
  const { data } = matter(raw);
  return data.achievements as AchievementItem[];
}

export function loadGallery(): GalleryItem[] {
  const raw = readFileSync(join(contentDir, 'gallery.md'), 'utf-8');
  const { data } = matter(raw);
  return data.gallery as GalleryItem[];
}

export interface AboutData {
  stats: { label: string; value: string }[];
  education: { institution: string; degree: string; period: string; gpa: string }[];
  competencies: string[];
  bio: string;
}

export function loadAbout(): AboutData {
  const raw = readFileSync(join(contentDir, 'about.md'), 'utf-8');
  const { data, content } = matter(raw);
  return { ...data, bio: content.trim() } as AboutData;
}
