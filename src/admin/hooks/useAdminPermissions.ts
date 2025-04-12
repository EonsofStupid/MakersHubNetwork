
import { useCallback } from 'react';
import { useAdminStore } from '../store/admin.store';
import { UserRole } from '@/shared/types/shared.types';

export interface UseAdminPermissionsResult {
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
  canEdit: (resource: string) => boolean;
  canView: (resource: string) => boolean;
  canManage: (resource: string) => boolean;
  isSuperAdmin: () => boolean;
}

export const useAdminPermissions = (): UseAdminPermissionsResult => {
  const { user } = useAdminStore();
  
  const hasRole = useCallback((requiredRoles: UserRole | UserRole[]): boolean => {
    if (!user || !user.roles || user.roles.length === 0) return false;
    
    // If user is super admin, they have all roles
    if (user.roles.includes(UserRole.SUPERADMIN)) return true;
    
    // Check if user has at least one of the required roles
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.some(role => user.roles.includes(role));
    }
    
    return user.roles.includes(requiredRoles);
  }, [user]);
  
  const isSuperAdmin = useCallback((): boolean => {
    return hasRole(UserRole.SUPERADMIN);
  }, [hasRole]);
  
  const hasPermission = useCallback((permission: string): boolean => {
    // Implement permission check based on roles
    // This is a simplified implementation - you may want to extend with a more detailed permission system
    if (isSuperAdmin()) return true;
    
    // Map roles to permissions or check against a predefined mapping
    // For now, we just check if the user has admin role
    return hasRole([UserRole.ADMIN, UserRole.MODERATOR]);
  }, [hasRole, isSuperAdmin]);
  
  const canEdit = useCallback((resource: string): boolean => {
    if (isSuperAdmin()) return true;
    return hasPermission(`edit:${resource}`);
  }, [isSuperAdmin, hasPermission]);
  
  const canView = useCallback((resource: string): boolean => {
    if (isSuperAdmin()) return true;
    return hasPermission(`view:${resource}`);
  }, [isSuperAdmin, hasPermission]);
  
  const canManage = useCallback((resource: string): boolean => {
    if (isSuperAdmin()) return true;
    return hasPermission(`manage:${resource}`);
  }, [isSuperAdmin, hasPermission]);
  
  return {
    hasRole,
    hasPermission,
    canEdit,
    canView,
    canManage,
    isSuperAdmin
  };
};

export default useAdminPermissions;
