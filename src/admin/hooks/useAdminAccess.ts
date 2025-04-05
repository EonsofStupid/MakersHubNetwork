
import { useCallback, useEffect, useState, useRef } from 'react';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { errorToObject } from '@/shared/utils/render';

/**
 * Hook to check if the current user has admin access
 * This version uses the centralized auth state and avoids circular dependencies
 */
export function useAdminAccess() {
  const [hasAdminAccess, setHasAdminAccess] = useState<boolean>(false);
  const { user, roles, isLoading, status, initialized } = useAuthState();
  const isAuthenticated = status === 'authenticated';
  const logger = useLogger("AdminAccess", LogCategory.AUTH);
  const initAttemptedRef = useRef<boolean>(false);
  
  // Initialize admin data
  const initializeAdmin = useCallback(async () => {
    try {
      if (initAttemptedRef.current) {
        return;
      }
      
      initAttemptedRef.current = true;
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
      logger.error("Error initializing admin access:", { details: errorToObject(error) });
      setHasAdminAccess(false);
    }
  }, [logger, user, roles]);

  // Check admin access on mount and when auth state changes
  useEffect(() => {
    // Reset initialization flag when dependencies change
    initAttemptedRef.current = false;
    
    // Only initialize if auth is initialized
    if (initialized && user) {
      initializeAdmin();
    } else if (initialized && !user) {
      // If auth is initialized but no user, set admin access to false
      setHasAdminAccess(false);
    }
  }, [initializeAdmin, initialized, user, roles]);

  return {
    hasAdminAccess,
    isLoading,
    isAuthenticated,
    initializeAdmin
  };
}
