
import { useAuthStore } from '@/auth/store/auth.store';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useEffect, useState } from 'react';

/**
 * Hook for accessing authentication state
 */
export function useAuth() {
  const logger = useLogger('useAuth', LogCategory.AUTH);
  const [isInitializing, setIsInitializing] = useState(false);
  
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
  
  // Auto-initialize auth if needed
  useEffect(() => {
    let isMounted = true;
    
    const initAuth = async () => {
      if (status === 'idle' && !initialized && !isInitializing) {
        setIsInitializing(true);
        
        try {
          await initialize();
        } catch (err) {
          logger.error('Failed to initialize auth', { details: err });
        } finally {
          if (isMounted) {
            setIsInitializing(false);
          }
        }
      }
    };
    
    initAuth();
    
    return () => {
      isMounted = false;
    };
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
