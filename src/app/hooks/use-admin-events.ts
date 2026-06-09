import { useCallback, useEffect, useState } from 'react';
import { adminFetchEvents } from '../api/admin';
import { ApiError } from '../api/client';
import type { EventData } from '../data/events';

export type AdminEventsMode = 'past' | 'published';

function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function filterPastEvents(events: EventData[]): EventData[] {
  const today = startOfToday();
  return events.filter((event) => {
    const date = new Date(event.date);
    date.setHours(0, 0, 0, 0);
    return date < today;
  });
}

function filterUpcomingEvents(events: EventData[]): EventData[] {
  const today = startOfToday();
  return events.filter((event) => {
    const date = new Date(event.date);
    date.setHours(0, 0, 0, 0);
    return date >= today;
  });
}

export function useAdminEvents(mode: AdminEventsMode) {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminFetchEvents();
      const filtered =
        mode === 'past' ? filterPastEvents(data) : filterUpcomingEvents(data);
      setEvents(filtered);
    } catch (e) {
      const msg =
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : 'Dogodkov ni bilo mogoče naložiti. Preveri admin API na strežniku.';
      setError(msg);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    load();
  }, [load]);

  return { events, loading, error, refetch: load };
}
