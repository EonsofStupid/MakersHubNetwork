
import { UserRole, ROLES } from '@/types/shared';
import { PERMISSIONS, PermissionValue } from '@/auth/permissions';

/**
 * Map of roles to permissions
 * 
 * This is the central configuration for role-based access control.
 * Each role is assigned a set of permissions that determine what actions
 * users with that role can perform.
 */
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [ROLES.SUPER_ADMIN]: [
    ...Object.values(PERMISSIONS)
      .flatMap(section => {
        if (typeof section === 'string') return section;
        return Object.values(section).filter(p => typeof p === 'string');
      })
      .filter((p): p is string => typeof p === 'string')
  ],
  [ROLES.ADMIN]: [
    PERMISSIONS.CONTENT.VIEW,
    PERMISSIONS.CONTENT.CREATE,
    PERMISSIONS.CONTENT.EDIT,
    PERMISSIONS.CONTENT.DELETE,
    PERMISSIONS.CONTENT.PUBLISH,
    
    PERMISSIONS.USERS.VIEW,
    PERMISSIONS.USERS.CREATE,
    PERMISSIONS.USERS.EDIT,
    
    PERMISSIONS.SETTINGS.VIEW,
    PERMISSIONS.SETTINGS.EDIT,
    
    PERMISSIONS.ANALYTICS.VIEW,
  ],
  [ROLES.EDITOR]: [
    PERMISSIONS.CONTENT.VIEW,
    PERMISSIONS.CONTENT.CREATE,
    PERMISSIONS.CONTENT.EDIT,
    PERMISSIONS.CONTENT.PUBLISH,
    
    PERMISSIONS.USERS.VIEW,
  ],
  [ROLES.MODERATOR]: [
    PERMISSIONS.CONTENT.VIEW,
    PERMISSIONS.CONTENT.EDIT,
    
    PERMISSIONS.USERS.VIEW,
  ],
  [ROLES.BUILDER]: [
    PERMISSIONS.CONTENT.VIEW,
    PERMISSIONS.CONTENT.CREATE,
    PERMISSIONS.CONTENT.EDIT,
  ],
  [ROLES.MAKER]: [
    PERMISSIONS.CONTENT.VIEW,
    PERMISSIONS.CONTENT.CREATE,
  ],
  [ROLES.VIEWER]: [
    PERMISSIONS.CONTENT.VIEW,
  ],
  [ROLES.USER]: [
    PERMISSIONS.CONTENT.VIEW,
  ],
  [ROLES.DEVELOPER]: [
    PERMISSIONS.CONTENT.VIEW,
    PERMISSIONS.CONTENT.CREATE,
    PERMISSIONS.CONTENT.EDIT,
    
    PERMISSIONS.SYSTEM.VIEW,
    PERMISSIONS.SYSTEM.EDIT,
    PERMISSIONS.SYSTEM.DEBUG,
  ]
};

/**
 * Maps user roles to their corresponding permissions
 */
export function mapRolesToPermissions(roles: UserRole[]): PermissionValue[] {
  if (!roles || roles.length === 0) {
    return [];
  }
  
  // Get all permissions for all roles
  const permissionSets = roles.map(role => ROLE_PERMISSIONS[role] || []);
  
  // Flatten and deduplicate
  const allPermissions = Array.from(
    new Set(permissionSets.flat())
  ) as PermissionValue[];
  
  return allPermissions;
}
