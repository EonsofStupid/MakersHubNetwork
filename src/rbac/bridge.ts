
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
    
    return permissions.includes(permission);
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
   * Get user permissions
   */
  getPermissions(): Permission[] {
    return rbacStore.getState().permissions;
  }
  
  /**
   * Set user permissions
   */
  setPermissions(permissions: Permission[]): void {
    rbacStore.getState().setPermissions(permissions);
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
