type JwtPayload = {
  sub?: string;
  email?: string;
  role?: 'user' | 'admin';
  IdLoja?: string;
  iat: number;
  exp: number;
};

const LOCAL_STORAGE_KEY = 'auth.jwt';
const SESSION_STORAGE_KEY = 'auth.jwt.session';

function base64UrlEncode(input: string) {
  const base64 = btoa(unescape(encodeURIComponent(input)));
  return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64UrlDecode(input: string) {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  return decodeURIComponent(escape(atob(padded)));
}

export function createJwt(email: string, ttlSeconds = 60 * 60) {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const header = { alg: 'none', typ: 'JWT' };
  const payload: JwtPayload = {
    sub: email,
    email,
    iat: nowSeconds,
    exp: nowSeconds + ttlSeconds,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = '';
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function saveAuthToken(token: string, persist = true) {
  if (persist) {
    localStorage.setItem(LOCAL_STORAGE_KEY, token);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }
  sessionStorage.setItem(SESSION_STORAGE_KEY, token);
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}

export function getAuthToken() {
  return localStorage.getItem(LOCAL_STORAGE_KEY) ?? sessionStorage.getItem(SESSION_STORAGE_KEY);
}

export function clearAuthToken() {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    const json = base64UrlDecode(parts[1]!);
    const payload = JSON.parse(json) as Partial<JwtPayload>;
    if (typeof payload.iat !== 'number' || typeof payload.exp !== 'number') {
      return null;
    }
    return payload as JwtPayload;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  const token = getAuthToken();
  if (!token) return false;
  const payload = decodeJwtPayload(token);
  if (!payload) return false;
  const nowSeconds = Math.floor(Date.now() / 1000);
  return payload.exp > nowSeconds;
}

export function getCurrentUser() {
  const token = localStorage.getItem("authToken");
  if (!token) return null;
  try {
      const payload = token.split(".")[1];
      return JSON.parse(atob(payload)) as { role: "admin" | "user"; [key: string]: unknown };
  } catch {
      return null;
  }
}

export function getAuthenticatedRole(): 'user' | 'admin' | null {
  const token = getAuthToken();
  if (token) {
    const payload = decodeJwtPayload(token);
    if (payload?.role === 'user' || payload?.role === 'admin') {
      return payload.role;
    }
  }

  const storedRole = localStorage.getItem('userRole');
  if (storedRole === 'user' || storedRole === 'admin') {
    return storedRole;
  }

  return null;
}

