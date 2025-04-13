
import { UserRole } from '@/shared/types/shared.types';

/**
 * RBAC Bridge interface
 * Provides a clean abstraction layer for role-based access control
 */
export interface RBACBridge {
  // Role check methods
  hasRole: (role: UserRole | UserRole[]) => boolean;
  getRoles: () => UserRole[];
  
  // Convenience access patterns
  hasAdminAccess: () => boolean;
  isSuperAdmin: () => boolean;
  isModerator: () => boolean;
  isBuilder: () => boolean;
  
  // Admin section access
  canAccessAdminSection: (section: string) => boolean;
}

// Simplified implementation for now, will be replaced with full implementation
class RBACBridgeImpl implements RBACBridge {
  private _roles: UserRole[] = [];
  
  // Set roles for the current user
  public setRoles(roles: UserRole[]): void {
    this._roles = roles;
  }
  
  // Clear roles
  public clearRoles(): void {
    this._roles = [];
  }
  
  // Get roles for the current user
  public getRoles(): UserRole[] {
    return this._roles;
  }
  
  // Check if user has a specific role
  public hasRole(role: UserRole | UserRole[]): boolean {
    // If no roles, return false
    if (this._roles.length === 0) return false;
    
    // Super admin has all roles
    if (this._roles.includes('superadmin')) return true;
    
    // Check for specific roles
    const rolesToCheck = Array.isArray(role) ? role : [role];
    return rolesToCheck.some(r => this._roles.includes(r));
  }
  
  // Check if user has admin access
  public hasAdminAccess(): boolean {
    return this.hasRole(['admin', 'superadmin']);
  }
  
  // Check if user is a super admin
  public isSuperAdmin(): boolean {
    return this.hasRole('superadmin');
  }
  
  // Check if user is a moderator
  public isModerator(): boolean {
    return this.hasRole(['moderator', 'admin', 'superadmin']);
  }
  
  // Check if user is a builder
  public isBuilder(): boolean {
    return this.hasRole(['builder', 'admin', 'superadmin']);
  }
  
  // Check if user can access a specific admin section
  public canAccessAdminSection(section: string): boolean {
    switch (section) {
      case 'dashboard':
        return this.hasAdminAccess();
      case 'users':
        return this.hasAdminAccess();
      case 'content':
        return this.hasAdminAccess();
      case 'settings':
        return this.isSuperAdmin();
      case 'system':
        return this.isSuperAdmin();
      default:
        return false;
    }
  }
}

export const RBACBridge = new RBACBridgeImpl();
