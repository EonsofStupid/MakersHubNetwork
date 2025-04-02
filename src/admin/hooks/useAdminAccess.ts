
import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

export function useAdminAccess() {
  const [hasAdminAccess, setHasAdminAccess] = useState<boolean>(false);
  const auth = useAuthStore();
  const isAuthenticated = auth.status === 'authenticated';
  const isLoading = auth.isLoading || auth.status === 'loading' || auth.status === 'idle';
  const logger = useLogger("AdminAccess", LogCategory.AUTH);
  
  // Initialize admin data
  const initializeAdmin = useCallback(async () => {
    try {
      logger.info("Initializing admin access check...", {
        details: { 
          status: auth.status,
          roles: auth.roles,
          userId: auth.user?.id
        }
      });
      
      if (!auth.user) {
        logger.info("No user found, setting hasAdminAccess to false");
        setHasAdminAccess(false);
        return;
      }
      
      // Check if user has admin or super_admin role
      const adminRoles = auth.roles.filter(role => 
        role === 'admin' || role === 'super_admin'
      );
      
      logger.info("User roles evaluated for admin access:", { details: { 
        roles: auth.roles,
        adminRolesFound: adminRoles.length > 0
      }});
      
      setHasAdminAccess(adminRoles.length > 0);
    } catch (error) {
      logger.error("Error initializing admin access:", { details: error });
      setHasAdminAccess(false);
    }
  }, [logger, auth.user, auth.roles, auth.status]);

  // Check admin access on mount and when auth state changes
  useEffect(() => {
    // Only run this when authenticated and not loading
    if (isAuthenticated && !isLoading) {
      initializeAdmin();
    } else if (!isAuthenticated && !isLoading) {
      // If not authenticated and not loading, reset admin access
      setHasAdminAccess(false);
    }
  }, [initializeAdmin, isAuthenticated, isLoading, auth.user, auth.roles]);

  return {
    hasAdminAccess,
    isLoading,
    isAuthenticated,
    initializeAdmin
  };
}
