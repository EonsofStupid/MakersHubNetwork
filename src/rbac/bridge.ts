
import { UserRole, Permission, ROLES } from '@/shared/types/shared.types';
import { rbacStore } from './rbac.store';

/**
 * RBAC Bridge provides a clean interface for role-based access control
 * Acts as a facade over RBAC implementation details
 */
export class RBACBridgeImpl {
  /**
   * Check if user has a specific role
   */
  hasRole(role: UserRole | UserRole[]): boolean {
    const userRoles = rbacStore.getState().roles;
    
    // Super admin always has all roles
    if (userRoles.includes(ROLES.SUPER_ADMIN)) {
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
    return rbacStore.getState().roles.includes(ROLES.SUPER_ADMIN);
  }
  
  /**
   * Check if user is an admin (either admin or super_admin)
   */
  hasAdminAccess(): boolean {
    const roles = rbacStore.getState().roles;
    return roles.includes(ROLES.ADMIN) || roles.includes(ROLES.SUPER_ADMIN);
  }
  
  /**
   * Check if user is a moderator
   */
  isModerator(): boolean {
    return rbacStore.getState().roles.includes(ROLES.MODERATOR);
  }
  
  /**
   * Check if user is a builder
   */
  isBuilder(): boolean {
    return rbacStore.getState().roles.includes(ROLES.BUILDER);
  }
  
  /**
   * Get user roles
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
   * Clear user roles
   */
  clearRoles(): void {
    rbacStore.getState().setRoles([]);
  }
  
  /**
   * Check if user can access a specific route
   */
  canAccessRoute(route: string): boolean {
    // Super admin can access all routes
    if (this.isSuperAdmin()) {
      return true;
    }
    
    // Define route access permissions
    const routeAccessMap: Record<string, UserRole[]> = {
      '/admin': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
      '/admin/users': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
      '/admin/content': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
      '/admin/settings': [ROLES.SUPER_ADMIN],
    };
    
    const allowedRoles = routeAccessMap[route];
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
    const sectionPermissionsMap: Record<string, Permission> = {
      'dashboard': 'admin:view' as Permission,
      'users': 'manage_users' as Permission,
      'content': 'content:view' as Permission,
      'settings': 'settings:view' as Permission,
      'system': 'admin:view' as Permission
    };
    
    const requiredPermission = sectionPermissionsMap[section];
    if (!requiredPermission) {
      return false;
    }
    
    return this.hasPermission(requiredPermission);
  }
}

export const RBACBridge = new RBACBridgeImpl();
export default RBACBridge;
