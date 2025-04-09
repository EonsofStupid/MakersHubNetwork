
import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { AuthBridge } from '@/auth/bridge';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { errorToObject } from '@/shared/utils/render';

/**
 * Hook for accessing authentication state
 * Uses ref to track initialization to prevent infinite loops
 */
export function useAuth() {
  const logger = useLogger('useAuth', LogCategory.AUTH);
  const initAttemptedRef = useRef<boolean>(false);
  
  // Extract only what we need from the store to prevent unnecessary re-renders
  // Use selector function pattern for better performance
  const {
    user,
    session,
    roles,
    status,
    isLoading,
    error,
    hasRole,
    isAdmin,
    logout,
    initialize,
    initialized,
  } = useAuthStore(state => ({
    user: state.user,
    session: state.session,
    roles: state.roles,
    status: state.status,
    isLoading: state.isLoading,
    error: state.error,
    hasRole: state.hasRole,
    isAdmin: state.isAdmin,
    logout: state.logout,
    initialize: state.initialize,
    initialized: state.initialized,
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
      
      // Use setTimeout to break potential circular dependencies
      const timeoutId = setTimeout(() => {
        initialize().catch(err => {
          logger.error('Failed to initialize auth', { details: errorToObject(err) });
        });
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [status, initialized]); // We deliberately omit initialize and logger
  
  // Derived state
  const isSuperAdmin = roles.includes('super_admin');
  const isAuthenticated = status === 'authenticated';

  // Log wrapper for logout to capture info before state is cleared
  const handleLogout = async () => {
    if (user) {
      logger.info('User logging out', { 
        details: { userId: user.id }
      });
    }
    
    // Use AuthBridge for logout
    return AuthBridge.logout();
  };

  return {
    user,
    session,
    roles,
    status,
    isLoading,
    error,
    hasRole,
    isAdmin: isAdmin(),
    isSuperAdmin,
    isAuthenticated,
    logout: handleLogout,
    initialized
  };
}
