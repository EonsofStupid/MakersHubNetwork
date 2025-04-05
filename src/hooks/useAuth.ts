
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
  
  const {
    user,
    session,
    roles,
    status,
    isLoading,
    isAuthenticated,
    error,
    hasRole,
    isAdmin,
    logout,
    initialize,
    initialized
  } = useAuthStore(state => state);
  
  // Auto-initialize auth if needed
  useEffect(() => {
    if (status === 'idle' && !initialized && !isInitializing) {
      setIsInitializing(true);
      
      initialize().catch(err => {
        logger.error('Failed to initialize auth', { details: err });
      }).finally(() => {
        setIsInitializing(false);
      });
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
