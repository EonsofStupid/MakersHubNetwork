
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth/store';
import { UserRole } from '@/auth/types/auth.types';
import { errorToObject } from '@/shared/utils/render';

export interface AuthState {
  user: {
    id: string;
    email: string;
    roles: UserRole[];
    profile?: Record<string, unknown>;
  } | null;
  session: any | null;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';
  isLoading: boolean;
  error: string | null;
  hasRole: (role: UserRole) => boolean;
  isAuthenticated: boolean;
  initialized: boolean;
}

export function useAuth(): AuthState {
  const {
    user,
    session,
    status,
    roles,
    isLoading,
    error,
    initialized,
    hasRole,
    initialize,
  } = useAuthStore();

  useEffect(() => {
    // Initialize auth state if not already initialized
    if (!initialized) {
      initialize().catch(err => {
        console.error('Failed to initialize auth:', errorToObject(err));
      });
    }
  }, [initialized, initialize]);

  // Make sure we return a function with the correct signature for hasRole
  const hasRoleWrapper = (role: UserRole): boolean => {
    return hasRole(role);
  };

  return {
    user: user ? {
      id: user.id,
      email: user.email as string,
      roles,
      profile: user.user_metadata?.profile || {},
    } : null,
    session,
    status,
    isLoading,
    error,
    hasRole: hasRoleWrapper,
    isAuthenticated: status === 'authenticated' && !!user,
    initialized,
  };
}
