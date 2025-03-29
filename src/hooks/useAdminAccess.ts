
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth/store";

/**
 * A simplified hook for checking admin access
 * Focuses on using auth store roles to determine admin status
 */
export function useAdminAccess() {
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, roles, isAdmin } = useAuthStore();
  
  useEffect(() => {
    console.log("useAdminAccess - Checking admin access");
    console.log("useAdminAccess - User:", user);
    console.log("useAdminAccess - Roles:", roles);
    
    // Simple check - use the isAdmin function from the auth store
    // This avoids any circular dependencies or race conditions
    if (user) {
      const adminAccess = isAdmin ? isAdmin() : false;
      console.log("useAdminAccess - Admin access:", adminAccess);
      setHasAdminAccess(adminAccess);
    } else {
      setHasAdminAccess(false);
    }
    
    setIsLoading(false);
  }, [user, roles, isAdmin]);
  
  return {
    hasAdminAccess,
    isLoading
  };
}
