
import { useCallback } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory, UserRole } from '@/shared/types/shared.types';
import { useHasRole } from '@/auth/hooks/useHasRole';

/**
 * Hook for role-based access control in the admin panel
 */
export function useAdminRoles() {
  const { roles } = useAuthStore();
  const { hasRole } = useHasRole();
  const logger = useLogger('useAdminRoles', LogCategory.AUTH);

  // Check if user is a Super Admin
  const isSuperAdmin = useCallback(() => {
    return hasRole(UserRole.SUPERADMIN);
  }, [hasRole]);

  // Check if user is an Admin
  const isAdmin = useCallback(() => {
    return hasRole(UserRole.ADMIN);
  }, [hasRole]);

  // Check if user is a Moderator
  const isModerator = useCallback(() => {
    return hasRole(UserRole.MODERATOR);
  }, [hasRole]);

  // Check if user is a Builder
  const isBuilder = useCallback(() => {
    return hasRole(UserRole.BUILDER);
  }, [hasRole]);

  // Check if user has at least one of the given roles
  const hasAnyRole = useCallback((checkRoles: UserRole[]) => {
    return checkRoles.some(role => hasRole(role));
  }, [hasRole]);

  // Get the highest role for UI display (Super Admin > Admin > Moderator > Builder > User)
  const getHighestRole = useCallback((): UserRole => {
    if (hasRole(UserRole.SUPERADMIN)) return UserRole.SUPERADMIN;
    if (hasRole(UserRole.ADMIN)) return UserRole.ADMIN;
    if (hasRole(UserRole.MODERATOR)) return UserRole.MODERATOR;
    if (hasRole(UserRole.BUILDER)) return UserRole.BUILDER;
    return UserRole.USER;
  }, [hasRole]);

  // Check if user has elevated privileges (admin or higher)
  const hasElevatedPrivileges = useCallback(() => {
    return hasRole([UserRole.ADMIN, UserRole.SUPERADMIN]);
  }, [hasRole]);

  // Check if user can see a specific admin section
  const canAccessAdminSection = useCallback((adminSection: string) => {
    // Super admins can access everything
    if (hasRole(UserRole.SUPERADMIN)) return true;

    // Section-specific permissions
    const sectionPermissions: Record<string, UserRole[]> = {
      'dashboard': [UserRole.ADMIN, UserRole.SUPERADMIN],
      'users': [UserRole.ADMIN, UserRole.SUPERADMIN],
      'builds': [UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPERADMIN],
      'settings': [UserRole.SUPERADMIN],
      'analytics': [UserRole.ADMIN, UserRole.SUPERADMIN],
      'content': [UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPERADMIN],
      'reviews': [UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPERADMIN],
    };

    const allowedRoles = sectionPermissions[adminSection];
    if (!allowedRoles) {
      logger.warn(`Unknown admin section: ${adminSection}`);
      return false;
    }

    return allowedRoles.some(role => hasRole(role));
  }, [hasRole, logger]);

  // Get available role labels (for UI displays, selects, etc)
  const getRoleLabels = () => {
    return {
      [UserRole.SUPERADMIN]: 'Super Admin',
      [UserRole.ADMIN]: 'Admin',
      [UserRole.MODERATOR]: 'Moderator',
      [UserRole.BUILDER]: 'Builder',
      [UserRole.USER]: 'User',
    };
  };

  return {
    isSuperAdmin,
    isAdmin,
    isModerator,
    isBuilder,
    hasAnyRole,
    getHighestRole,
    hasElevatedPrivileges,
    canAccessAdminSection,
    getRoleLabels,
  };
}
