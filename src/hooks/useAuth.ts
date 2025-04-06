
import { useAuthStore } from '@/auth/store/auth.store';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useEffect, useRef } from 'react';

/**
 * Hook for accessing authentication state
 * Uses ref to track initialization to prevent infinite loops
 */
export function useAuth() {
  const logger = useLogger('useAuth', LogCategory.AUTH);
  const initAttemptedRef = useRef<boolean>(false);
  
  // Extract only what we need from the store to prevent unnecessary re-renders
  // Use selector function pattern for better performance
  const authState = useAuthStore(state => ({
    user: state.user,
    session: state.session,
    roles: state.roles,
    status: state.status,
    isLoading: state.isLoading,
    error: state.error,
    login: state.login,
    logout: state.logout,
    register: state.register,
    resetPassword: state.resetPassword,
    hasRole: state.hasRole,
    isAdmin: state.isAdmin,
    initialize: state.initialize,
    initialized: state.initialized,
    isAuthenticated: state.isAuthenticated
  }));
  
  // Auto-initialize auth if needed - with guard against infinite loops
  useEffect(() => {
    // Prevent multiple initialization attempts
    if (initAttemptedRef.current) {
      return;
    }
    
    // Only initialize if needed
    if (!authState.initialized && authState.status === AuthStatus.IDLE) {
      logger.info('Auto-initializing auth from useAuth hook');
      initAttemptedRef.current = true;
      
      // Use setTimeout to break potential circular dependencies
      const timeoutId = setTimeout(() => {
        if (authState.initialize) {
          authState.initialize().catch(err => {
            logger.error('Failed to initialize auth', { 
              details: err instanceof Error ? { message: err.message } : { error: String(err) }
            });
          });
        }
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [authState.status, authState.initialized]); // We deliberately omit initialize and logger
  
  // Derive default values if methods are missing
  const hasRole = authState.hasRole || ((role) => authState.roles.includes(role));
  const isAdmin = authState.isAdmin || (() => authState.roles.includes('admin') || authState.roles.includes('super_admin'));

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
    hasRole,
    isAdmin: isAdmin(),
    logout: handleLogout
  };
}

// Export from store for TypeScript support
export { AuthStatus } from '@/auth/store/auth.store';
