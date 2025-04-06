
/**
 * User Role definitions for the application
 * These roles are used for UI permissions and should match
 * the roles defined in the Supabase RLS policies
 */
export enum UserRole {
  ADMIN = 'admin',
  SUPER_ADMIN = 'superadmin',
  USER = 'user',
  SERVICE = 'service',
  GUEST = 'guest',
}

// Admin roles for permission checks
export const ADMIN_ROLES = [UserRole.ADMIN, UserRole.SUPER_ADMIN];

// Check if a user has admin permissions
export const isAdmin = (roles: UserRole[] | undefined): boolean => {
  if (!roles) return false;
  return roles.some(role => ADMIN_ROLES.includes(role));
};

// Check if a user has superadmin permissions
export const isSuperAdmin = (roles: UserRole[] | undefined): boolean => {
  if (!roles) return false;
  return roles.includes(UserRole.SUPER_ADMIN);
};

// Check if the user is a regular user or higher
export const isUser = (roles: UserRole[] | undefined): boolean => {
  if (!roles) return false;
  return roles.includes(UserRole.USER) || isAdmin(roles);
};

// Check if the user is a service account
export const isService = (roles: UserRole[] | undefined): boolean => {
  if (!roles) return false;
  return roles.includes(UserRole.SERVICE);
};
