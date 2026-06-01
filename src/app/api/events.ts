import { apiFetch, useMockData } from './client';
import { mapApiEventToEventData } from './mappers';
import type { ApiEventListItem, EventsQueryParams } from './types';
import type { EventData } from '../data/events';
import { eventsData } from '../data/events.mock';

function buildQuery(params?: EventsQueryParams): string {
  if (!params) return '';
  const q = new URLSearchParams();
  if (params.category) q.set('category', params.category);
  if (params.important) q.set('important', '1');
  if (params.from) q.set('from', params.from);
  const s = q.toString();
  return s ? `?${s}` : '';
}

export async function fetchPublishedEvents(params?: EventsQueryParams): Promise<EventData[]> {
  if (useMockData()) {
    return eventsData.filter((e) => e.published !== false);
  }
  const rows = await apiFetch<ApiEventListItem[]>(`/events.php${buildQuery(params)}`);
  return rows.map(mapApiEventToEventData);
}

export async function fetchEventById(id: string): Promise<EventData> {
  if (useMockData()) {
    const found = eventsData.find((e) => e.id === id);
    if (!found) throw new Error('Dogodek ni bil najden.');
    return found;
  }
  const row = await apiFetch<ApiEventListItem>(`/event.php?id=${encodeURIComponent(id)}`);
  return mapApiEventToEventData(row);
}

export async function fetchEventBySlug(slug: string): Promise<EventData> {
  if (useMockData()) {
    const found = eventsData.find((e) => e.slug === slug);
    if (!found) throw new Error('Dogodek ni bil najden.');
    return found;
  }
  const row = await apiFetch<ApiEventListItem>(`/event.php?slug=${encodeURIComponent(slug)}`);
  return mapApiEventToEventData(row);
}
