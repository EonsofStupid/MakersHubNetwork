
import { useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

/**
 * Hook to check if user has admin access
 */
export function useAdminAccess() {
  const { user, status, roles, isLoading: authLoading, isAdmin, isSuperAdmin } = useAuth();
  const logger = useLogger("AdminAccess", LogCategory.ADMIN);
  
  const hasAdminAccess = isAdmin || isSuperAdmin;
  const isAuthenticated = status === 'authenticated' && !!user;
  
  // Log admin access attempts
  useEffect(() => {
    if (isAuthenticated) {
      logger.info("Admin access check", { 
        details: { 
          userId: user?.id,
          hasAdminAccess, 
          roles,
          isAdmin,
          isSuperAdmin 
        }
      });
    }
  }, [isAuthenticated, hasAdminAccess, user, roles, isAdmin, isSuperAdmin, logger]);
  
  // Initialize admin data
  const initializeAdmin = useCallback(() => {
    logger.info("Admin access initialized");
    // Additional initialization can be added if needed
  }, [logger]);

  return {
    isLoading: authLoading,
    hasAdminAccess,
    isAuthenticated,
    initializeAdmin,
    adminUser: user,
    isAdmin,
    isSuperAdmin
  };
}
