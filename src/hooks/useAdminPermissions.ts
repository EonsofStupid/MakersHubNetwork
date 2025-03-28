import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth/store";
import { useAdminStore } from "@/admin/store/admin.store";
import { AdminPermission } from "@/admin/types/admin.types";

/**
 * A unified hook for admin permission management
 * Combines role-based checks with admin store permissions
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
    // If auth store has loaded and we have a user
    if (user && roles) {
      // Load permissions into admin store if needed
      loadPermissions();
    }
  }, [user, roles, loadPermissions]);

  // Wait for both auth and admin permissions to load
  useEffect(() => {
    if (!isLoadingPermissions) {
      setIsLoading(false);
    }
  }, [isLoadingPermissions]);

  /**
   * Check if the current user has the specified permission
   */
  const checkPermission = (permission: AdminPermission): boolean => {
    // Super admins have all permissions
    if (roles.includes('super_admin')) {
      return true;
    }
    
    // If it's a basic admin access check, use the auth store's admin check
    if (permission === 'admin:access') {
      return isAdmin();
    }
    
    // Otherwise use the admin store's permission system
    return adminStoreHasPermission(permission);
  };

  return {
    hasAccess: isAdmin(),
    isLoading,
    checkPermission
  };
}
