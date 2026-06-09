import type { EventData } from '../data/events';
import type { ApiAttachment, ApiEventListItem } from './types';

function parseDate(value: string | null | undefined): Date | undefined {
  if (!value) return undefined;
  const [y, m, d] = value.split('-').map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

function toBool(value: number | boolean | undefined): boolean {
  return value === true || value === 1;
}

function mapAttachments(items?: ApiAttachment[]): EventData['attachments'] {
  if (!items?.length) return undefined;
  return items.map((a) => ({ name: a.name, url: a.url }));
}

/** List item may lack long_description; detail endpoint includes it. */
export function mapApiEventToEventData(row: ApiEventListItem): EventData {
  const date = parseDate(row.date);
  if (!date) {
    throw new Error(`Neveljaven datum dogodka: ${row.id}`);
  }

  return {
    id: row.id,
    title: row.title,
    date,
    dateEnd: parseDate(row.date_end ?? undefined),
    time: row.time,
    timeEnd: row.time_end ?? undefined,
    description: row.description,
    longDescription: row.long_description ?? row.description,
    category: row.category,
    secondaryFilter: row.secondary_filter ?? undefined,
    isImportant: toBool(row.is_important),
    imageUrl: row.image_url ?? undefined,
    location: row.location,
    locationMapUrl: row.location_map_url,
    attachments: mapAttachments(row.attachments),
    published: row.published !== undefined ? toBool(row.published) : true,
    slug: row.slug ?? undefined,
    organizerName: row.organizer_name?.trim() || undefined,
    organizerEmail: row.organizer_email?.trim() || undefined,
    organizerPhone: row.organizer_phone?.trim() || undefined,
  };
}

export function toDateInputValue(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function mapEventDataToApiPayload(event: EventData): Record<string, unknown> {
  return {
    id: event.id,
    title: event.title,
    date: toDateInputValue(event.date),
    date_end: event.dateEnd ? toDateInputValue(event.dateEnd) : null,
    time: event.time,
    time_end: event.timeEnd ?? null,
    description: event.description,
    long_description: event.longDescription,
    category: event.category,
    secondary_filter: event.secondaryFilter ?? null,
    is_important: event.isImportant ? 1 : 0,
    image_url: event.imageUrl ?? null,
    location: event.location,
    location_map_url: event.locationMapUrl,
    published: event.published === false ? 0 : 1,
    slug: event.slug?.trim() || null,
    organizer_name: event.organizerName?.trim() || null,
    organizer_email: event.organizerEmail?.trim() || null,
    organizer_phone: event.organizerPhone?.trim() || null,
    attachments: (event.attachments ?? []).map((a, i) => ({
      name: a.name,
      url: a.url,
      sort_order: i,
    })),
  };
}

export function newCrmEventId(): string {
  return `crm-${typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now())}`;
}
