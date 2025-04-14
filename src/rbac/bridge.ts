
import { UserRole, Permission } from '@/shared/types/shared.types';
import { hasPermission, canAccessAdmin, canAccessDevFeatures } from './rbac/enforce';
import { canAccessAdminSection, getHighestRole } from './rbac/rbac';

/**
 * RBAC Bridge Implementation
 * 
 * This is an implementation of the RBAC interface that
 * provides role-based access control functionality.
 */
class RBACBridgeImpl {
  private userRoles: UserRole[] = [];

  /**
   * Get the current user roles
   */
  getRoles(): UserRole[] {
    return [...this.userRoles];
  }

  /**
   * Set user roles
   */
  setRoles(roles: UserRole[]): void {
    this.userRoles = [...roles];
  }

  /**
   * Clear user roles
   */
  clearRoles(): void {
    this.userRoles = [];
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: UserRole | UserRole[]): boolean {
    if (Array.isArray(role)) {
      return role.some(r => this.userRoles.includes(r));
    }
    return this.userRoles.includes(role);
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(permission: Permission): boolean {
    return hasPermission(this.userRoles, permission);
  }

  /**
   * Check if user can perform an action (alias for hasPermission)
   */
  can(permission: Permission): boolean {
    return this.hasPermission(permission);
  }

  /**
   * Check if user has admin access
   */
  hasAdminAccess(): boolean {
    return canAccessAdmin(this.userRoles);
  }

  /**
   * Check if user is a super admin
   */
  isSuperAdmin(): boolean {
    return this.hasRole('super_admin');
  }

  /**
   * Check if user is a moderator
   */
  isModerator(): boolean {
    return this.hasRole(['moderator', 'admin', 'super_admin']);
  }

  /**
   * Check if user is a builder
   */
  isBuilder(): boolean {
    return this.hasRole(['builder', 'admin', 'super_admin']);
  }

  /**
   * Check if user is an admin
   */
  isAdmin(): boolean {
    return this.hasRole(['admin', 'super_admin']);
  }

  /**
   * Check if user can access an admin section
   */
  canAccessAdminSection(section: string): boolean {
    return canAccessAdminSection(this.userRoles, section);
  }

  /**
   * Check if user can access a specific route
   */
  canAccessRoute(route: string): boolean {
    // Super admin can access everything
    if (this.isSuperAdmin()) return true;

    // For now, we'll just check if the user can access admin routes
    if (route.startsWith('/admin')) {
      return this.hasAdminAccess();
    }

    // All other routes are accessible by default
    return true;
  }
}

// Create and export a singleton instance
export const RBACBridge = new RBACBridgeImpl();
