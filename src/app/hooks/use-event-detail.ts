import { useCallback, useEffect, useState } from 'react';
import { fetchEventById } from '../api/events';
import { ApiError } from '../api/client';
import type { EventData } from '../data/events';

export function useEventDetail(id: string | undefined) {
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) {
      setEvent(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEventById(id);
      setEvent(data);
    } catch (e) {
      const msg =
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : 'Napaka pri nalaganju dogodka.';
      setError(msg);
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return { event, loading, error, refetch: load };
}
