import { useEffect, useState } from 'react';
import type { EventData } from './events';
import { eventsData } from './events';

const STORAGE_KEY = 'crm-dogodki';

type SerializedEvent = Omit<EventData, 'date' | 'dateEnd'> & {
  date: string;
  dateEnd?: string;
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((cb) => cb());
}

export function subscribeCrmEvents(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function serialize(e: EventData): SerializedEvent {
  return {
    ...e,
    date: e.date.toISOString(),
    dateEnd: e.dateEnd?.toISOString(),
  };
}

function deserialize(r: SerializedEvent): EventData {
  return {
    ...r,
    date: new Date(r.date),
    dateEnd: r.dateEnd ? new Date(r.dateEnd) : undefined,
  };
}

function readRaw(): SerializedEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SerializedEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRaw(list: SerializedEvent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  emit();
}

export function getCrmEvents(): EventData[] {
  return readRaw().map(deserialize);
}

export function getMergedEvents(): EventData[] {
  return [...eventsData, ...getCrmEvents()];
}

export function useMergedEvents(): EventData[] {
  const [events, setEvents] = useState(getMergedEvents);

  useEffect(() => {
    const sync = () => setEvents(getMergedEvents());
    const unsub = subscribeCrmEvents(sync);
    window.addEventListener('storage', sync);
    return () => {
      unsub();
      window.removeEventListener('storage', sync);
    };
  }, []);

  return events;
}

export function isCrmEventId(id: string): boolean {
  return id.startsWith('crm-');
}

export function upsertCrmEvent(event: EventData) {
  const list = readRaw();
  const idx = list.findIndex((e) => e.id === event.id);
  const s = serialize(event);
  if (idx >= 0) list[idx] = s;
  else list.push(s);
  writeRaw(list);
}

export function deleteCrmEvent(id: string) {
  if (!isCrmEventId(id)) return;
  writeRaw(readRaw().filter((e) => e.id !== id));
}

export function newCrmEventId(): string {
  return `crm-${typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now())}`;
}

export function useCrmEventsList(): EventData[] {
  const [list, setList] = useState(getCrmEvents);

  useEffect(() => {
    const sync = () => setList(getCrmEvents());
    const unsub = subscribeCrmEvents(sync);
    window.addEventListener('storage', sync);
    return () => {
      unsub();
      window.removeEventListener('storage', sync);
    };
  }, []);

  return list;
}
