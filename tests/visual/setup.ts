import { Page } from '@playwright/test';

export async function scrollToSection(page: Page, sectionId: string) {
  await page.evaluate((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'instant' });
  }, sectionId);
  await page.waitForTimeout(600);
}

export async function freezeAnimations(page: Page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `,
  });
  await page.waitForTimeout(500);
}

export const SCREENSHOT_OPTIONS = {
  maxDiffPixelRatio: 0.15,
  threshold: 0.2,
} as const;
