
// Define strict user role types
export type UserRole = 'admin' | 'super_admin' | 'user' | 'moderator' | 'editor';

// Helper functions for role-based access control
export const hasAdminAccess = (roles: UserRole[]): boolean => {
  return roles.includes('admin') || roles.includes('super_admin');
};

export const hasRole = (roles: UserRole[], role: UserRole): boolean => {
  return roles.includes(role);
};
