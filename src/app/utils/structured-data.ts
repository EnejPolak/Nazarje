import type { EventData } from '../data/events';
import { absoluteUrl, getObcinaUrl, getOgDefaultImage, getSiteUrl } from './site-config';
import { eventDetailPath } from './event-path';

const ORGANIZATION_NAME = 'Občina Nazarje';

type JsonLd = Record<string, unknown>;

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function timezoneOffset(date: Date): string {
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const abs = Math.abs(offsetMinutes);
  return `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
}

/**
 * Combine an event date with an "HH:MM" time string into an ISO 8601 datetime
 * with timezone offset (e.g. 2026-07-12T18:00:00+02:00). Falls back to a
 * date-only string when no valid time is provided.
 */
function toIsoDateTime(date: Date, time?: string): string {
  const dateOnly = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const match = time?.trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) return dateOnly;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const withTime = new Date(date);
  withTime.setHours(hours, minutes, 0, 0);
  return `${dateOnly}T${pad(hours)}:${pad(minutes)}:00${timezoneOffset(withTime)}`;
}

export function buildEventJsonLd(event: EventData): JsonLd {
  const image = event.imageUrl ? absoluteUrl(event.imageUrl) : getOgDefaultImage();
  const endDate = event.dateEnd ?? event.date;

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: toIsoDateTime(event.date, event.time),
    endDate: toIsoDateTime(endDate, event.timeEnd ?? event.time),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    image: [image],
    url: absoluteUrl(eventDetailPath(event)),
    location: {
      '@type': 'Place',
      name: event.location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Nazarje',
        addressRegion: 'Savinjska',
        postalCode: '3331',
        addressCountry: 'SI',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: event.organizerName || ORGANIZATION_NAME,
      url: getObcinaUrl(),
    },
  };
}

export function buildOrganizationJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORGANIZATION_NAME,
    url: getSiteUrl(),
    logo: getOgDefaultImage(),
    sameAs: [getObcinaUrl()],
  };
}

export function buildWebSiteJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Dogodki Nazarje',
    url: getSiteUrl(),
    inLanguage: 'sl-SI',
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
