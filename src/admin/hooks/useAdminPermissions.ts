
import { UserRole } from '@/shared/types/shared.types';
import { useAdminStore } from '../store/admin.store';

export interface UseHasRoleOptions {
  requireAll?: boolean;
}

export function useAdminPermissions() {
  const { user } = useAdminStore();
  
  const hasRole = (role: UserRole | UserRole[], options: UseHasRoleOptions = {}) => {
    if (!user || !user.roles || user.roles.length === 0) {
      return false;
    }
    
    const { requireAll = false } = options;
    const rolesToCheck = Array.isArray(role) ? role : [role];
    
    if (requireAll) {
      return rolesToCheck.every(r => user.roles?.includes(r));
    }
    
    return rolesToCheck.some(r => user.roles?.includes(r));
  };
  
  const hasPermission = (permission: string | string[], options: UseHasRoleOptions = {}) => {
    if (!user) return false;
    
    // This is a simplified implementation - in a real app we would check
    // against actual permissions stored in the user object or derived from roles
    return hasRole('ADMIN', options) || hasRole('SUPERADMIN', options);
  };
  
  const isAdmin = hasRole('ADMIN');
  const isModerator = hasRole('MODERATOR');
  const isSuperAdmin = hasRole('SUPERADMIN');
  
  return {
    hasRole,
    hasPermission,
    isAdmin,
    isModerator,
    isSuperAdmin
  };
}

export default useAdminPermissions;
