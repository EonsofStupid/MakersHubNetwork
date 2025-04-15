
import { UserRole } from '@/shared/types/shared.types';

/**
 * Interface for RBAC bridge functionality
 */
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

/**
 * RBAC hook return type
 */
export interface IRBACHook {
  roles: UserRole[];
  hasRole: (role: UserRole | UserRole[]) => boolean;
  can: (permission: string) => boolean;
  hasAdminAccess: () => boolean;
  isSuperAdmin: () => boolean;
  isModerator: () => boolean;
  isBuilder: () => boolean;
}
