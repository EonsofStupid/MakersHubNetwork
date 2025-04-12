
import { useCallback } from 'react';
import { useAdminAuth } from './useAdminAuth';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory, UserRole } from '@/shared/types/shared.types';

/**
 * Hook for role-based access control in the admin panel
 */
export function useAdminRoles() {
  const auth = useAdminAuth();
  const logger = useLogger('useAdminRoles', LogCategory.AUTH);

  // Check if user is a Super Admin
  const isSuperAdmin = useCallback(() => {
    return auth.hasRole(UserRole.SUPER_ADMIN);
  }, [auth]);

  // Check if user is an Admin
  const isAdmin = useCallback(() => {
    return auth.hasRole(UserRole.ADMIN);
  }, [auth]);

  // Check if user is a Moderator
  const isModerator = useCallback(() => {
    return auth.hasRole(UserRole.MODERATOR);
  }, [auth]);

  // Check if user is a Builder
  const isBuilder = useCallback(() => {
    return auth.hasRole(UserRole.BUILDER);
  }, [auth]);

  // Check if user has at least one of the given roles
  const hasAnyRole = useCallback((roles: UserRole[]) => {
    return roles.some(role => auth.hasRole(role));
  }, [auth]);

  // Get the highest role for UI display (Super Admin > Admin > Moderator > Builder > User)
  const getHighestRole = useCallback((): UserRole => {
    if (auth.hasRole(UserRole.SUPER_ADMIN)) return UserRole.SUPER_ADMIN;
    if (auth.hasRole(UserRole.ADMIN)) return UserRole.ADMIN;
    if (auth.hasRole(UserRole.MODERATOR)) return UserRole.MODERATOR;
    if (auth.hasRole(UserRole.BUILDER)) return UserRole.BUILDER;
    return UserRole.USER;
  }, [auth]);

  // Check if user has elevated privileges (admin or higher)
  const hasElevatedPrivileges = useCallback(() => {
    return auth.hasRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]);
  }, [auth]);

  // Check if user can see a specific admin section
  const canAccessAdminSection = useCallback((adminSection: string) => {
    // Super admins can access everything
    if (auth.hasRole(UserRole.SUPER_ADMIN)) return true;

    // Section-specific permissions
    const sectionPermissions: Record<string, UserRole[]> = {
      'dashboard': [UserRole.ADMIN, UserRole.SUPER_ADMIN],
      'users': [UserRole.ADMIN, UserRole.SUPER_ADMIN],
      'builds': [UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN],
      'settings': [UserRole.SUPER_ADMIN],
      'analytics': [UserRole.ADMIN, UserRole.SUPER_ADMIN],
      'content': [UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN],
      'reviews': [UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN],
    };

    const allowedRoles = sectionPermissions[adminSection];
    if (!allowedRoles) {
      logger.warn(`Unknown admin section: ${adminSection}`);
      return false;
    }

    return allowedRoles.some(role => auth.hasRole(role));
  }, [auth, logger]);

  // Get available role labels (for UI displays, selects, etc)
  const getRoleLabels = () => {
    return {
      [UserRole.SUPER_ADMIN]: 'Super Admin',
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
