const DEFAULT_SITE_URL = 'https://dogodki.nazarje.si';
const DEFAULT_OBCINA_URL = 'https://www.nazarje.si';
const DEFAULT_OG_IMAGE = `${DEFAULT_SITE_URL}/og-default.jpg`;

export function getSiteUrl(): string {
  const url = import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL;
  return url.replace(/\/$/, '');
}

export function getOgDefaultImage(): string {
  return import.meta.env.VITE_OG_DEFAULT_IMAGE || DEFAULT_OG_IMAGE;
}

export function getFacebookUrl(): string | null {
  const url = import.meta.env.VITE_FACEBOOK_URL?.trim();
  return url && url !== '#' ? url : null;
}

export function getInstagramUrl(): string | null {
  const url = import.meta.env.VITE_INSTAGRAM_URL?.trim();
  return url && url !== '#' ? url : null;
}

export function getObcinaUrl(): string {
  return import.meta.env.VITE_OBCINA_URL?.trim() || DEFAULT_OBCINA_URL;
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
