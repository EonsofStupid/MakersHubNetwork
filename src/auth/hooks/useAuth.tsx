
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
  signOut: () => Promise<void>; // Alias for logout for backward compatibility
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

  // Create an alias for logout as signOut for backward compatibility
  const signOut = useCallback(() => {
    return logout();
  }, [logout]);

  return {
    user,
    session,
    roles,
    status,
    error,
    isLoading,
    isAuthenticated,
    initialized,
    initialize,
    logout,
    signOut
  };
}
