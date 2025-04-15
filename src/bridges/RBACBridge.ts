
import { UserRole } from '@/shared/types/shared.types';

/**
 * RBACBridge provides role-based access control functionality
 */
class RBACBridgeClass {
  private roles: UserRole[] = [];

  /**
   * Set user roles
   * @param roles Array of user roles
   */
  setRoles(roles: UserRole[]): void {
    this.roles = [...roles];
  }

  /**
   * Clear all user roles
   */
  clearRoles(): void {
    this.roles = [];
  }

  /**
   * Get current user roles
   * @returns Array of user roles
   */
  getRoles(): UserRole[] {
    return [...this.roles];
  }

  /**
   * Check if user has a specific role or any of the roles
   * @param roleOrRoles Single role or array of roles to check
   * @returns True if user has the role, false otherwise
   */
  hasRole(roleOrRoles: UserRole | UserRole[]): boolean {
    const rolesToCheck = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];
    return this.roles.some(role => rolesToCheck.includes(role));
  }

  /**
   * Check if user has admin access
   * @returns True if user has admin or super admin role
   */
  hasAdminAccess(): boolean {
    return this.hasRole(['ADMIN', 'SUPER_ADMIN']);
  }

  /**
   * Check if user is a super admin
   * @returns True if user has super admin role
   */
  isSuperAdmin(): boolean {
    return this.hasRole('SUPER_ADMIN');
  }

  /**
   * Check if user is a moderator
   * @returns True if user has moderator role
   */
  isModerator(): boolean {
    return this.hasRole('MODERATOR');
  }

  /**
   * Check if user is a builder
   * @returns True if user has builder role
   */
  isBuilder(): boolean {
    return this.hasRole('BUILDER');
  }

  /**
   * Check if user has a specific permission
   * @param permission The permission to check
   * @returns True if user has the permission
   */
  hasPermission(permission: string): boolean {
    // Implement permission-based check
    // For now, simplify by using role-based permissions
    if (this.isSuperAdmin()) return true;
    if (permission === 'create' && this.isBuilder()) return true;
    if (permission === 'read') return true; // Everyone can read
    if (permission === 'update' && this.hasAdminAccess()) return true;
    if (permission === 'delete' && this.hasAdminAccess()) return true;
    if (permission === 'admin' && this.hasAdminAccess()) return true;
    
    return false;
  }
  
  /**
   * Check if user can access admin section
   * @param section Optional specific admin section
   * @returns True if user can access the admin section
   */
  canAccessAdminSection(section?: string): boolean {
    return this.hasAdminAccess();
  }
}

export const RBACBridge = new RBACBridgeClass();
