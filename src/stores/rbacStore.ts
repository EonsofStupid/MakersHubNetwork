import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRole, Permission, ROLES, RBAC_POLICIES } from '@/types/shared';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';

/**
 * RBAC error types for better error handling
 */
export class RBACError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'RBACError';
  }
}

export const RBAC_ERROR_CODES = {
  INVALID_ROLE: 'rbac/invalid-role',
  INVALID_PERMISSION: 'rbac/invalid-permission',
  INVALID_POLICY: 'rbac/invalid-policy',
  UNKNOWN: 'rbac/unknown',
} as const;

/**
 * Type guard for UserRole
 */
function isUserRole(role: unknown): role is UserRole {
  return typeof role === 'string' && Object.values(ROLES).includes(role as UserRole);
}

/**
 * Type guard for Permission
 */
function isPermission(permission: unknown): permission is Permission {
  return typeof permission === 'string' && [
    'create_project',
    'edit_project',
    'delete_project',
    'submit_build',
    'access_admin',
    'manage_api_keys',
    'manage_users',
    'manage_roles',
    'manage_permissions',
    'view_analytics'
  ].includes(permission);
}

/**
 * RBAC store state interface
 */
interface RBACState {
  roles: UserRole[];
  permissions: Record<Permission, boolean>;
  roleCache: Map<string, boolean>;
  
  // Role methods
  hasRole: (check: UserRole | UserRole[]) => boolean;
  setRoles: (roles: UserRole[]) => void;
  
  // Permission methods
  can: (permission: Permission) => boolean;
  setPermissions: (permissions: Record<Permission, boolean>) => void;
  
  // Route methods
  canAccessRoute: (route: string) => boolean;
  
  // Utility methods
  clear: () => void;
  clearCache: () => void;
}

/**
 * RBAC store implementation
 * Manages roles and permissions separately from auth
 */
export const useRbacStore = create<RBACState>()(
  persist(
    (set, get) => {
      const logger = useLogger('RbacStore', LogCategory.AUTH);
      
      // Initialize permissions with all false
      const initialPermissions: Record<Permission, boolean> = {
        create_project: false,
        edit_project: false,
        delete_project: false,
        submit_build: false,
        access_admin: false,
        manage_api_keys: false,
        manage_users: false,
        manage_roles: false,
        manage_permissions: false,
        view_analytics: false
      };
      
      return {
        roles: [],
        permissions: initialPermissions,
        roleCache: new Map(),
        
        /**
         * Check if user has the specified role(s)
         */
        hasRole: (check: UserRole | UserRole[]) => {
          try {
            const { roles, roleCache } = get();
            const checkRoles = Array.isArray(check) ? check : [check];
            
            // Validate roles
            checkRoles.forEach(role => {
              if (!isUserRole(role)) {
                throw new RBACError(`Invalid role: ${role}`, RBAC_ERROR_CODES.INVALID_ROLE);
              }
            });
            
            // Create cache key
            const cacheKey = checkRoles.sort().join(',');
            
            // Check cache first
            if (roleCache.has(cacheKey)) {
              return roleCache.get(cacheKey)!;
            }
            
            // Calculate result and cache it
            const result = checkRoles.some(role => roles.includes(role));
            roleCache.set(cacheKey, result);
            
            return result;
          } catch (error) {
            logger.error('Role check failed', {
              details: {
                error: error instanceof Error ? error.message : String(error),
                roles: check
              }
            });
            return false;
          }
        },
        
        /**
         * Set user roles
         */
        setRoles: (roles: UserRole[]) => {
          try {
            // Validate roles
            roles.forEach(role => {
              if (!isUserRole(role)) {
                throw new RBACError(`Invalid role: ${role}`, RBAC_ERROR_CODES.INVALID_ROLE);
              }
            });
            
            set({ roles, roleCache: new Map() });
            logger.info('Roles updated', { details: { roles } });
          } catch (error) {
            logger.error('Setting roles failed', {
              details: {
                error: error instanceof Error ? error.message : String(error),
                roles
              }
            });
            throw error;
          }
        },
        
        /**
         * Check if user has the specified permission
         */
        can: (permission: Permission) => {
          try {
            // Validate permission
            if (!isPermission(permission)) {
              throw new RBACError(`Invalid permission: ${permission}`, RBAC_ERROR_CODES.INVALID_PERMISSION);
            }
            
            const { permissions } = get();
            return permissions[permission] === true;
          } catch (error) {
            logger.error('Permission check failed', {
              details: {
                error: error instanceof Error ? error.message : String(error),
                permission
              }
            });
            return false;
          }
        },
        
        /**
         * Set user permissions
         */
        setPermissions: (permissions: Record<Permission, boolean>) => {
          try {
            // Validate permissions
            Object.keys(permissions).forEach(permission => {
              if (!isPermission(permission)) {
                throw new RBACError(`Invalid permission: ${permission}`, RBAC_ERROR_CODES.INVALID_PERMISSION);
              }
            });
            
            set({ permissions });
            logger.info('Permissions updated', { details: { permissions } });
          } catch (error) {
            logger.error('Setting permissions failed', {
              details: {
                error: error instanceof Error ? error.message : String(error),
                permissions
              }
            });
            throw error;
          }
        },
        
        /**
         * Check if user can access the specified route
         */
        canAccessRoute: (route: string) => {
          try {
            const { roles } = get();
            const allowedRoles = RBAC_POLICIES[route];
            
            if (!allowedRoles) {
              throw new RBACError(`No policy found for route: ${route}`, RBAC_ERROR_CODES.INVALID_POLICY);
            }
            
            return roles.some(role => allowedRoles.includes(role));
          } catch (error) {
            logger.error('Route access check failed', {
              details: {
                error: error instanceof Error ? error.message : String(error),
                route
              }
            });
            return false;
          }
        },
        
        /**
         * Clear RBAC state
         */
        clear: () => {
          set({ 
            roles: [], 
            permissions: initialPermissions,
            roleCache: new Map()
          });
          logger.info('RBAC state cleared');
        },
        
        /**
         * Clear role check cache
         */
        clearCache: () => {
          const { roleCache } = get();
          roleCache.clear();
          logger.info('Role cache cleared');
        }
      };
    },
    {
      name: 'rbac-storage',
      partialize: (state) => ({
        roles: state.roles,
        permissions: state.permissions
      })
    }
  )
);