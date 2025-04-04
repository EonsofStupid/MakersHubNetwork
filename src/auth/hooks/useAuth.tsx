
import { useCallback } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { AuthState, AuthStatus } from '@/auth/types/auth.types';

export function useAuth(): {
  user: AuthState['user'];
  session: AuthState['session'];
  roles: AuthState['roles'];
  status: AuthState['status'];
  error: AuthState['error'];
  isLoading: AuthState['isLoading'];
  isAuthenticated: AuthState['isAuthenticated'];
  initialized: AuthState['initialized'];
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
} {
  const {
    user,
    session,
    roles,
    status,
    error,
    isLoading,
    isAuthenticated,
    initialized,
    initialize,
    logout
  } = useAuthStore();

  // Authentication checks
  const isUserAuthenticated = status === AuthStatus.AUTHENTICATED;

  return {
    user,
    session,
    roles,
    status,
    error,
    isLoading,
    isAuthenticated: isUserAuthenticated,
    initialized,
    initialize,
    logout
  };
}
