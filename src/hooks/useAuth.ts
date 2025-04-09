
import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { AuthBridge } from '@/auth/bridge';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

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
        useAuthStore.getState().initialize().catch(err => {
          logger.error('Failed to initialize auth', { 
            details: {
              message: err instanceof Error ? err.message : String(err)
            }
          });
        });
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [status, initialized]); // We deliberately omit initialize and logger
  
  // Derived state
  const isSuperAdmin = roles.includes('super_admin');
  const isAuthenticated = status === 'authenticated';

  // Use AuthBridge for logout to ensure consistent behavior
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
