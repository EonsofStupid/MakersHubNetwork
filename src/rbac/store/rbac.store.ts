import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRole, RBAC } from '@/shared/types/shared.types';
import { Permission, DEFAULT_PERMISSIONS } from '@/shared/types/permissions';
import { logger } from '@/logging/logger.service';
import { LogLevel, LogCategory } from '@/shared/types/shared.types';

/**
 * RBAC Store
 * Manages roles and permissions for the current user
 */
interface RBACState {
  roles: UserRole[];
  permissions: Record<Permission, boolean>;
  initialized: boolean;
  
  // Actions
  setRoles: (roles: UserRole[]) => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasPermission: (permission: Permission) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAdminAccess: () => boolean;
  isSuperAdmin: () => boolean;
  isModerator: () => boolean;
  isBuilder: () => boolean;
  canAccessRoute: (route: string) => boolean;
  canAccessAdminSection: (section: string) => boolean;
  getHighestRole: () => UserRole;
  clear: () => void;
}

// Create the store with persistence
export const useRBACStore = create<RBACState>()(
  persist(
    (set, get) => ({
      // Initial state
      roles: [],
      permissions: DEFAULT_PERMISSIONS,
      initialized: false,
      
      // Set user roles and calculate permissions
      setRoles: (roles: UserRole[]) => {
        // Build combined permissions from all roles
        const allPermissions = { ...DEFAULT_PERMISSIONS };
        
        // Add permissions from each role
        roles.forEach(role => {
          const rolePermissions = ROLE_PERMISSIONS[role] || [];
          rolePermissions.forEach(permission => {
            allPermissions[permission] = true;
          });
        });
        
        // Update state
        set({ 
          roles, 
          permissions: allPermissions,
          initialized: true 
        });
        
        logger.log(LogLevel.INFO, LogCategory.RBAC, 'User roles set', {
          roles,
          permissionCount: Object.values(allPermissions).filter(Boolean).length
        });
      },
      
      // Check if user has a specific role
      hasRole: (role: UserRole | UserRole[]) => {
        const { roles } = get();
        
        // Check for super admin first (has all roles)
        if (roles.includes(UserRole.SUPER_ADMIN)) {
          return true;
        }
        
        // Check for multiple roles
        if (Array.isArray(role)) {
          return role.some(r => roles.includes(r));
        }
        
        // Check for single role
        return roles.includes(role);
      },
      
      // Check if user has a specific permission
      hasPermission: (permission: Permission) => {
        const { permissions } = get();
        
        // For custom permissions that aren't in the enum
        if (!(permission in permissions)) {
          return false;
        }
        
        return permissions[permission];
      },
      
      // Check if user has all of the specified permissions
      hasAllPermissions: (requiredPermissions: Permission[]) => {
        const { permissions } = get();
        return requiredPermissions.every(permission => permissions[permission]);
      },
      
      // Check if user has any of the specified permissions
      hasAnyPermission: (requiredPermissions: Permission[]) => {
        const { permissions } = get();
        return requiredPermissions.some(permission => permissions[permission]);
      },
      
      // Check if user has admin access
      hasAdminAccess: () => {
        const { hasRole } = get();
        return hasRole(RBAC.ADMIN_ONLY);
      },
      
      // Check if user is a super admin
      isSuperAdmin: () => {
        const { hasRole } = get();
        return hasRole(UserRole.SUPER_ADMIN);
      },
      
      // Check if user is a moderator
      isModerator: () => {
        const { hasRole } = get();
        return hasRole([...RBAC.MODERATORS]);
      },
      
      // Check if user is a builder
      isBuilder: () => {
        const { hasRole } = get();
        return hasRole([...RBAC.BUILDERS]);
      },
      
      // Check if user can access a specific route
      canAccessRoute: (route: string) => {
        // To be implemented with route policies
        return true;
      },
      
      // Check if user can access a specific admin section
      canAccessAdminSection: (section: string) => {
        const { hasAdminAccess, isSuperAdmin } = get();
        
        // Only super admins can access these sections
        if (
          section === 'roles' || 
          section === 'permissions' || 
          section === 'system' ||
          section === 'api-keys'
        ) {
          return isSuperAdmin();
        }
        
        // Other sections require admin access
        return hasAdminAccess();
      },
      
      // Get highest role for the current user
      getHighestRole: () => {
        const { roles } = get();
        
        const rolePriority = {
          [UserRole.SUPER_ADMIN]: 5,
          [UserRole.ADMIN]: 4,
          [UserRole.MODERATOR]: 3,
          [UserRole.BUILDER]: 2,
          [UserRole.USER]: 1,
          [UserRole.GUEST]: 0
        };
        
        let highestRole = UserRole.GUEST;
        let highestPriority = -1;
        
        roles.forEach(role => {
          const priority = rolePriority[role] || 0;
          if (priority > highestPriority) {
            highestPriority = priority;
            highestRole = role;
          }
        });
        
        return highestRole;
      },
      
      // Clear all roles and permissions
      clear: () => {
        set({ 
          roles: [], 
          permissions: DEFAULT_PERMISSIONS,
          initialized: false 
        });
        
        logger.log(LogLevel.INFO, LogCategory.RBAC, 'RBAC state cleared');
      }
    }),
    {
      name: 'rbac-store',
      partialize: (state) => ({
        roles: state.roles,
        initialized: state.initialized
      })
    }
  )
);

// Add type-level compatibility for legacy code
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: Object.values(Permission),
  [UserRole.ADMIN]: [
    Permission.ADMIN_ACCESS,
    Permission.ADMIN_VIEW,
    Permission.ADMIN_EDIT,
    Permission.CONTENT_VIEW,
    Permission.CONTENT_CREATE,
    Permission.CONTENT_EDIT,
    Permission.USER_VIEW,
    Permission.USER_EDIT,
    Permission.SYSTEM_VIEW,
    Permission.SETTINGS_VIEW,
    Permission.PROJECT_VIEW,
    Permission.PROJECT_EDIT,
    Permission.ANALYTICS_VIEW
  ],
  [UserRole.MODERATOR]: [
    Permission.CONTENT_VIEW,
    Permission.CONTENT_EDIT,
    Permission.USER_VIEW
  ],
  [UserRole.BUILDER]: [
    Permission.PROJECT_CREATE,
    Permission.PROJECT_EDIT,
    Permission.PROJECT_SUBMIT,
    Permission.PROJECT_VIEW
  ],
  [UserRole.USER]: [
    Permission.CONTENT_VIEW,
    Permission.PROJECT_VIEW
  ],
  [UserRole.GUEST]: []
};

export default useRBACStore;
