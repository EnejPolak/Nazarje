import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const distDir = resolve(root, 'dist');

const siteUrl = (process.env.VITE_SITE_URL || 'https://dogodki.nazarje.si').replace(/\/$/, '');

function normalizeApiBaseUrl(raw) {
  const url = (raw?.trim() || 'https://api.nazarje.si').replace(/\/$/, '');
  if (!url) return 'https://api.nazarje.si';
  if (url.startsWith('/')) return url;
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

const apiBaseUrl = normalizeApiBaseUrl(process.env.VITE_API_URL);

function eventSegment(event) {
  return event.slug?.trim() || event.id;
}

async function fetchEvents() {
  try {
    const res = await fetch(`${apiBaseUrl}/events.php`, { headers: { Accept: 'application/json' } });
    if (!res.ok) {
      console.warn(`[prerender] API returned ${res.status}; prerendering static pages only.`);
      return [];
    }
    const payload = await res.json();
    if (!payload?.success || !Array.isArray(payload.data)) {
      console.warn('[prerender] Unexpected API response; prerendering static pages only.');
      return [];
    }
    return payload.data;
  } catch (err) {
    console.warn('[prerender] Could not fetch events:', err.message);
    return [];
  }
}

function outputPathForRoute(route) {
  if (route === '/') return resolve(distDir, 'index.html');
  const clean = route.replace(/^\/+/, '').replace(/\/+$/, '');
  return resolve(distDir, clean, 'index.html');
}

async function run() {
  if (!existsSync(resolve(distDir, 'index.html'))) {
    console.warn('[prerender] dist/index.html missing — run "vite build" first. Skipping.');
    return;
  }

  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch {
    console.warn('[prerender] Playwright not installed — skipping prerender (SPA fallback remains).');
    return;
  }

  let preview;
  try {
    ({ preview } = await import('vite'));
  } catch {
    console.warn('[prerender] Vite preview unavailable — skipping prerender.');
    return;
  }

  const events = await fetchEvents();
  const routes = [
    '/',
    '/events',
    '/past-events',
    '/zasebnost',
    '/piskotki',
    ...events.map((e) => `/event/${eventSegment(e)}`),
  ];

  const server = await preview({ preview: { port: 4181, strictPort: false } });
  const baseUrl = server.resolvedUrls?.local?.[0]?.replace(/\/$/, '');

  if (!baseUrl) {
    console.warn('[prerender] Could not resolve preview URL — skipping.');
    await closeServer(server);
    return;
  }

  let browser;
  try {
    browser = await chromium.launch();
  } catch (err) {
    console.warn(`[prerender] Could not launch Chromium (${err.message}) — skipping prerender.`);
    await closeServer(server);
    return;
  }

  let ok = 0;
  try {
    const context = await browser.newContext({
      timezoneId: 'Europe/Ljubljana',
      locale: 'sl-SI',
    });
    // The events API only allows CORS from the production origin, so the
    // in-browser fetch from the local preview is blocked. Proxy API calls
    // through Node (no CORS) and return them with a permissive CORS header.
    await context.route(`${apiBaseUrl}/**`, async (route) => {
      try {
        const request = route.request();
        const res = await fetch(request.url(), {
          method: request.method(),
          headers: { Accept: 'application/json' },
        });
        const body = await res.text();
        await route.fulfill({
          status: res.status,
          headers: {
            'content-type': res.headers.get('content-type') || 'application/json',
            'access-control-allow-origin': '*',
          },
          body,
        });
      } catch {
        await route.continue();
      }
    });

    const page = await context.newPage();
    for (const route of routes) {
      try {
        await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForSelector('#main-content, main', { timeout: 10000 }).catch(() => {});
        const html = await page.content();
        const outPath = outputPathForRoute(route);
        mkdirSync(dirname(outPath), { recursive: true });
        writeFileSync(outPath, html, 'utf8');
        ok += 1;
      } catch (err) {
        console.warn(`[prerender] Failed ${route}: ${err.message}`);
      }
    }
  } finally {
    await browser.close().catch(() => {});
    await closeServer(server);
  }

  console.log(`[prerender] Prerendered ${ok}/${routes.length} routes to dist/.`);
}

function closeServer(server) {
  return new Promise((resolveClose) => {
    if (server?.httpServer) {
      server.httpServer.close(() => resolveClose());
    } else {
      resolveClose();
    }
  });
}

run().catch((err) => {
  // Never fail the build because of prerender.
  console.warn('[prerender] Unexpected error, continuing without prerender:', err.message);
});
