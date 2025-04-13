import { UserRole, ROLES, RBAC as SharedRBAC } from '@/shared/types/SharedTypes';

// Re-export shared types
export { UserRole, ROLES };

// Admin section type
export type AdminSection = 'dashboard' | 'users' | 'content' | 'settings' | 'system';

// Role labels for UI display
export const ROLE_LABELS: Record<UserRole, string> = {
  [ROLES.SUPERADMIN]: 'Super Admin',
  [ROLES.ADMIN]: 'Admin',
  [ROLES.MODERATOR]: 'Moderator',
  [ROLES.BUILDER]: 'Builder',
  [ROLES.USER]: 'User',
  [ROLES.GUEST]: 'Guest',
};

// RBAC Hook return type
export interface RBACHook {
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasAdminAccess: () => boolean;
  isSuperAdmin: () => boolean;
  isModerator: () => boolean;
  isBuilder: () => boolean;
  getHighestRole: () => UserRole;
  hasElevatedPrivileges: () => boolean;
  canAccessAdminSection: (section: AdminSection) => boolean;
  getRoleLabels: () => Record<UserRole, string>;
  roles: UserRole[];
} 