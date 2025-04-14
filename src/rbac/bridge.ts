
import { UserRole, Permission } from '@/shared/types/shared.types';

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
    // For now just check admin role, this could be expanded
    if (this.isSuperAdmin()) return true;
    if (this.isAdmin()) {
      // Admins have most permissions except super admin ones
      return true;
    }
    return false;
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
    return this.hasRole(['admin', 'super_admin']);
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
    // Super admin can access all sections
    if (this.isSuperAdmin()) return true;
    
    // Admin can access most sections
    if (this.isAdmin()) {
      // Except some reserved for super admin
      if (section === 'settings' || section === 'system') {
        return false;
      }
      return true;
    }
    
    return false;
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
