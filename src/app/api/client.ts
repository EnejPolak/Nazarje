import { API_BASE_URL, apiUrl, getApiBaseUrl } from '@/lib/api';
import type { ApiResponse } from './types';

export { API_BASE_URL, apiUrl, getApiBaseUrl };

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function useMockData(): boolean {
  return import.meta.env.VITE_USE_MOCK === 'true';
}

const ADMIN_TOKEN_KEY = 'admin_token';
const ADMIN_USER_KEY = 'admin_user';

export function getAdminToken(): string | null {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function clearAdminSession(): void {
  try {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
  } catch {
    /* ignore */
  }
}

export function handleAdminUnauthorized(): void {
  clearAdminSession();
  if (typeof window !== 'undefined' && window.location.pathname !== '/admin') {
    window.location.href = '/admin';
  }
}

type ApiFetchOptions = RequestInit & {
  json?: unknown;
  /** Pošlje Authorization: Bearer iz localStorage (admin CRUD). */
  adminAuth?: boolean;
};

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { json, adminAuth, headers: customHeaders, ...init } = options;
  const url = apiUrl(path);

  const headers = new Headers(customHeaders);
  if (json !== undefined) {
    headers.set('Content-Type', 'application/json');
  }
  if (adminAuth) {
    const token = getAdminToken();
    if (!token) {
      throw new ApiError('Ni prijavljen. Ponovno se prijavite.', 401);
    }
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(url, {
    ...init,
    headers,
    credentials: init.credentials ?? 'same-origin',
    body: json !== undefined ? JSON.stringify(json) : init.body,
  });

  let payload: ApiResponse<T> | null = null;
  const text = await res.text();
  if (text) {
    try {
      payload = JSON.parse(text) as ApiResponse<T>;
    } catch {
      throw new ApiError('Neveljaven JSON odgovor strežnika.', res.status, text);
    }
  }

  if (!res.ok) {
    let msg = payload?.error ?? payload?.message ?? `HTTP ${res.status}`;
    if (res.status === 405) {
      msg =
        'Strežnik ne dovoljuje te metode (405). Preveri, ali endpoint podpira zahtevano metodo (npr. POST za ustvarjanje dogodka na /admin/event.php).';
    } else if (res.status === 404) {
      msg = payload?.error ?? payload?.message ?? 'Endpoint ni najden (404).';
    } else if (res.status === 401) {
      msg = payload?.error ?? payload?.message ?? 'Ni prijavljen ali je seja potekla. Ponovno se prijavite.';
      if (adminAuth) {
        handleAdminUnauthorized();
      }
    }
    throw new ApiError(msg, res.status, payload);
  }

  if (payload && payload.success === false) {
    throw new ApiError(payload.error ?? payload.message ?? 'API napaka', res.status, payload);
  }

  if (payload && 'data' in payload && payload.data !== undefined) {
    return payload.data as T;
  }

  if (payload?.success === true) {
    return undefined as T;
  }

  return payload as T;
}
