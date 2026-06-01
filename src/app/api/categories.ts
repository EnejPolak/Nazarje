import { apiFetch, useMockData } from './client';
import type { ApiCategory } from './types';
import { CATEGORY_COLOR_HEX } from '../data/events';

const mockCategories: ApiCategory[] = Object.entries(CATEGORY_COLOR_HEX).map(([name, color_hex], i) => ({
  id: i + 1,
  name,
  color_hex,
  sort_order: i + 1,
}));

export async function fetchCategories(): Promise<ApiCategory[]> {
  if (useMockData()) {
    return mockCategories;
  }
  return apiFetch<ApiCategory[]>('/categories.php');
}

/** Build name → color map from API (falls back to static hex). */
export function categoryColorsFromApi(categories: ApiCategory[]): Record<string, string> {
  const map = { ...CATEGORY_COLOR_HEX };
  for (const c of categories) {
    map[c.name] = c.color_hex;
  }
  return map;
}
