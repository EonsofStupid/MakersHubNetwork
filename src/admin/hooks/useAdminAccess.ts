
import { useAuth } from '@/hooks/useAuth';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

/**
 * Hook for checking admin access
 */
export function useAdminAccess() {
  const { isAdmin, isSuperAdmin, isAuthenticated, isLoading } = useAuth();
  const logger = useLogger('useAdminAccess', LogCategory.ADMIN);
  
  const hasAdminAccess = isAdmin || isSuperAdmin;
  
  logger.debug('Admin access check', { 
    details: { 
      hasAdminAccess,
      isAdmin,
      isSuperAdmin,
      isAuthenticated
    }
  });
  
  return {
    hasAdminAccess,
    isLoading,
    isAuthenticated,
    isAdmin,
    isSuperAdmin
  };
}
