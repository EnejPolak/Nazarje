import { useCallback, useEffect, useState } from 'react';
import { fetchPublishedEvents } from '../api/events';
import { ApiError } from '../api/client';
import type { EventData } from '../data/events';

export type EventsLoadState = {
  events: EventData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function usePublishedEvents(): EventsLoadState {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPublishedEvents();
      setEvents(data);
    } catch (e) {
      const msg =
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : 'Napaka pri nalaganju dogodkov.';
      setError(msg);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { events, loading, error, refetch: load };
}
