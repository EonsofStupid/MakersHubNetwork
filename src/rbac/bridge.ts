
import { UserRole } from './constants/roles';
import { Permission } from '@/shared/types/shared.types';
import { rbacStore } from './store/rbac.store';

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
    if (userRoles.includes('super_admin')) {
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
    return rbacStore.getState().roles.includes('super_admin');
  }
  
  /**
   * Check if user has admin access
   */
  hasAdminAccess(): boolean {
    const roles = rbacStore.getState().roles;
    return roles.includes('admin') || roles.includes('super_admin');
  }
  
  /**
   * Check if user is a moderator
   */
  isModerator(): boolean {
    return rbacStore.getState().roles.includes('moderator');
  }
  
  /**
   * Check if user is a builder
   */
  isBuilder(): boolean {
    return rbacStore.getState().roles.includes('builder');
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
    if (roles.includes('super_admin')) return 'super_admin';
    if (roles.includes('admin')) return 'admin';
    if (roles.includes('moderator')) return 'moderator';
    if (roles.includes('builder')) return 'builder';
    if (roles.includes('user')) return 'user';
    return 'guest';
  }
}

// Create singleton instance
export const RBACBridge = new RBACBridgeImpl();
export default RBACBridge;
