import axios from 'axios';
import { clearSession, getAccessToken, getRefreshToken, setSession } from './tokens.js';

// Backend origin. Requests go straight to it in every environment, so
// set VITE_API_URL in .env:
//   development: http://localhost:3000
//   production:  https://api.noobengineer.in
export const API_BASE = (
  import.meta.env.VITE_API_URL || 'http://localhost:3000'
).replace(/\/$/, '');

export function apiUrl(path) {
  return `${API_BASE}${path}`;
}

// Calls every axios instance in the app makes:
//   - attaches the short-lived access token (memory only)
//   - on a 401, renews the session once with the stored refresh token and
//     replays the original request (single-flight, so a rotated refresh
//     token is never used twice and queued requests share one renewal)
//   - normalises errors to an Error with .message and .status
export const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Single-flight refresh shared by the interceptor and by silent restore.
let renewal = null;

export function renewSession() {
  if (renewal) return renewal;

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return Promise.reject(new Error('Not signed in'));
  }

  renewal = (async () => {
    try {
      const res = await axios.post(apiUrl('/api/auth/refresh'), { refreshToken }); // /api/auth is the JSON API mount
      setSession(res.data);
      return res.data;
    } catch (err) {
      clearSession();
      throw err;
    } finally {
      renewal = null;
    }
  })();

  return renewal;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    const status = error.response?.status;

    const canRetry =
      status === 401 &&
      config &&
      !config._retried &&
      !config.url?.includes('/auth/') &&
      getRefreshToken();

    if (!canRetry) {
      const err = new Error(error.response?.data?.message || 'Something went wrong.');
      err.status = status;
      err.data = error.response?.data;
      throw err;
    }

    config._retried = true;
    await renewSession();
    return api(config);
  },
);
