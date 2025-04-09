
import { useCallback, useMemo } from 'react';
import { useAuthStore, selectUser, selectSession, selectRoles, selectStatus, selectIsAuthenticated, selectAuthError, selectIsLoading } from '@/auth/store/auth.store';
import { AuthBridge } from '@/auth/bridge';
import { UserRole } from '@/auth/types/auth.types';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

/**
 * Hook for accessing authentication state
 * Uses Zustand's selector pattern for efficient updates
 */
export function useAuth() {
  const logger = useLogger('useAuth', LogCategory.AUTH);
  
  // Use selectors for each piece of state to prevent unnecessary re-renders
  const user = useAuthStore(selectUser);
  const session = useAuthStore(selectSession);
  const roles = useAuthStore(selectRoles);
  const status = useAuthStore(selectStatus);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const error = useAuthStore(selectAuthError);
  const isLoading = useAuthStore(selectIsLoading);
  
  // Access methods directly from the store
  const initialize = useAuthStore((state) => state.initialize);
  const initialized = useAuthStore((state) => state.initialized);
  
  // Memoize role checking functions to prevent recreation on each render
  const hasRole = useCallback((role: UserRole | UserRole[]) => {
    return useAuthStore.getState().hasRole(role);
  }, []);
  
  // Use memoization for derived values
  const isAdmin = useMemo(() => {
    return roles.includes('admin') || roles.includes('super_admin');
  }, [roles]);
  
  const isSuperAdmin = useMemo(() => {
    return roles.includes('super_admin');
  }, [roles]);
  
  // Use AuthBridge for logout to ensure consistent behavior
  const handleLogout = useCallback(async () => {
    if (user) {
      logger.info('User logging out', { 
        details: { userId: user.id }
      });
    }
    
    // Use AuthBridge for logout
    return AuthBridge.logout();
  }, [user, logger]);

  // Return all required auth state and methods
  return {
    user,
    session,
    roles,
    status,
    isLoading,
    error,
    hasRole,
    isAdmin,
    isSuperAdmin,
    isAuthenticated,
    logout: handleLogout,
    initialize,
    initialized
  };
}
