import { ApiError, apiFetch, getAdminToken, getApiBaseUrl } from './client';
import { mapApiEventToEventData, mapEventDataToApiPayload } from './mappers';
import type { ApiAdminUser, ApiEventListItem } from './types';
import type { EventData } from '../data/events';

const ACCEPTED_EVENT_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

export const EVENT_IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif';

export function isAcceptedEventImageType(type: string): boolean {
  return ACCEPTED_EVENT_IMAGE_TYPES.has(type);
}

type UploadImagePayload = {
  success: boolean;
  message?: string;
  url?: string;
  file_name?: string;
};

export async function uploadEventImage(file: File): Promise<string> {
  if (!isAcceptedEventImageType(file.type)) {
    throw new ApiError('Dovoljene so le slike JPEG, PNG, WebP ali GIF.', 0);
  }

  const token = getAdminToken();
  if (!token) {
    throw new ApiError('Ni prijavljen. Ponovno se prijavite.', 401);
  }

  const formData = new FormData();
  formData.append('image', file);

  const base = getApiBaseUrl();
  const res = await fetch(`${base}/admin/upload-image.php`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  let payload: UploadImagePayload;
  const text = await res.text();
  if (!text) {
    throw new ApiError('Prazen odgovor strežnika.', res.status);
  }
  try {
    payload = JSON.parse(text) as UploadImagePayload;
  } catch {
    throw new ApiError('Neveljaven JSON odgovor strežnika.', res.status, text);
  }

  if (!res.ok || !payload.success) {
    throw new ApiError(payload.message ?? 'Nalaganje slike ni uspelo.', res.status, payload);
  }

  if (!payload.url) {
    throw new ApiError('Manjkajoči URL naložene slike.', res.status, payload);
  }

  return payload.url;
}

const PDF_MIME = 'application/pdf';

export const EVENT_DOCUMENT_ACCEPT = PDF_MIME;

export function isAcceptedEventDocumentType(type: string): boolean {
  return type === PDF_MIME;
}

type UploadDocumentPayload = {
  success: boolean;
  message?: string;
  url?: string;
  file_name?: string;
  original_name?: string;
};

export type UploadDocumentResult = {
  url: string;
  file_name: string;
  original_name: string;
};

export async function uploadEventDocument(file: File): Promise<UploadDocumentResult> {
  if (!isAcceptedEventDocumentType(file.type)) {
    throw new ApiError('Dovoljene so le datoteke PDF.', 0);
  }

  const token = getAdminToken();
  if (!token) {
    throw new ApiError('Ni prijavljen. Ponovno se prijavite.', 401);
  }

  const formData = new FormData();
  formData.append('document', file);

  const base = getApiBaseUrl();
  const res = await fetch(`${base}/admin/upload-document.php`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  let payload: UploadDocumentPayload;
  const text = await res.text();
  if (!text) {
    throw new ApiError('Prazen odgovor strežnika.', res.status);
  }
  try {
    payload = JSON.parse(text) as UploadDocumentPayload;
  } catch {
    throw new ApiError('Neveljaven JSON odgovor strežnika.', res.status, text);
  }

  if (!res.ok || !payload.success) {
    throw new ApiError(payload.message ?? 'Nalaganje dokumenta ni uspelo.', res.status, payload);
  }

  if (!payload.url) {
    throw new ApiError('Manjkajoči URL naloženega dokumenta.', res.status, payload);
  }

  return {
    url: payload.url,
    file_name: payload.file_name ?? file.name,
    original_name: payload.original_name ?? file.name,
  };
}

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
