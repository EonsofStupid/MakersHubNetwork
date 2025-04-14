
import { UserRole, Permission, ROLES } from '@/shared/types/shared.types';
import { rbacStore } from './store/rbac.store';
import { logger } from '@/logging/logger.service';
import { LogCategory, LogLevel } from '@/shared/types/shared.types';

/**
 * RBAC Bridge - Clean interface for role-based access control
 * Enterprise-ready implementation with performance optimizations
 */
class RBACBridgeImpl {
  /**
   * Initialize the RBAC system
   */
  initialize(): void {
    rbacStore.getState().initialize();
  }
  
  /**
   * Check if user has a specific role or any of the roles
   * @param role Single role or array of roles to check
   * @returns Boolean indicating if user has the role
   */
  hasRole(role: UserRole | UserRole[]): boolean {
    const userRoles = rbacStore.getState().roles;
    
    // Super admin always has all roles
    if (userRoles.includes(UserRole.SUPER_ADMIN)) {
      return true;
    }
    
    // Check for array of roles (ANY matching)
    if (Array.isArray(role)) {
      return role.some(r => userRoles.includes(r));
    }
    
    // Check for specific role
    return userRoles.includes(role);
  }
  
  /**
   * Check if user has a specific permission
   * @param permission Permission to check
   * @returns Boolean indicating if user has the permission
   */
  hasPermission(permission: Permission): boolean {
    const { permissions } = rbacStore.getState();
    return permissions[permission] === true;
  }
  
  /**
   * Check if user has all of the specified permissions
   * @param permissionList Array of permissions to check
   * @returns Boolean indicating if user has all permissions
   */
  hasAllPermissions(permissionList: Permission[]): boolean {
    return permissionList.every(permission => this.hasPermission(permission));
  }
  
  /**
   * Check if user has any of the specified permissions
   * @param permissionList Array of permissions to check
   * @returns Boolean indicating if user has at least one permission
   */
  hasAnyPermission(permissionList: Permission[]): boolean {
    return permissionList.some(permission => this.hasPermission(permission));
  }
  
  /**
   * Check if user is a super admin
   */
  isSuperAdmin(): boolean {
    return rbacStore.getState().roles.includes(UserRole.SUPER_ADMIN);
  }
  
  /**
   * Check if user has admin access
   */
  hasAdminAccess(): boolean {
    const roles = rbacStore.getState().roles;
    return roles.includes(UserRole.ADMIN) || roles.includes(UserRole.SUPER_ADMIN);
  }
  
  /**
   * Check if user is a moderator
   */
  isModerator(): boolean {
    return rbacStore.getState().roles.includes(UserRole.MODERATOR);
  }
  
  /**
   * Check if user is a builder
   */
  isBuilder(): boolean {
    return rbacStore.getState().roles.includes(UserRole.BUILDER);
  }
  
  /**
   * Get all user roles
   */
  getRoles(): UserRole[] {
    return rbacStore.getState().roles;
  }
  
  /**
   * Set user roles
   */
  setRoles(roles: UserRole[]): void {
    rbacStore.getState().setRoles(roles);
  }
  
  /**
   * Clear user roles (on logout)
   */
  clearRoles(): void {
    rbacStore.getState().clear();
  }
  
  /**
   * Get the highest role for the current user
   */
  getHighestRole(): UserRole {
    const roles = this.getRoles();
    if (roles.includes(UserRole.SUPER_ADMIN)) return UserRole.SUPER_ADMIN;
    if (roles.includes(UserRole.ADMIN)) return UserRole.ADMIN;
    if (roles.includes(UserRole.MODERATOR)) return UserRole.MODERATOR;
    if (roles.includes(UserRole.BUILDER)) return UserRole.BUILDER;
    if (roles.includes(UserRole.USER)) return UserRole.USER;
    return UserRole.GUEST;
  }

  /**
   * Check if user can access a specific route
   * @param route Route to check
   * @returns Boolean indicating if user can access the route
   */
  canAccessRoute(route: string): boolean {
    const userRoles = this.getRoles();
    if (userRoles.includes(UserRole.SUPER_ADMIN)) return true;
    
    const routeRoles: Record<string, UserRole[]> = {
      '/admin': [UserRole.ADMIN, UserRole.SUPER_ADMIN],
      '/admin/users': [UserRole.ADMIN, UserRole.SUPER_ADMIN],
      '/admin/roles': [UserRole.SUPER_ADMIN],
      '/admin/settings': [UserRole.SUPER_ADMIN]
    };
    
    const requiredRoles = routeRoles[route];
    if (!requiredRoles) return true;
    
    return this.hasRole(requiredRoles);
  }

  /**
   * Check if user can access a specific admin section
   * @param section Admin section to check
   * @returns Boolean indicating if user can access the section
   */
  canAccessAdminSection(section: string): boolean {
    const userRoles = this.getRoles();
    if (userRoles.includes(UserRole.SUPER_ADMIN)) return true;
    
    const sectionRoles: Record<string, UserRole[]> = {
      users: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
      roles: [UserRole.SUPER_ADMIN],
      settings: [UserRole.SUPER_ADMIN],
      content: [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR]
    };
    
    const requiredRoles = sectionRoles[section];
    if (!requiredRoles) return false;
    
    return this.hasRole(requiredRoles);
  }
}

// Create singleton instance
export const RBACBridge = new RBACBridgeImpl();
export default RBACBridge;
