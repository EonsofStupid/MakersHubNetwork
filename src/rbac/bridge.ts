
import { UserRole } from './constants/roles';
import { Permission } from '@/shared/types/permissions';
import { rbacStore } from './store/rbac.store';
import { PATH_POLICIES, ADMIN_SECTION_POLICIES } from './constants/policies';

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
   * Check if user is an admin (either admin or super_admin)
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
   * Check if user can access a specific route
   */
  canAccessRoute(route: string): boolean {
    // Super admin can access all routes
    if (this.isSuperAdmin()) {
      return true;
    }
    
    // Check if route has policy
    const pathMatches = Object.keys(PATH_POLICIES).filter(path => {
      // Exact match
      if (path === route) return true;
      
      // Base path match (e.g. /admin/users/123 matches /admin/users policy)
      if (route.startsWith(`${path}/`)) return true;
      
      return false;
    });
    
    // If no policy matches, allow access
    if (pathMatches.length === 0) {
      return true;
    }
    
    // Check all matching policies (user must have permission for all matching policies)
    return pathMatches.every(path => {
      const allowedRoles = PATH_POLICIES[path as keyof typeof PATH_POLICIES];
      return allowedRoles.some(role => this.hasRole(role));
    });
  }
  
  /**
   * Check if user can access admin section
   */
  canAccessAdminSection(section: string): boolean {
    // Super admin can access all sections
    if (this.isSuperAdmin()) {
      return true;
    }
    
    // Get allowed roles for section
    const allowedRoles = ADMIN_SECTION_POLICIES[section as keyof typeof ADMIN_SECTION_POLICIES];
    if (!allowedRoles) {
      return false;
    }
    
    // Check if user has any of the allowed roles
    return allowedRoles.some(role => this.hasRole(role));
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
}

// Create singleton instance
export const RBACBridge = new RBACBridgeImpl();
export default RBACBridge;
