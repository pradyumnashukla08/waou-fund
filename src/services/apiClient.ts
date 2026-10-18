import { auth } from '../config/firebase';
import { CLOUD_CONFIG } from '../config/cloud';

const getBaseUrl = (): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CLOUD_BACKEND_URL) {
    return import.meta.env.VITE_CLOUD_BACKEND_URL;
  }
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    // If running frontend locally, first try local API server
    return 'http://localhost:8080/api';
  }
  return CLOUD_CONFIG.PRIMARY_API_URL;
};

export class ApiError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Format any API or network error into a clean, safe, human-actionable message.
 * Never exposes secrets, internal database schemas, or stack traces.
 */
export function formatUserFacingError(err: unknown): string {
  if (err instanceof ApiError) {
    switch (err.status) {
      case 401:
        return 'Authentication session expired or missing. Please sign in to continue.';
      case 403:
        return 'Access denied. You do not have permission to perform this operation.';
      case 429:
        return 'AI request limit reached. Please wait a moment before trying again.';
      case 500:
      case 502:
      case 503:
        return 'AI service is temporarily unavailable. Please retry in a few moments.';
      case 504:
        return 'AI request timed out. The model took too long to respond.';
      default:
        return err.message && !err.message.includes('object Object') 
          ? err.message 
          : 'An unexpected server error occurred. Please try again.';
    }
  }

  if (err instanceof Error) {
    if (err.name === 'TimeoutError' || err.message.includes('timeout') || err.message.includes('aborted')) {
      return 'Request timed out. Please check your network and try again.';
    }
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message.includes('Network request failed')) {
      return 'Unable to reach backend server. Please verify your connection.';
    }
    return err.message;
  }

  return 'An unexpected error occurred while communicating with the service.';
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getBaseUrl().replace(/\/$/, '');
  if (!baseUrl) {
    throw new ApiError('Standalone Firebase mode: local intelligence engine active', 503);
  }
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Bypass-Tunnel-Reminder': 'true',
    ...(options.headers as Record<string, string> || {}),
  };

  // Attach Firebase ID token if user is authenticated
  if (auth.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (tokenErr) {
      console.warn('[ApiClient] Failed to obtain Firebase ID token:', tokenErr);
    }
  }

  if (options.body && typeof options.body === 'string' && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // 12-second client-side timeout signal if not already provided
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);
  const signal = options.signal || controller.signal;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal,
    });
    clearTimeout(timeoutId);

    if (res.status === 401) {
      console.warn('[ApiClient] 401 Unauthorized received for:', url);
    }

    if (!res.ok) {
      let errorMessage = `API request failed with status ${res.status}`;
      let errorDetails: any = null;
      try {
        const errorJson = await res.json();
        errorMessage = errorJson.error || errorJson.message || errorMessage;
        errorDetails = errorJson.details || errorJson;
      } catch {
        const text = await res.text();
        if (text) errorMessage = text;
      }
      throw new ApiError(errorMessage, res.status, errorDetails);
    }

    const data = await res.json();
    return data as T;
  } catch (err: any) {
    clearTimeout(timeoutId);
    // If local 8080 fails with connection refused, attempt fallback to cloud URL if different
    if (baseUrl.includes('localhost:8080') && CLOUD_CONFIG.PRIMARY_API_URL !== baseUrl) {
      const fallbackUrl = `${CLOUD_CONFIG.PRIMARY_API_URL.replace(/\/$/, '')}${cleanEndpoint}`;
      try {
        const fallbackRes = await fetch(fallbackUrl, {
          ...options,
          headers,
          signal: AbortSignal.timeout(15000),
        });
        if (fallbackRes.ok) {
          return await fallbackRes.json() as T;
        }
      } catch {
        // Fallback also failed, throw original error
      }
    }
    throw err;
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),

  getBaseUrl,
  formatUserFacingError,
};
