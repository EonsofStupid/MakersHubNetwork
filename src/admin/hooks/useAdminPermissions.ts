
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth/store";
import { useAdminStore } from "@/admin/store/admin.store";
import { AdminPermission } from "@/admin/types/admin.types";
import { useAdminAccess } from "@/hooks/useAdminAccess";

/**
 * Custom hook for admin permission management
 * Combines authentication roles with admin-specific permissions
 */
export function useAdminPermissions() {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const { 
    loadPermissions, 
    hasPermission: adminStoreHasPermission,
    isLoadingPermissions 
  } = useAdminStore();
  const { hasAdminAccess, checkPermission } = useAdminAccess();
  
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

  return {
    hasAccess: hasAdminAccess,
    isLoading,
    checkPermission
  };
}
