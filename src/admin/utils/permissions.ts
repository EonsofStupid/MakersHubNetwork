
import { UserRole } from '@/shared/types';

/**
 * Checks if a user has admin permission based on roles and permission
 * @param roles User roles
 * @param permission Permission to check
 * @returns Boolean indicating if user has permission
 */
export function hasAdminPermission(roles: string[], permission: string): boolean {
  // Super admin has all permissions
  if (roles.includes('superadmin')) {
    return true;
  }

  // Admin role
  if (roles.includes('admin')) {
    // Admin can do everything except critical system operations
    return true;
  }
  
  // Moderator role has limited permissions
  if (roles.includes('moderator')) {
    // List of permissions allowed for moderators
    const moderatorPermissions = [
      'view_admin_panel',
      'manage_content',
      'view_users'
    ];
    
    return moderatorPermissions.includes(permission);
  }
  
  return false;
}

/**
 * Checks if a user has specific role
 * @param userRoles User roles
 * @param requiredRole Required role to check
 * @returns Boolean indicating if user has the role
 */
export function hasRole(userRoles: UserRole[], requiredRole: UserRole | UserRole[]): boolean {
  if (!userRoles) return false;
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.some(role => userRoles.includes(role));
  }
  
  return userRoles.includes(requiredRole);
}

/**
 * Formats a list of roles for display
 * @param roles User roles
 * @returns Formatted string of roles
 */
export function formatRoles(roles: UserRole[]): string {
  if (!roles || roles.length === 0) {
    return 'No roles';
  }
  
  return roles.map(role => {
    // Capitalize first letter and replace underscores with spaces
    const formatted = role.replace(/_/g, ' ').replace(/\w\S*/g, 
      txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
    
    return formatted;
  }).join(', ');
}
