
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
  const {
    user,
    session,
    roles,
    status,
    isLoading,
    error,
    hasRole,
    isAuthenticated,
    isAdmin,
    logout,
    initialize,
    initialized
  } = useAuthStore(state => ({
    user: state.user,
    session: state.session,
    roles: state.roles,
    status: state.status,
    isLoading: state.isLoading,
    error: state.error,
    hasRole: state.hasRole,
    isAuthenticated: state.isAuthenticated,
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
    if (!initialized && status === 'idle') {
      logger.info('Auto-initializing auth from useAuth hook');
      initAttemptedRef.current = true;
      
      setTimeout(() => {
        initialize().catch(err => {
          logger.error('Failed to initialize auth', { details: errorToObject(err) });
        });
      }, 50);
    }
  }, [status, initialized]); // We deliberately omit initialize and logger
  
  // Derived state
  const isSuperAdmin = roles.includes('super_admin');

  // Log wrapper for logout to capture info before state is cleared
  const handleLogout = async () => {
    if (user) {
      logger.info('User logging out', { 
        details: { userId: user.id }
      });
    }
    return logout();
  };

  return {
    user,
    session,
    roles,
    status,
    isLoading,
    error,
    isAuthenticated,
    isAdmin: isAdmin(),
    isSuperAdmin,
    hasRole,
    logout: handleLogout,
    initialize,
    initialized
  };
}
