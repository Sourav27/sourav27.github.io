/**
 * Prerender script — runs after vite build.
 * Builds SSR bundle, renders app to HTML, patches dist/index.html.
 *
 * Run: node scripts/prerender.mjs
 * (Called automatically via npm run build — see package.json)
 */
import { build } from 'vite';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { pathToFileURL } from 'url';

const ROOT = process.cwd();

async function prerender() {
  console.log('[prerender] Building server bundle...');

  await build({
    build: {
      ssr: 'src/entry-server.tsx',
      outDir: '.ssr-temp',
      emptyOutDir: true,
      rollupOptions: {
        output: { format: 'esm' },
      },
    },
    logLevel: 'warn',
  });

  console.log('[prerender] Rendering HTML...');

  const serverEntry = pathToFileURL(
    join(ROOT, '.ssr-temp', 'entry-server.js')
  ).href;
  const { render } = await import(serverEntry);

  const { html: appHtml, helmet: helmetHtml } = await render();

  const template = readFileSync(join(ROOT, 'dist', 'index.html'), 'utf-8');

  let result = template.replace('</head>', `${helmetHtml}\n  </head>`);
  result = result.replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>`
  );

  writeFileSync(join(ROOT, 'dist', 'index.html'), result, 'utf-8');

  console.log('[prerender] ✓ dist/index.html patched with pre-rendered HTML');
  console.log('[prerender] Cleaning up server bundle...');

  const { rmSync } = await import('fs');
  rmSync(join(ROOT, '.ssr-temp'), { recursive: true, force: true });

  console.log('[prerender] Done.');
}

prerender().catch((e) => {
  console.error('[prerender] FAILED:', e);
  process.exit(1);
});
