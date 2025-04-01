
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAdminAccess() {
  const [hasAdminAccess, setHasAdminAccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Initialize admin data
  const initializeAdmin = useCallback(async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      
      if (user) {
        // Get user roles
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);
          
        if (rolesError) {
          console.error("Error fetching user roles:", rolesError);
          setIsLoading(false);
          return;
        }
        
        // Check if user has admin or super_admin role
        const adminRoles = userRoles?.filter(role => 
          role.role === 'admin' || role.role === 'super_admin'
        ) || [];
        
        setHasAdminAccess(adminRoles.length > 0);
      }
    } catch (error) {
      console.error("Error initializing admin access:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
