import { UserRole } from './constants/roles';
import { Permission } from '@/shared/types/permissions';
import { rbacStore } from './store/rbac.store';
import { PATH_POLICIES } from './constants/policies';

/**
 * RBAC Bridge - Clean interface for role-based access control
 */
class RBACBridgeImpl {
  initialize(): void {
    rbacStore.getState().initialize();
  }
  
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
    
    return userRoles.includes(role);
  }
  
  hasPermission(permission: Permission): boolean {
    const { permissions } = rbacStore.getState();
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

  canAccessRoute(route: string): boolean {
    // Super admin can access all routes
    if (this.isSuperAdmin()) {
      return true;
    }
    
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
    // const requiredPermission = ADMIN_SECTION_POLICIES[section as keyof typeof ADMIN_SECTION_POLICIES];
    // if (!requiredPermission) {
    //   return false;
    // }
    
    // return this.hasPermission(requiredPermission as unknown as Permission);
    return false;
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
