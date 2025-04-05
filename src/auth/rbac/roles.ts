
import { UserRole } from '../types/roles';

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

// Get highest priority role - useful for UI display
export const getHighestRole = (roles: UserRole[]): UserRole | null => {
  // Order matters - from highest to lowest
  const priorityOrder: UserRole[] = ['super_admin', 'admin', 'moderator', 'editor', 'user'];
  
  for (const role of priorityOrder) {
    if (roles.includes(role)) {
      return role;
    }
  }
  
  return null;
};
