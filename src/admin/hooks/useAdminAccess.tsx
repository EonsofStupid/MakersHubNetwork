
import { useAuth } from '@/hooks/useAuth';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useMemo } from 'react';

/**
 * Hook for checking admin access permissions
 * Centralizes admin access logic and provides useful derived values
 */
export function useAdminAccess() {
  const { isAuthenticated, isAdmin, isSuperAdmin, roles } = useAuth();
  const logger = useLogger('useAdminAccess', LogCategory.ADMIN);
  
  // Calculate derived permissions based on roles
  const hasAdminAccess = useMemo(() => {
    const hasAccess = isAdmin || isSuperAdmin;
    
    if (hasAccess) {
      logger.debug('User has admin access', { 
        details: { 
          isAdmin, 
          isSuperAdmin,
          roles 
        } 
      });
    }
    
    return hasAccess;
  }, [isAdmin, isSuperAdmin, roles, logger]);
  
  // Determine debug access - only super_admin can access debugging tools
  const hasDebugAccess = useMemo(() => {
    return isSuperAdmin;
  }, [isSuperAdmin]);

  return {
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    hasAdminAccess,
    hasDebugAccess,
    roles
  };
}
