
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

export function useAdminAccess() {
  const [hasAdminAccess, setHasAdminAccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const logger = useLogger("AdminAccess", LogCategory.AUTH);
  
  // Initialize admin data
  const initializeAdmin = useCallback(async () => {
    try {
      logger.info("Initializing admin access...");
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        logger.error("Error fetching user:", { details: error });
        setIsAuthenticated(false);
        setHasAdminAccess(false);
        setIsLoading(false);
        return;
      }
      
      setIsAuthenticated(!!user);
      logger.info("User authenticated status:", { details: { isAuthenticated: !!user }});
      
      if (user) {
        // Get user roles
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);
          
        if (rolesError) {
          logger.error("Error fetching user roles:", { details: rolesError });
          setIsLoading(false);
          return;
        }
        
        // Check if user has admin or super_admin role
        const adminRoles = userRoles?.filter(role => 
          role.role === 'admin' || role.role === 'super_admin'
        ) || [];
        
        logger.info("User roles retrieved:", { details: { 
          roles: userRoles,
          adminRolesFound: adminRoles.length > 0
        }});
        
        setHasAdminAccess(adminRoles.length > 0);
      } else {
        setHasAdminAccess(false);
      }
    } catch (error) {
      logger.error("Error initializing admin access:", { details: error });
      setHasAdminAccess(false);
    } finally {
      setIsLoading(false);
    }
  }, [logger]);

  // Check admin access on mount
  useEffect(() => {
    initializeAdmin();
  }, [initializeAdmin]);

  return {
    hasAdminAccess,
    isLoading,
    isAuthenticated,
    initializeAdmin
  };
}
