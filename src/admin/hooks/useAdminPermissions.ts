
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth/store";
import { useAdminStore } from "@/admin/store/admin.store";
import { AdminPermission } from "@/admin/types/admin.types";

/**
 * Custom hook for admin permission management
 * Combines authentication roles with admin-specific permissions
 */
export function useAdminPermissions() {
  const [isLoading, setIsLoading] = useState(true);
  const { user, roles, isAdmin } = useAuthStore();
  const { 
    loadPermissions, 
    hasPermission: adminStoreHasPermission,
    isLoadingPermissions 
  } = useAdminStore();
  
  useEffect(() => {
    // Load permissions if we have a user
    if (user) {
      loadPermissions();
    }
  }, [user, loadPermissions]);

  // Wait for permissions to load
  useEffect(() => {
    if (!isLoadingPermissions) {
      setIsLoading(false);
    }
  }, [isLoadingPermissions]);

  /**
   * Check if current user has a specific permission
   */
  const checkPermission = (permission: AdminPermission): boolean => {
    // Super admins have all permissions
    if (roles && roles.includes('super_admin')) {
      return true;
    }
    
    // Basic admin access check
    if (permission === 'admin:access') {
      return isAdmin ? isAdmin() : false;
    }
    
    // Use admin store for specific permissions
    return adminStoreHasPermission(permission);
  };

  return {
    hasAccess: isAdmin ? isAdmin() : false,
    isLoading,
    checkPermission
  };
}
