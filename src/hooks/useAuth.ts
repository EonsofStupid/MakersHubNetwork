
import { useAuthStore } from '@/auth/store/auth.store';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useEffect, useState, useRef } from 'react';

/**
 * Hook for accessing authentication state
 */
export function useAuth() {
  const logger = useLogger('useAuth', LogCategory.AUTH);
  const [isInitializing, setIsInitializing] = useState(false);
  
  // Track if initialization has been attempted
  const initAttemptedRef = useRef(false);
  
  // Use a selector to extract only what we need from the store
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
    
    // Only initialize if needed and not already initializing
    if (status === 'idle' && !initialized && !isInitializing) {
      initAttemptedRef.current = true;
      setIsInitializing(true);
      
      // Use an IIFE to handle async initialization
      (async () => {
        try {
          await initialize();
        } catch (err) {
          logger.error('Failed to initialize auth', { details: err });
        } finally {
          setIsInitializing(false);
        }
      })();
    }
  }, [status, initialize, initialized, logger, isInitializing]);

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
    isLoading: isLoading || isInitializing,
    error,
    isAuthenticated,
    isAdmin: isAdmin(),
    isSuperAdmin,
    hasRole,
    logout: handleLogout,
    initialize
  };
}
