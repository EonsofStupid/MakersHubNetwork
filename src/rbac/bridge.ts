
import { UserRole, ROLES, Permission } from '@/shared/types/shared.types';

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
    if (this.roles.includes(ROLES.SUPER_ADMIN)) return true;
    
    // Check for specific roles
    return rolesToCheck.some(r => this.roles.includes(r));
  }

  public hasAdminAccess(): boolean {
    return this.hasRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]);
  }

  public isSuperAdmin(): boolean {
    return this.hasRole(ROLES.SUPER_ADMIN);
  }

  public isModerator(): boolean {
    return this.hasRole([ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN]);
  }

  public isBuilder(): boolean {
    return this.hasRole([ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPER_ADMIN]);
  }

  // Route and section access
  public canAccessAdminSection(section: string): boolean {
    // Super admin can access all sections
    if (this.isSuperAdmin()) return true;
    
    // Define section permissions
    const sectionPermissions: Record<string, UserRole[]> = {
      dashboard: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
      users: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
      content: [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MODERATOR],
      settings: [ROLES.SUPER_ADMIN]
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
    if (this.hasRole(ROLES.SUPER_ADMIN)) return ROLES.SUPER_ADMIN;
    if (this.hasRole(ROLES.ADMIN)) return ROLES.ADMIN;
    if (this.hasRole(ROLES.MODERATOR)) return ROLES.MODERATOR;
    if (this.hasRole(ROLES.BUILDER)) return ROLES.BUILDER;
    return ROLES.USER;
  }

  public can(permission: string): boolean {
    return this.hasPermission(permission);
  }
}

// Create a singleton instance
export const RBACBridge = new RBACBridgeImpl();
