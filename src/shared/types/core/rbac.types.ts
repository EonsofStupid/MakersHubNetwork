
import { UserRole, ROLES } from './auth.types';

export interface RBACState {
  roles: UserRole[];
  permissions: string[];
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

export interface IRBACBridge {
  hasRole: (role: UserRole | UserRole[]) => boolean;
  getRoles: () => UserRole[];
  hasAdminAccess: () => boolean;
  isSuperAdmin: () => boolean;
  isModerator: () => boolean;
  isBuilder: () => boolean;
  setRoles: (roles: UserRole[]) => void;
  clearRoles: () => void;
  hasPermission: (permission: string) => boolean;
  canAccessAdminSection: (section?: string) => boolean;
}

export type AdminSection = 'dashboard' | 'users' | 'content' | 'settings' | 'system';

export const SECTION_PERMISSIONS: Record<AdminSection, UserRole[]> = {
  dashboard: [ROLES.admin, ROLES.super_admin],
  users: [ROLES.admin, ROLES.super_admin],
  content: [ROLES.admin, ROLES.super_admin, ROLES.moderator],
  settings: [ROLES.super_admin],
  system: [ROLES.super_admin]
};
