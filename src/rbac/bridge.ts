
import { UserRole } from '@/shared/types/shared.types';
import * as rbac from '@/auth/rbac/rbac';

/**
 * RBAC Bridge Implementation
 * Provides a clean abstraction for role-based access control
 */
class RBACBridgeImpl {
  private roles: UserRole[] = [];
  private permissions: string[] = [];

  // Role management
  public setRoles(roles: UserRole[]): void {
    this.roles = roles;
  }

  public getRoles(): UserRole[] {
    return this.roles;
  }

  public clearRoles(): void {
    this.roles = [];
  }

  // Permission management
  public setPermissions(permissions: string[]): void {
    this.permissions = permissions;
  }

  public getPermissions(): string[] {
    return this.permissions;
  }

  public hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  // Role checks
  public hasRole(role: UserRole | UserRole[]): boolean {
    const rolesToCheck = Array.isArray(role) ? role : [role];
    
    // Super admin has all roles
    if (this.roles.includes('superadmin')) return true;
    
    // Check for specific roles
    return rolesToCheck.some(r => this.roles.includes(r));
  }

  public hasAdminAccess(): boolean {
    return this.hasRole(['admin', 'superadmin']);
  }

  public isSuperAdmin(): boolean {
    return this.hasRole('superadmin');
  }

  public isModerator(): boolean {
    return this.hasRole(['moderator', 'admin', 'superadmin']);
  }

  public isBuilder(): boolean {
    return this.hasRole(['builder', 'admin', 'superadmin']);
  }

  // Route and section access
  public canAccessAdminSection(section: string): boolean {
    // Super admin can access all sections
    if (this.isSuperAdmin()) return true;
    
    // Define section permissions
    const sectionPermissions: Record<string, UserRole[]> = {
      dashboard: ['admin', 'superadmin'],
      users: ['admin', 'superadmin'],
      content: ['admin', 'superadmin', 'moderator'],
      settings: ['superadmin']
    };
    
    const allowedRoles = sectionPermissions[section];
    if (!allowedRoles) return false;
    
    return this.hasRole(allowedRoles);
  }

  public canAccessRoute(route: string): boolean {
    return this.hasAdminAccess(); // Default implementation, enhance as needed
  }

  public isAdmin(): boolean {
    return this.hasAdminAccess();
  }

  // Helper methods
  public getHighestRole(): UserRole {
    if (this.hasRole('superadmin')) return 'superadmin';
    if (this.hasRole('admin')) return 'admin';
    if (this.hasRole('moderator')) return 'moderator';
    if (this.hasRole('builder')) return 'builder';
    return 'user';
  }

  public can(permission: string): boolean {
    return this.hasPermission(permission);
  }
}

// Create a singleton instance
export const RBACBridge = new RBACBridgeImpl();
