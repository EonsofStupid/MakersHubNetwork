import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/auth/hooks/useAuth';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { canAccessAdmin } from '@/auth/rbac/enforce';
import { formatLogDetails } from '@/logging/utils/details-formatter';

/**
 * Hook to determine if the current user has admin access
 * This is the recommended hook for checking admin access throughout the application
 */
export function useAdminAccess() {
  const [hasAdminAccess, setHasAdminAccess] = useState<boolean>(false);
  const { user, roles, status, isLoading } = useAuth();
  const isAuthenticated = status === 'authenticated';
  const logger = useLogger("AdminAccess", LogCategory.AUTH);
  
  // Initialize admin access
  const initializeAdmin = useCallback(async () => {
    try {
      logger.info("Checking admin access", {
        details: { 
          status,
          roles,
          userId: user?.id
        }
      });
      
      if (!user || !isAuthenticated) {
        logger.info("No authenticated user found, setting hasAdminAccess to false");
        setHasAdminAccess(false);
        return;
      }
      
      // Use the RBAC utility for consistent access checks
      const hasAccess = canAccessAdmin(roles);
      
      logger.info("Admin access evaluated", { 
        details: { 
          roles,
          hasAccess 
        }
      });
      
      setHasAdminAccess(hasAccess);
    } catch (error) {
      logger.error("Error checking admin access", { details: error });
      setHasAdminAccess(false);
    }
  }, [logger, user, roles, status, isAuthenticated]);

  // Check admin access on mount and when auth state changes
  useEffect(() => {
    // Only run this when authenticated and not loading
    if (isAuthenticated && !isLoading) {
      initializeAdmin();
    } else if (!isAuthenticated && !isLoading) {
      // If not authenticated and not loading, reset admin access
      setHasAdminAccess(false);
    }
  }, [initializeAdmin, isAuthenticated, isLoading, user, roles]);

  return {
    hasAdminAccess,
    isLoading,
    isAuthenticated,
    initializeAdmin
  };
}
