const DEFAULT_GOOGLE_QUERY = 'Nazarje, Slovenija';

export function googleMapsEmbedUrl(location: string, fallback?: string): string {
  const query = location.trim() || DEFAULT_GOOGLE_QUERY;
  if (fallback?.includes('google.com/maps') || fallback?.includes('maps.google')) {
    return fallback;
  }
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

export function googleMapsSearchUrl(location: string): string {
  const query = location.trim() || DEFAULT_GOOGLE_QUERY;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
