
import { useAdminStore } from "@/admin/store/admin.store";
import { AdminPermissionValue } from "@/admin/constants/permissions";

export function useAdminPermissions() {
  const { permissions, hasPermission } = useAdminStore();
  
  const checkPermission = (permission: string): boolean => {
    return hasPermission(permission as AdminPermissionValue);
  };
  
  return {
    permissions,
    hasPermission: checkPermission,
    hasAllPermissions: (requiredPermissions: string[]): boolean => {
      return requiredPermissions.every(permission => checkPermission(permission));
    },
    hasAnyPermission: (requiredPermissions: string[]): boolean => {
      return requiredPermissions.some(permission => checkPermission(permission));
    }
  };
}
