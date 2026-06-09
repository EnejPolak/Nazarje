const DEFAULT_API_BASE_URL = 'https://api.nazarje.si';

/**
 * Normalizira VITE_API_URL:
 * - dev proxy: /api
 * - produkcija: https://api.nazarje.si
 * - popravi api.nazarje.si brez sheme (sicer fetch misli, da je relativna pot)
 */
export function normalizeApiBaseUrl(raw?: string): string {
  const url = (raw?.trim() || DEFAULT_API_BASE_URL).replace(/\/$/, '');
  if (!url) return DEFAULT_API_BASE_URL;

  if (url.startsWith('/')) {
    return url;
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return `https://${url}`;
}

export const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}

/** Sestavi URL za API endpoint, npr. apiUrl('/events.php') */
export function apiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}
