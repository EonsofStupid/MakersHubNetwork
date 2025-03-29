
import { useMemo } from "react";
import { useAuthStore } from "@/stores/auth/store";
import { useAdminStore } from "@/admin/store/admin.store";
import { AdminPermission } from "@/admin/types/admin.types";

/**
 * Central hook for checking admin access and permissions
 * This is the source of truth for all admin access checks
 */
export function useAdminAccess() {
  const { roles, user, status } = useAuthStore();
  const { loadPermissions, hasPermission } = useAdminStore();
  
  // Memoized admin access check
  const hasAdminAccess = useMemo(() => {
    return roles?.includes("admin") || roles?.includes("super_admin");
  }, [roles]);
  
  // Memoized super admin check
  const isSuperAdmin = useMemo(() => {
    return roles?.includes("super_admin");
  }, [roles]);
  
  /**
   * Check for a specific admin permission
   * @param permission The admin permission to check
   */
  const checkPermission = (permission: AdminPermission): boolean => {
    // Super admins have all permissions
    if (isSuperAdmin) {
      return true;
    }
    
    // Basic admin access check
    if (permission === 'admin:access') {
      return hasAdminAccess;
    }
    
    // Delegate to admin store for specific permissions
    return hasPermission(permission);
  };
  
  /**
   * Initialize admin permissions based on auth roles
   */
  const initializeAdminAccess = async () => {
    if (user?.id && hasAdminAccess) {
      await loadPermissions();
    }
  };
  
  return {
    hasAdminAccess,
    isSuperAdmin,
    checkPermission,
    initializeAdminAccess,
    isAuthenticated: status === "authenticated" && !!user,
    isLoading: status === "loading"
  };
}
