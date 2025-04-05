
import { useAuthStore } from '@/auth/store/auth.store';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useEffect, useRef } from 'react';
import { errorToObject } from '@/shared/utils/render';

/**
 * Hook for accessing authentication state
 * Handles initialization of auth when needed
 */
export function useAuth() {
  const logger = useLogger('useAuth', LogCategory.AUTH);
  const initAttemptedRef = useRef<boolean>(false);
  
  // Extract only what we need from the store to prevent unnecessary re-renders
  const authState = useAuthStore(state => ({
    user: state.user,
    session: state.session,
    roles: state.roles,
    status: state.status,
    isLoading: state.isLoading,
    error: state.error,
    hasRole: state.hasRole,
    isAuthenticated: state.status === 'authenticated',
    isAdmin: state.isAdmin,
    logout: state.logout,
    initialize: state.initialize,
    initialized: state.initialized
  }));
  
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
      
      // Use a timeout to break potential circular dependencies
      setTimeout(() => {
        authState.initialize().catch(err => {
          logger.error('Failed to initialize auth', { details: errorToObject(err) });
        });
      }, 50);
    }
  }, [authState.status, authState.initialized]); // We deliberately omit initialize and logger
  
  // Derived state
  const isSuperAdmin = authState.roles.includes('super_admin');

  // Log wrapper for logout to capture info before state is cleared
  const handleLogout = async () => {
    if (authState.user) {
      logger.info('User logging out', { 
        details: { userId: authState.user.id }
      });
    }
    return authState.logout();
  };

  return {
    ...authState,
    isAdmin: authState.isAdmin(),
    isSuperAdmin,
    logout: handleLogout
  };
}
