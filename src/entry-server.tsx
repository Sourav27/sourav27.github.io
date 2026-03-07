import { renderToString } from 'react-dom/server';
import { StrictMode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

export async function render(): Promise<{ html: string; helmet: string }> {
  const helmetContext: Record<string, any> = {};

  const html = renderToString(
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <App />
      </HelmetProvider>
    </StrictMode>
  );

  // Extract helmet tags (title, meta) for injection into <head>
  const { helmet } = helmetContext;
  const helmetHtml = helmet
    ? [
        helmet.title?.toString() ?? '',
        helmet.meta?.toString() ?? '',
        helmet.link?.toString() ?? '',
        helmet.script?.toString() ?? '',
      ].join('\n')
    : '';

  return { html, helmet: helmetHtml };
}
