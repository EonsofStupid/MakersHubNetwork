
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
    return rbac.hasRole(this.roles, role);
  }

  public hasAdminAccess(): boolean {
    return rbac.hasAdminAccess(this.roles);
  }

  public isSuperAdmin(): boolean {
    return rbac.isSuperAdmin(this.roles);
  }

  public isModerator(): boolean {
    return rbac.isModerator(this.roles);
  }

  public isBuilder(): boolean {
    return rbac.isBuilder(this.roles);
  }

  // Route and section access
  public canAccessAdminSection(section: string): boolean {
    return rbac.canAccessAdminSection(this.roles, section);
  }

  public canAccessRoute(route: string): boolean {
    return this.hasAdminAccess(); // Default implementation, enhance as needed
  }

  public isAdmin(): boolean {
    return this.hasAdminAccess();
  }

  // Helper methods
  public getHighestRole(): UserRole {
    return rbac.getHighestRole(this.roles);
  }

  public can(permission: string): boolean {
    return this.hasPermission(permission);
  }
}

// Create a singleton instance
export const RBACBridge = new RBACBridgeImpl();
