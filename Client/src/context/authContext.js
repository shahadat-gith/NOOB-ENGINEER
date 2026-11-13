import { createContext, useContext } from 'react';

// Kept in its own module so AuthContext.jsx only exports a component
// (React Fast Refresh requirement).
export const AuthContext = createContext(null);

// Shared TanStack Query key for the signed-in user.
export const ME_KEY = ['me'];

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
