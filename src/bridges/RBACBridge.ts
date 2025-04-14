
import { RBACBridge as RBACBridgeImpl } from '@/rbac/bridge';
import { UserRole } from '@/rbac/constants/roles';
import { Permission } from '@/shared/types/permissions';

/**
 * RBAC Bridge
 * Provides a clean API for RBAC functionality to external systems
 */
class RBACBridgeExport {
  /**
   * Check if user has a specific role
   */
  hasRole(role: UserRole | UserRole[]): boolean {
    return RBACBridgeImpl.hasRole(role);
  }
  
  /**
   * Check if user has a specific permission
   */
  hasPermission(permission: Permission): boolean {
    return RBACBridgeImpl.hasPermission(permission);
  }
  
  /**
   * Check if user has admin access
   */
  hasAdminAccess(): boolean {
    return RBACBridgeImpl.hasAdminAccess();
  }
  
  /**
   * Check if user is a super admin
   */
  isSuperAdmin(): boolean {
    return RBACBridgeImpl.isSuperAdmin();
  }
  
  /**
   * Check if user is a moderator
   */
  isModerator(): boolean {
    return RBACBridgeImpl.isModerator();
  }
  
  /**
   * Check if user is a builder
   */
  isBuilder(): boolean {
    return RBACBridgeImpl.isBuilder();
  }
  
  /**
   * Get all user roles
   */
  getRoles(): UserRole[] {
    return RBACBridgeImpl.getRoles();
  }
  
  /**
   * Set user roles
   */
  setRoles(roles: UserRole[]): void {
    return RBACBridgeImpl.setRoles(roles);
  }
  
  /**
   * Clear user roles
   */
  clearRoles(): void {
    return RBACBridgeImpl.clearRoles();
  }
  
  /**
   * Check if user can access a specific route
   */
  canAccessRoute(route: string): boolean {
    return RBACBridgeImpl.canAccessRoute(route);
  }
  
  /**
   * Check if user can access admin section
   */
  canAccessAdminSection(section: string): boolean {
    return RBACBridgeImpl.canAccessAdminSection(section);
  }
}

// Create singleton instance
export const RBACBridge = new RBACBridgeExport();
export default RBACBridge;
