import { ApiError, apiFetch, getApiBaseUrl } from './client';
import { mapApiEventToEventData, mapEventDataToApiPayload } from './mappers';
import type { ApiAdminUser, ApiEventListItem } from './types';
import type { EventData } from '../data/events';

type AdminLoginPayload = {
  success: boolean;
  message?: string;
  token?: string;
  user?: ApiAdminUser;
};

export type AdminLoginResult = {
  token: string;
  user: ApiAdminUser;
};

export async function adminLogin(email: string, password: string): Promise<AdminLoginResult> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/admin-login.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  let payload: AdminLoginPayload;
  const text = await res.text();
  if (!text) {
    throw new ApiError('Prazen odgovor strežnika.', res.status);
  }
  try {
    payload = JSON.parse(text) as AdminLoginPayload;
  } catch {
    throw new ApiError('Neveljaven JSON odgovor strežnika.', res.status, text);
  }

  if (!payload.success) {
    throw new ApiError(payload.message ?? 'Prijava ni uspela.', res.status, payload);
  }

  if (!payload.token || !payload.user) {
    throw new ApiError('Manjkajoči token ali podatki uporabnika.', res.status, payload);
  }

  return { token: payload.token, user: payload.user };
}

export async function adminFetchEvents(published?: boolean): Promise<EventData[]> {
  const q =
    published === undefined ? '' : `?published=${published ? 1 : 0}`;
  const rows = await apiFetch<ApiEventListItem[]>(`/admin/events.php${q}`, {
    adminAuth: true,
  });
  return rows.map(mapApiEventToEventData);
}

export async function adminFetchEvent(id: string): Promise<EventData> {
  const row = await apiFetch<ApiEventListItem>(
    `/admin/event.php?id=${encodeURIComponent(id)}`,
    { adminAuth: true }
  );
  return mapApiEventToEventData(row);
}

export async function adminCreateEvent(event: EventData): Promise<EventData> {
  const row = await apiFetch<ApiEventListItem>('/admin/event.php', {
    method: 'POST',
    adminAuth: true,
    json: mapEventDataToApiPayload(event),
  });
  return mapApiEventToEventData(row);
}

export async function adminUpdateEvent(event: EventData): Promise<EventData> {
  const row = await apiFetch<ApiEventListItem>('/admin/event.php', {
    method: 'PUT',
    adminAuth: true,
    json: mapEventDataToApiPayload(event),
  });
  return mapApiEventToEventData(row);
}

export async function adminDeleteEvent(id: string): Promise<void> {
  await apiFetch<unknown>(`/admin/event.php?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    adminAuth: true,
  });
}
