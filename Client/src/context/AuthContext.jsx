import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { renewSession } from '../lib/axios.js';
import { getRefreshToken } from '../lib/tokens.js';
import { authApi, usersApi } from '../api/index.js';
import { AuthContext, ME_KEY } from './authContext.js';

// The current user is a TanStack Query cache entry (key ['me']), not
// component state, so login / logout / OAuth all stay in sync. On load
// only a refresh token survives, so a fresh access token (and the user)
// is fetched silently. No refresh token means signed out.

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [restoring, setRestoring] = useState(Boolean(getRefreshToken()));
  const restored = useRef(false);

  useEffect(() => {
    if (restored.current || !getRefreshToken()) return;
    restored.current = true;
    renewSession()
      .then((data) => queryClient.setQueryData(ME_KEY, data.user))
      .catch(() => queryClient.removeQueries({ queryKey: ME_KEY }))
      .finally(() => setRestoring(false));
  }, [queryClient]);

  const meQuery = useQuery({
    queryKey: ME_KEY,
    queryFn: usersApi.meApi,
    enabled: !restoring && Boolean(getRefreshToken()),
    staleTime: Infinity,
    retry: false,
  });

  const user = meQuery.data ?? null;
  const loading = restoring || meQuery.isPending;

  async function login(credentials) {
    const u = await authApi.loginApi(credentials);
    queryClient.setQueryData(ME_KEY, u);
    return u;
  }

  async function register(fields) {
    const u = await authApi.registerApi(fields);
    queryClient.setQueryData(ME_KEY, u);
    return u;
  }

  async function logout() {
    await authApi.logoutApi();
    queryClient.removeQueries({ queryKey: ME_KEY });
  }

  // Re-read the signed-in user (used after an OAuth redirect, where the
  // tokens arrive in the URL after the provider already mounted).
  async function syncUser() {
    const u = await usersApi.meApi();
    queryClient.setQueryData(ME_KEY, u);
    return u;
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, syncUser }}>
      {children}
    </AuthContext.Provider>
  );
}
