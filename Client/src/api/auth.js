import { api, apiUrl } from '../lib/axios.js';
import { clearSession, getRefreshToken, setSession } from '../lib/tokens.js';

// Every call here talks to /api/auth and stores the token pair the backend
// returns (access token in memory, refresh token persisted).

export async function loginApi({ email, password }) {
  const { data } = await api.post('/api/auth/login', { email, password });
  setSession(data);
  return data.user;
}

export async function registerApi({ fullname, email, password }) {
  const { data } = await api.post('/api/auth/register', { fullname, email, password });
  setSession(data);
  return data.user;
}

export async function logoutApi() {
  try {
    await api.post('/api/auth/logout', { refreshToken: getRefreshToken() });
  } catch {
    // Best effort: local sign-out happens regardless.
  } finally {
    clearSession();
  }
}

export async function forgotPasswordApi({ email }) {
  const { data } = await api.post('/api/auth/forgot-password', { email });
  return data;
}

export async function resetPasswordApi({ token, password }) {
  const { data } = await api.post('/api/auth/reset-password', { token, password });
  return data;
}

// OAuth start endpoints live at /auth/* (not /api/auth/*). These links are
// plain navigations: the browser goes to the API, which redirects to the
// provider and back to /auth/callback here.
export const googleOAuthUrl = apiUrl('/auth/google');
export const githubOAuthUrl = apiUrl('/auth/github');
