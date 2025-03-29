
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth/store";
import { useAdminStore } from "@/admin/store/admin.store";

export function useAdminAccess() {
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, roles, isAdmin } = useAuthStore();
  const { loadPermissions, hasPermission } = useAdminStore();
  
  useEffect(() => {
    async function checkAdminAccess() {
      setIsLoading(true);
      
      try {
        // First check if user has admin role from auth store
        if (isAdmin()) {
          setHasAdminAccess(true);
        } else if (roles && roles.includes('admin')) {
          setHasAdminAccess(true);
        } else {
          // Load admin permissions to check for specific access
          await loadPermissions();
          
          // Check if user has admin access permission
          const hasAccess = hasPermission('admin:access');
          setHasAdminAccess(hasAccess);
        }
      } catch (error) {
        console.error("Error checking admin access:", error);
        setHasAdminAccess(false);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (user) {
      checkAdminAccess();
    } else {
      setIsLoading(false);
      setHasAdminAccess(false);
    }
  }, [user, roles, isAdmin, loadPermissions, hasPermission]);
  
  return {
    hasAdminAccess,
    isLoading
  };
}
