
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth/store";
import { useAdminStore } from "@/admin/store/admin.store";
import { AdminPermission } from "@/admin/types/admin.types";

export function useAdminPermissions(requiredPermission?: AdminPermission) {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const roles = useAuthStore(state => state.roles);
  const { loadPermissions, hasPermission, isLoadingPermissions } = useAdminStore();
  
  useEffect(() => {
    // If there's no required permission, access is allowed
    if (!requiredPermission) {
      setHasAccess(true);
      setIsLoading(false);
      return;
    }

    // Load permissions if they aren't loaded yet
    if (!isLoadingPermissions) {
      loadPermissions();
    }
  }, [requiredPermission, loadPermissions, isLoadingPermissions]);

  useEffect(() => {
    if (!isLoadingPermissions && requiredPermission) {
      const access = hasPermission(requiredPermission);
      setHasAccess(access);
      setIsLoading(false);
    }
  }, [isLoadingPermissions, requiredPermission, hasPermission, roles]);

  return {
    hasAccess,
    isLoading,
    checkPermission: hasPermission
  };
}
