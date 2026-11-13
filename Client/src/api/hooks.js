import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi, usersApi } from './index.js';
import { ME_KEY } from '../context/authContext.js';

// Server-state hooks for everything the UI renders. Mutations invalidate
// (or update) the cached user so the UI never shows stale profile data.

// Current user, cached under ME_KEY and shared with the auth context.
export function useMe() {
  return useQuery({
    queryKey: ME_KEY,
    queryFn: usersApi.meApi,
    staleTime: Infinity,
    retry: false,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersApi.updateProfileApi,
    onSuccess: (user) => queryClient.setQueryData(ME_KEY, user),
  });
}

export function useForgotPassword() {
  return useMutation({ mutationFn: authApi.forgotPasswordApi });
}

export function useResetPassword() {
  return useMutation({ mutationFn: authApi.resetPasswordApi });
}
