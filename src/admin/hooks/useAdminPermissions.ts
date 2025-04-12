
import { useAdminStore } from '../store/admin.store';
import { UserRole } from '@/shared/types/shared.types';

export type PermissionCheckResult = boolean;

export interface UseAdminPermissionsResult {
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
  isSuperAdmin: () => boolean;
}

export function useAdminPermissions(): UseAdminPermissionsResult {
  const { user } = useAdminStore();
  
  const hasRole = (roleOrRoles: UserRole | UserRole[]): boolean => {
    if (!user || !user.roles || user.roles.length === 0) {
      return false;
    }
    
    // Super admins have all roles
    if (user.roles.includes(UserRole.SUPERADMIN)) {
      return true;
    }
    
    if (Array.isArray(roleOrRoles)) {
      return roleOrRoles.some(role => user.roles.includes(role));
    }
    
    return user.roles.includes(roleOrRoles);
  };
  
  const hasPermission = (permission: string): boolean => {
    // For now, map permissions to roles
    // In the future, this could be expanded to a more granular permission system
    
    // Super admins have all permissions
    if (hasRole(UserRole.SUPERADMIN)) {
      return true;
    }
    
    // Only admin users can access admin features
    if (permission.startsWith('admin:')) {
      return hasRole([UserRole.ADMIN, UserRole.SUPERADMIN]);
    }
    
    return false;
  };
  
  const isSuperAdmin = (): boolean => {
    return hasRole(UserRole.SUPERADMIN);
  };
  
  return {
    hasRole,
    hasPermission,
    isSuperAdmin
  };
}

export default useAdminPermissions;
