
import { UserRole } from './constants/roles';
import { Permission } from './constants/permissions';
import { rbacStore } from './store/rbac.store';
import { PATH_POLICIES, ADMIN_SECTION_POLICIES } from './constants/policies';

/**
 * RBAC Bridge - Clean interface for role-based access control
 * Acts as a facade over RBAC implementation details
 */
class RBACBridgeImpl {
  /**
   * Initialize the RBAC system
   */
  initialize(): void {
    rbacStore.getState().initialize();
  }

  /**
   * Check if user has a specific role or any role from an array
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
    
    // Check for single role
    return userRoles.includes(role);
  }
  
  /**
   * Check if user has a specific permission
   */
  hasPermission(permission: Permission): boolean {
    const { permissions } = rbacStore.getState();
    
    // Super admin always has all permissions
    if (this.isSuperAdmin()) {
      return true;
    }
    
    return permissions[permission] === true;
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
    
    // Check for path in policies
    const allowedRoles = PATH_POLICIES[route as keyof typeof PATH_POLICIES];
    if (!allowedRoles) {
      return true; // If no specific permissions, allow access
    }
    
    return this.hasRole(allowedRoles);
  }
  
  /**
   * Check if user can access admin section
   */
  canAccessAdminSection(section: string): boolean {
    // Super admin can access all sections
    if (this.isSuperAdmin()) {
      return true;
    }
    
    // Define section access permissions
    const requiredPermission = ADMIN_SECTION_POLICIES[section as keyof typeof ADMIN_SECTION_POLICIES];
    if (!requiredPermission) {
      return false;
    }
    
    return this.hasPermission(requiredPermission as unknown as Permission);
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

// Create a singleton instance
export const RBACBridge = new RBACBridgeImpl();

// Export for direct import
export default RBACBridge;
