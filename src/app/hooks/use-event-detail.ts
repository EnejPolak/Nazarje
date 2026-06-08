import { useCallback, useEffect, useState } from 'react';
import { fetchEventById, fetchEventBySlug } from '../api/events';
import { ApiError } from '../api/client';
import type { EventData } from '../data/events';

function isLikelyInternalId(param: string): boolean {
  return param.startsWith('crm-') || /^[0-9a-f-]{36}$/i.test(param);
}

async function fetchEventByParam(param: string): Promise<EventData> {
  if (isLikelyInternalId(param)) {
    return fetchEventById(param);
  }

  try {
    return await fetchEventBySlug(param);
  } catch (e) {
    const tryId =
      e instanceof ApiError
        ? e.status === 404
        : e instanceof Error && /ni bil najden/i.test(e.message);

    if (tryId) {
      return fetchEventById(param);
    }
    throw e;
  }
}

export function useEventDetail(param: string | undefined) {
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(Boolean(param));
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!param) {
      setEvent(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEventByParam(param);
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
  }, [param]);

  useEffect(() => {
    load();
  }, [load]);

  return { event, loading, error, refetch: load };
}
