// Token storage, kept deliberately separate:
//
//   access token  - short lived (15 min), held in memory only. A page reload
//                   drops it, which is what makes XSS token theft harder.
//   refresh token - long lived (30 days), persisted so the session survives
//                   reloads. It is rotated by the server on every refresh.
//
// The access token is never written to storage and the refresh token is
// only ever sent to /api/auth/refresh and /api/auth/logout.

const REFRESH_KEY = 'ne_refresh_token';

let accessToken = null;

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token) {
  accessToken = token || null;
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function setRefreshToken(token) {
  if (token) localStorage.setItem(REFRESH_KEY, token);
  else localStorage.removeItem(REFRESH_KEY);
}

// Store a fresh pair returned by login / register / refresh / OAuth.
export function setSession({ token, refreshToken }) {
  setAccessToken(token);
  setRefreshToken(refreshToken);
}

export function clearSession() {
  accessToken = null;
  localStorage.removeItem(REFRESH_KEY);
}
