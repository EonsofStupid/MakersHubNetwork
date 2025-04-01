
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useAuthStore } from '@/auth/store/auth.store';

export function useAdminAccess() {
  const [hasAdminAccess, setHasAdminAccess] = useState<boolean>(false);
  const { user, roles, isLoading: authLoading, status } = useAuthStore();
  const isAuthenticated = status === 'authenticated';
  const logger = useLogger("AdminAccess", LogCategory.AUTH);
  
  // Initialize admin data
  const initializeAdmin = useCallback(async () => {
    try {
      logger.info("Initializing admin access...");
      
      if (!user) {
        setHasAdminAccess(false);
        return;
      }
      
      // Check if user has admin or super_admin role
      const adminRoles = roles.filter(role => 
        role === 'admin' || role === 'super_admin'
      );
      
      logger.info("User roles retrieved:", { details: { 
        roles,
        adminRolesFound: adminRoles.length > 0
      }});
      
      setHasAdminAccess(adminRoles.length > 0);
    } catch (error) {
      logger.error("Error initializing admin access:", { details: error });
      setHasAdminAccess(false);
    }
  }, [logger, user, roles]);

  // Check admin access on mount
  useEffect(() => {
    initializeAdmin();
  }, [initializeAdmin]);

  return {
    hasAdminAccess,
    isLoading: authLoading,
    isAuthenticated,
    initializeAdmin
  };
}
