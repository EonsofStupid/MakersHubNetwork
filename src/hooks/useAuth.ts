
import { useAuthStore } from '@/auth/store/auth.store';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useEffect, useRef } from 'react';
import { errorToObject } from '@/shared/utils/render';

/**
 * Hook for accessing authentication state with initialization guard
 */
export function useAuth() {
  const logger = useLogger('useAuth', LogCategory.AUTH);
  const initAttemptedRef = useRef<boolean>(false);
  
  // Extract only what we need from the store to prevent unnecessary re-renders
  // Use a selector function to stabilize the returned values
  const authState = useAuthStore(state => ({
    user: state.user,
    session: state.session,
    roles: state.roles,
    status: state.status,
    isLoading: state.isLoading,
    error: state.error,
    initialized: state.initialized,
    isAuthenticated: state.isAuthenticated
  }));
  
  // Get functions separately to avoid state updates causing loops
  const { hasRole, isAdmin, logout, initialize } = useAuthStore();
  
  // Auto-initialize auth if needed - with guard against infinite loops
  useEffect(() => {
    // Prevent multiple initialization attempts
    if (initAttemptedRef.current) {
      return;
    }
    
    // Only initialize if needed
    if (!authState.initialized && authState.status === 'idle') {
      logger.info('Auto-initializing auth from useAuth hook');
      initAttemptedRef.current = true;
      
      // Use setTimeout to break potential circular dependencies
      const timeoutId = setTimeout(() => {
        initialize().catch(err => {
          logger.error('Failed to initialize auth', { details: errorToObject(err) });
        });
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [authState.status, authState.initialized, initialize, logger]);
  
  // Derived state
  const isSuperAdmin = authState.roles.includes('super_admin');

  // Log wrapper for logout to capture info before state is cleared
  const handleLogout = async () => {
    if (authState.user) {
      logger.info('User logging out', { 
        details: { userId: authState.user.id }
      });
    }
    return logout();
  };

  return {
    ...authState,
    isAdmin: isAdmin(),
    isSuperAdmin,
    hasRole,
    logout: handleLogout,
    // Don't expose initialize directly as it should be handled automatically
  };
}
