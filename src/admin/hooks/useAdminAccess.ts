
import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

export function useAdminAccess() {
  const [hasAdminAccess, setHasAdminAccess] = useState<boolean>(false);
  const { user, roles, isLoading, status } = useAuthStore();
  const isAuthenticated = status === 'authenticated';
  const logger = useLogger("AdminAccess", LogCategory.AUTH);
  
  // Initialize admin data
  const initializeAdmin = useCallback(async () => {
    try {
      logger.info("Initializing admin access check...");
      
      if (!user) {
        setHasAdminAccess(false);
        return;
      }
      
      // Check if user has admin or super_admin role
      const adminRoles = roles.filter(role => 
        role === 'admin' || role === 'super_admin'
      );
      
      logger.info("User roles evaluated for admin access:", { details: { 
        roles,
        adminRolesFound: adminRoles.length > 0
      }});
      
      setHasAdminAccess(adminRoles.length > 0);
    } catch (error) {
      logger.error("Error initializing admin access:", { details: error });
      setHasAdminAccess(false);
    }
  }, [logger, user, roles]);

  // Check admin access on mount and when auth state changes
  useEffect(() => {
    initializeAdmin();
  }, [initializeAdmin, user, roles]);

  return {
    hasAdminAccess,
    isLoading,
    isAuthenticated,
    initializeAdmin
  };
}
