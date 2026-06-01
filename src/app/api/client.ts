import type { ApiResponse } from './types';

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

export function getApiBaseUrl(): string {
  const url = import.meta.env.VITE_API_URL;
  if (!url) {
    throw new ApiError(
      'VITE_API_URL ni nastavljen. Dodaj ga v .env (glej .env.example).',
      0
    );
  }
  return url.replace(/\/$/, '');
}

export function useMockData(): boolean {
  return import.meta.env.VITE_USE_MOCK === 'true';
}

const ADMIN_TOKEN_KEY = 'admin_token';

export function getAdminToken(): string | null {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
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
  const base = getApiBaseUrl();
  const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? path : `/${path}`}`;

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
    const msg =
      payload?.error ??
      payload?.message ??
      `HTTP ${res.status}`;
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
