import { useAuthStore } from '@/stores/auth/auth.store';
import { UserRole, RBAC } from '@/shared/types/shared.types';

export function useAdminPermissions() {
  const { user, roles } = useAuthStore();

  const hasPermission = (requiredRoles: UserRole | UserRole[]): boolean => {
    if (!user || !roles.length) return false;
    
    const rolesToCheck = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return rolesToCheck.some(role => roles.includes(role));
  };

  const isAdmin = hasPermission(RBAC.adminOnly);
  const isSuperAdmin = hasPermission(RBAC.superAdmins);
  const isModerator = hasPermission(RBAC.moderators);
  const isBuilder = hasPermission(RBAC.builders);

  return {
    hasPermission,
    isAdmin,
    isSuperAdmin,
    isModerator,
    isBuilder,
    roles
  };
}

export default useAdminPermissions; 