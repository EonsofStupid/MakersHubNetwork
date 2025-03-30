
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth/store";
import { useAdminStore } from "@/admin/store/admin.store";
import { AdminPermission } from "@/admin/types/admin.types";
import { useAdmin } from "@/admin/context/AdminContext";

/**
 * Custom hook for admin permission management
 * Combines authentication roles with admin-specific permissions
 */
export function useAdminPermissions() {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const { loadPermissions, isLoadingPermissions } = useAdminStore();
  const { checkPermission, hasAdminAccess } = useAdmin();
  
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
