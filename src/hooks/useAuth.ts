
import { useAuthStore } from '@/auth/store/auth.store';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

/**
 * Hook for accessing authentication state
 */
export function useAuth() {
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
    initialize
  } = useAuthStore();
  
  const logger = useLogger('useAuth', LogCategory.AUTH);
  
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
    initialize
  };
}
