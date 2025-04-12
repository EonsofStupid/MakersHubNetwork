
import { useAuthStore } from '@/auth/store/auth.store';
import { UserRole } from '@/shared/types/shared.types';

interface UseHasRoleResult {
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasAdminAccess: () => boolean;
  hasSuperAdminAccess: () => boolean;
}

/**
 * Hook to check if the current user has specific roles
 */
export function useHasRole(): UseHasRoleResult {
  const { roles } = useAuthStore();

  /**
   * Check if the user has at least one of the specified roles
   */
  const hasRole = (roleOrRoles: UserRole | UserRole[]) => {
    if (!roles || roles.length === 0) return false;
    
    const rolesToCheck = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];
    return roles.some(role => rolesToCheck.includes(role));
  };

  /**
   * Check if the user has admin or superadmin access
   */
  const hasAdminAccess = () => {
    return hasRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]);
  };

  /**
   * Check if the user has superadmin access
   */
  const hasSuperAdminAccess = () => {
    return hasRole(UserRole.SUPER_ADMIN);
  };

  return {
    hasRole,
    hasAdminAccess,
    hasSuperAdminAccess
  };
}
