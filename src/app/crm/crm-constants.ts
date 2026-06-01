export const DEFAULT_MAP_EMBED =
  'https://www.openstreetmap.org/export/embed.html?bbox=14.9167%2C46.3184%2C14.9567%2C46.3384&layer=mapnik&marker=46.3284%2C14.9367';

export const CRM_CATEGORIES = [
  'Kultura',
  'Sejem',
  'Šport',
  'Izobraževanje',
  'Delavnica',
  'Družabno',
] as const;

export const CRM_FILTER_NUJNI = 'Nujno' as const;

export const CRM_CARD_FILTERS: readonly string[] = [...CRM_CATEGORIES, CRM_FILTER_NUJNI];

/** Kategorija v bazi, ko je na kartici izbran samo filter Nujno. */
export const CRM_DEFAULT_CATEGORY = CRM_CATEGORIES[0];

export function cardFilterFromEvent(event: {
  category: string;
  isImportant?: boolean;
  secondaryFilter?: string;
}): string {
  if (event.isImportant) return CRM_FILTER_NUJNI;
  return event.category;
}

export function payloadFromCardFilter(cardFilter: string): {
  category: string;
  isImportant: boolean;
  secondaryFilter?: string;
} {
  if (cardFilter === CRM_FILTER_NUJNI) {
    return { category: CRM_DEFAULT_CATEGORY, isImportant: true };
  }
  return { category: cardFilter, isImportant: false };
}
