import { useCallback } from 'react';
import { useAuthStore } from '@/stores/auth/auth.store';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory, UserRole } from '@/shared/types/shared.types';
import { useRbac } from '@/auth/rbac/use-rbac';

/**
 * Hook for role-based access control in the admin panel
 */
export function useAdminRoles() {
  const { roles } = useAuthStore();
  const { 
    hasRole, 
    hasAdminAccess, 
    isSuperAdmin, 
    isModerator, 
    isBuilder, 
    getHighestRole, 
    hasElevatedPrivileges, 
    canAccessAdminSection, 
    getRoleLabels 
  } = useRbac();
  const logger = useLogger('useAdminRoles', LogCategory.AUTH);

  // Check if user has at least one of the given roles
  const hasAnyRole = useCallback((checkRoles: UserRole[]) => {
    return checkRoles.some(role => hasRole(role));
  }, [hasRole]);

  return {
    isSuperAdmin,
    isAdmin: hasAdminAccess,
    isModerator,
    isBuilder,
    hasAnyRole,
    getHighestRole,
    hasElevatedPrivileges,
    canAccessAdminSection,
    getRoleLabels,
  };
}
