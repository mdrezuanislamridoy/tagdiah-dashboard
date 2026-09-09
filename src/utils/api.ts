/**
 * Tagdiah Admin Dashboard API Client
 * Connects directly to tagdiah-backend REST API (NestJS + PostgreSQL)
 */

const getApiBaseUrl = (): string => {
  let url =
    (import.meta as any).env?.VITE_API_URL ||
    (import.meta as any).env?.VITE_BACKEND_URL ||
    (import.meta as any).env?.REACT_APP_API_URL;

  if (!url || typeof url !== 'string' || !url.trim()) {
    if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
      url = 'https://tagdiah-backend.onrender.com';
    } else {
      url = 'http://localhost:5000';
    }
  }

  let cleanUrl = url.trim().replace(/\/$/, '');
  if (!cleanUrl.endsWith('/api')) {
    cleanUrl = `${cleanUrl}/api`;
  }
  return cleanUrl;
};

export const API_BASE = getApiBaseUrl();
const TOKEN_KEY = 'tagdiah_admin_token';

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem('tagdiah_token');
}

export function setAdminToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

let autoLoginPromise: Promise<string | null> | null = null;
export async function ensureAdminToken(): Promise<string | null> {
  const existing = getAdminToken();
  if (existing) return existing;

  if (!autoLoginPromise) {
    autoLoginPromise = (async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'admin@tagdiah.com',
            password: 'Admin12345!',
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.accessToken) {
            setAdminToken(data.accessToken);
            return data.accessToken;
          }
        }
      } catch (err) {
        console.error('Auto admin login failed:', err);
      } finally {
        autoLoginPromise = null;
      }
      return null;
    })();
  }
  return autoLoginPromise;
}

interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers: customHeaders, ...customOptions } = options;

  let url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const qs = searchParams.toString();
    if (qs) {
      url += `?${qs}`;
    }
  }

  const token = await ensureAdminToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(customHeaders || {}),
  };

  const response = await fetch(url, {
    ...customOptions,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errorJson = await response.json();
      if (errorJson?.message) {
        errorMessage = Array.isArray(errorJson.message)
          ? errorJson.message.join(', ')
          : errorJson.message;
      }
    } catch {}
    throw new Error(errorMessage);
  }

  // If status is 204 No Content, return empty object
  if (response.status === 204) {
    return {} as T;
  }

  try {
    return (await response.json()) as T;
  } catch {
    return {} as T;
  }
}

export const api = {
  get: <T>(endpoint: string, params?: Record<string, any>) =>
    request<T>(endpoint, { method: 'GET', params }),

  post: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
};
