
import { UserRole } from '../types/roles';
import { PERMISSIONS, PermissionValue } from '../permissions';

// Core role check - can be expanded with more granular permissions
export const hasAdminAccess = (roles: UserRole[]): boolean => {
  return roles.includes('admin') || roles.includes('super_admin');
};

// Check for a specific role
export const hasRole = (roles: UserRole[], role: UserRole): boolean => {
  return roles.includes(role);
};

// Check for any of the provided roles
export const hasAnyRole = (roles: UserRole[], allowedRoles: UserRole[]): boolean => {
  return allowedRoles.some(role => roles.includes(role));
};

// Map roles to their associated permissions
export const mapRolesToPermissions = (roles: UserRole[]): PermissionValue[] => {
  const permissions: PermissionValue[] = [];
  
  // Super admin gets all permissions
  if (roles.includes('super_admin')) {
    return [PERMISSIONS.SUPER_ADMIN];
  }
  
  // Add role-specific permissions
  roles.forEach(role => {
    switch (role) {
      case 'admin':
        permissions.push(
          PERMISSIONS.ADMIN_ACCESS,
          PERMISSIONS.ADMIN_VIEW,
          PERMISSIONS.ADMIN_EDIT,
          PERMISSIONS.CONTENT_VIEW,
          PERMISSIONS.CONTENT_EDIT,
          PERMISSIONS.USERS_VIEW,
          PERMISSIONS.BUILDS_VIEW
        );
        break;
      case 'moderator':
        permissions.push(
          PERMISSIONS.CONTENT_VIEW,
          PERMISSIONS.CONTENT_EDIT,
          PERMISSIONS.REVIEWS_VIEW,
          PERMISSIONS.REVIEWS_APPROVE,
          PERMISSIONS.REVIEWS_REJECT
        );
        break;
      case 'editor':
        permissions.push(
          PERMISSIONS.CONTENT_VIEW,
          PERMISSIONS.CONTENT_EDIT,
          PERMISSIONS.CONTENT_CREATE
        );
        break;
      case 'maker':
        permissions.push(
          PERMISSIONS.CONTENT_VIEW,
          PERMISSIONS.BUILDS_VIEW,
          PERMISSIONS.BUILDS_CREATE
        );
        break;
      case 'builder':
        permissions.push(
          PERMISSIONS.BUILDS_VIEW,
          PERMISSIONS.BUILDS_CREATE
        );
        break;
      case 'user':
        permissions.push(
          PERMISSIONS.CONTENT_VIEW
        );
        break;
    }
  });
  
  // Remove duplicates
  return [...new Set(permissions)];
};

// Get highest priority role - useful for UI display
export const getHighestRole = (roles: UserRole[]): UserRole | null => {
  // Order matters - from highest to lowest
  const priorityOrder: UserRole[] = ['super_admin', 'admin', 'moderator', 'editor', 'maker', 'builder', 'user'];
  
  for (const role of priorityOrder) {
    if (roles.includes(role)) {
      return role;
    }
  }
  
  return null;
};
