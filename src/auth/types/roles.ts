
// Define user roles
export type UserRole = 'super_admin' | 'admin' | 'moderator' | 'editor' | 'user' | 'builder';

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Administrator',
  moderator: 'Moderator',
  editor: 'Editor',
  user: 'User',
  builder: 'Builder'
};

// Helper function to check if a role is admin-level
export function isAdminRole(role: UserRole): boolean {
  return role === 'super_admin' || role === 'admin';
}
