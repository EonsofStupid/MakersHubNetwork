
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAdminAccess() {
  const [hasAdminAccess, setHasAdminAccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Initialize admin data
  const initializeAdmin = useCallback(async () => {
    try {
      console.log("Initializing admin access...");
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error("Error fetching user:", error);
        setIsAuthenticated(false);
        setHasAdminAccess(false);
        setIsLoading(false);
        return;
      }
      
      setIsAuthenticated(!!user);
      console.log("User authenticated:", !!user);
      
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
        
        console.log("User roles:", userRoles);
        console.log("Admin roles found:", adminRoles.length > 0);
        
        setHasAdminAccess(adminRoles.length > 0);
      } else {
        setHasAdminAccess(false);
      }
    } catch (error) {
      console.error("Error initializing admin access:", error);
      setHasAdminAccess(false);
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
