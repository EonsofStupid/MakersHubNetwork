
import { useAuthStore } from '@/auth/store/auth.store';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

/**
 * Primary hook for accessing authentication state
 * This should be the single source of truth for auth state throughout the application
 */
export function useAuthState() {
  const {
    user,
    session,
    roles,
    status,
    isLoading,
    error,
    hasRole,
    isAdmin,
    isAuthenticated,
    initialized
  } = useAuthStore();
  
  const logger = useLogger('useAuthState', LogCategory.AUTH);
  
  logger.debug('Auth state accessed', { 
    details: { 
      authenticated: isAuthenticated,
      status, 
      rolesCount: roles.length 
    } 
  });

  return {
    user,
    session,
    roles,
    status,
    isLoading,
    error,
    isAuthenticated,
    initialized,
    hasRole,
    isAdmin: isAdmin(),
  };
}
