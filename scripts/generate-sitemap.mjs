import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const siteUrl = (process.env.VITE_SITE_URL || 'https://dogodki.nazarje.si').replace(/\/$/, '');
const apiUrl = (process.env.VITE_API_URL || 'https://api.nazarje.si').replace(/\/$/, '');

const staticPaths = ['/', '/events', '/past-events', '/zasebnost', '/piskotki'];

function eventPath(event) {
  const segment = event.slug?.trim() || event.id;
  return `/event/${encodeURIComponent(segment)}`;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function fetchEvents() {
  try {
    const res = await fetch(`${apiUrl}/events.php`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      console.warn(`[sitemap] API returned ${res.status}; using static pages only.`);
      return [];
    }
    const payload = await res.json();
    if (!payload?.success || !Array.isArray(payload.data)) {
      console.warn('[sitemap] Unexpected API response; using static pages only.');
      return [];
    }
    return payload.data;
  } catch (err) {
    console.warn('[sitemap] Could not fetch events:', err.message);
    return [];
  }
}

const events = await fetchEvents();
const urls = [
  ...staticPaths.map((path) => ({
    loc: `${siteUrl}${path === '/' ? '' : path}`,
    changefreq: path === '/' || path === '/events' ? 'weekly' : path.startsWith('/z') ? 'yearly' : 'weekly',
    priority: path === '/' ? '1.0' : path === '/events' ? '0.9' : '0.8',
  })),
  ...events.map((event) => ({
    loc: `${siteUrl}${eventPath(event)}`,
    changefreq: 'weekly',
    priority: '0.7',
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

const outPath = resolve(root, 'public/sitemap.xml');
writeFileSync(outPath, xml, 'utf8');
console.log(`[sitemap] Wrote ${urls.length} URLs to public/sitemap.xml`);
