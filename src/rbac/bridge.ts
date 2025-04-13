
import { UserRole } from '@/shared/types/shared.types';
import * as rbac from '@/auth/rbac/rbac';

/**
 * RBAC Bridge Implementation
 * Provides a clean abstraction for role-based access control
 */
class RBACBridgeImpl {
  private roles: UserRole[] = [];

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

  // Admin section access
  public canAccessAdminSection(section: string): boolean {
    return rbac.canAccessAdminSection(this.roles, section);
  }

  // Helper methods
  public getHighestRole(): UserRole {
    return rbac.getHighestRole(this.roles);
  }
}

// Create a singleton instance
export const RBACBridge = new RBACBridgeImpl();
