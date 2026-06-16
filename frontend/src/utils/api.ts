const API_BASE_URL = typeof window !== 'undefined' 
  ? `${window.location.protocol}//${window.location.host}/api`
  : 'http://localhost:8080/api';

export interface UserSession {
  token: string;
  refreshToken: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export function getSession(): UserSession | null {
  if (typeof window === 'undefined') return null;
  const sessionStr = localStorage.getItem('eb_session');
  if (!sessionStr) return null;
  try {
    return JSON.parse(sessionStr);
  } catch (e) {
    return null;
  }
}

export function setSession(session: UserSession) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('eb_session', JSON.stringify(session));
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('eb_session');
}

export function getAuthToken(): string | null {
  const session = getSession();
  return session ? session.token : null;
}

export function getRefreshToken(): string | null {
  const session = getSession();
  return session ? session.refreshToken : null;
}

export function hasRole(role: string): boolean {
  const session = getSession();
  if (!session) return false;
  return session.roles.includes(role);
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

async function request(url: string, options: FetchOptions = {}): Promise<any> {
  const session = getSession();
  let headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (session && session.token) {
    (headers as any)['Authorization'] = `Bearer ${session.token}`;
  }

  let fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  if (options.params) {
    const searchParams = new URLSearchParams(options.params);
    fullUrl += `?${searchParams.toString()}`;
  }

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  if (response.status === 401 && session && session.refreshToken) {
    // Try to refresh token
    const refreshed = await tryRefreshToken(session);
    if (refreshed) {
      // Retry with new token
      const newSession = getSession();
      if (newSession) {
        (headers as any)['Authorization'] = `Bearer ${newSession.token}`;
        const retryResponse = await fetch(fullUrl, {
          ...options,
          headers,
        });
        if (retryResponse.ok) {
          if (retryResponse.status === 204) return null;
          return await retryResponse.json();
        }
        throw new Error(await getErrorMessage(retryResponse));
      }
    } else {
      clearSession();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Session expired');
    }
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  if (response.status === 204) return null;
  return await response.json();
}

async function tryRefreshToken(session: UserSession): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refreshtoken`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    });

    if (res.ok) {
      const data = await res.json();
      session.token = data.accessToken;
      session.refreshToken = data.refreshToken;
      setSession(session);
      return true;
    }
  } catch (e) {
    console.error('Refresh token failed', e);
  }
  return false;
}

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const body = await response.json();
    return body.message || 'An error occurred';
  } catch (e) {
    return 'An error occurred';
  }
}

export const api = {
  get: (url: string, options?: FetchOptions) => request(url, { ...options, method: 'GET' }),
  post: (url: string, body?: any, options?: FetchOptions) => 
    request(url, { ...options, method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: (url: string, body?: any, options?: FetchOptions) => 
    request(url, { ...options, method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  delete: (url: string, options?: FetchOptions) => request(url, { ...options, method: 'DELETE' }),
};
