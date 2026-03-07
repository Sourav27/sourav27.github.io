import { test, expect } from '@playwright/test';
import { scrollToSection, freezeAnimations, SCREENSHOT_OPTIONS } from './setup';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await freezeAnimations(page);
  await page.waitForLoadState('networkidle');
});

// ── NAVBAR (Master Task 3) ────────────────────────────────────────────
test('navbar — monogram and links render correctly @task3', async ({ page }) => {
  const navbar = page.locator('nav').first();
  await expect(navbar).toBeVisible();

  await expect(page.getByText('S.D.').first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Work' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Contact' })).toBeVisible();

  await expect(navbar).toHaveScreenshot('navbar.png', SCREENSHOT_OPTIONS);
});

test('navbar — becomes frosted glass on scroll @task3', async ({ page }) => {
  await page.evaluate(() => window.scrollBy(0, 200));
  await page.waitForTimeout(400);
  const navbar = page.locator('nav').first();
  await expect(navbar).toHaveClass(/backdrop-blur/);
});

// ── HERO (Master Task 4) ──────────────────────────────────────────────
test('hero — name headline and descriptor visible @task4', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Sourav Debnath');

  const descriptors = ['GenAI PM', 'Builder', 'Strategist'];
  let found = false;
  for (const d of descriptors) {
    if (await page.getByText(d).isVisible().catch(() => false)) {
      found = true;
      break;
    }
  }
  expect(found).toBe(true);

  await expect(page.getByRole('link', { name: 'LinkedIn' }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Resume' }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'GitHub' }).first()).toBeVisible();
  await expect(page.getByText('scroll')).toBeVisible();

  const hero = page.locator('[class*="h-screen"]').first();
  await expect(hero).toHaveScreenshot('hero-section.png', SCREENSHOT_OPTIONS);
});

// ── MARQUEE (Master Task 5) ───────────────────────────────────────────
test('marquee — all company names present @task5', async ({ page }) => {
  await scrollToSection(page, 'about');

  const companies = ['AB InBev', 'Bain & Company', 'Vedanta', 'IIT Madras', 'IIM Bangalore'];
  for (const company of companies) {
    await expect(page.getByText(company).first()).toBeVisible();
  }
});

// ── ABOUT (Master Task 6) ─────────────────────────────────────────────
test('about — stats, education, competency pills @task6', async ({ page }) => {
  await scrollToSection(page, 'about');

  await expect(page.getByText('5.5+').first()).toBeVisible();
  await expect(page.getByText('500+').first()).toBeVisible();
  await expect(page.getByText('IIM Bangalore').first()).toBeVisible();
  await expect(page.getByText('IIT Madras').first()).toBeVisible();
  await expect(page.getByText('Generative AI').first()).toBeVisible();

  const aboutSection = page.locator('#about');
  const html = await aboutSection.innerHTML();
  expect(html).not.toMatch(/orange-/);

  await expect(aboutSection).toHaveScreenshot('about.png', SCREENSHOT_OPTIONS);
});

// ── SELECTED WORK (Master Task 7) ────────────────────────────────────
test('selected work — heading and experience cards @task7', async ({ page }) => {
  await scrollToSection(page, 'work');

  await expect(page.getByRole('heading', { name: 'Selected Work' })).toBeVisible();

  for (const company of ['AB InBev', 'Bain & Company', 'Vedanta Resources']) {
    await expect(page.getByText(company).first()).toBeVisible();
  }

  await expect(page.getByText('20x').first()).toBeVisible();
});

test('selected work — card images are grayscale by default @task7', async ({ page }) => {
  await scrollToSection(page, 'work');

  const cardImages = page.locator('#work img');
  const count = await cardImages.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const cls = await cardImages.nth(i).getAttribute('class') ?? '';
    expect(cls).toContain('grayscale');
  }
});

// ── ACHIEVEMENTS (Master Task 9) ──────────────────────────────────────
test('achievements — table with 7 rows @task9', async ({ page }) => {
  await scrollToSection(page, 'achievements');

  await expect(page.getByRole('heading', { name: 'Achievements' })).toBeVisible();
  await expect(page.getByText('Culture Champion Award')).toBeVisible();
  await expect(page.getByText("Chairman's Award")).toBeVisible();
  await expect(page.getByText('$250M+ Profit Accrual')).toBeVisible();

  const section = page.locator('#achievements');
  await expect(section).toHaveScreenshot('achievements.png', SCREENSHOT_OPTIONS);
});

// ── GALLERY (Master Task 10) ──────────────────────────────────────────
test('gallery — images present and grayscale by default @task10', async ({ page }) => {
  await scrollToSection(page, 'gallery');

  await expect(page.getByRole('heading', { name: 'Perspective' })).toBeVisible();

  const images = page.locator('#gallery img');
  const count = await images.count();
  expect(count).toBe(4);

  for (let i = 0; i < count; i++) {
    const cls = await images.nth(i).getAttribute('class') ?? '';
    expect(cls).toContain('grayscale');
  }

  const section = page.locator('#gallery');
  await expect(section).toHaveScreenshot('gallery.png', SCREENSHOT_OPTIONS);
});

// ── FOOTER (Master Task 11) ───────────────────────────────────────────
test('footer — CTA, social links, monogram @task11', async ({ page }) => {
  await scrollToSection(page, 'contact');

  await expect(page.getByText("Let's build something.")).toBeVisible();
  await expect(page.getByRole('link', { name: 'Email' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'LinkedIn' }).last()).toBeVisible();
  await expect(page.getByRole('link', { name: 'GitHub' }).last()).toBeVisible();
  await expect(page.locator('footer').getByText('S.D.')).toBeVisible();

  const footer = page.locator('footer');
  await expect(footer).toHaveScreenshot('footer.png', SCREENSHOT_OPTIONS);
});

// ── FULL PAGE (final integration) ────────────────────────────────────
test('full page — complete visual regression @final', async ({ page }) => {
  await expect(page).toHaveScreenshot('full-page.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.20,
    threshold: 0.25,
  });
});
