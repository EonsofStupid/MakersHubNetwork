
import { UserRole, ROLES } from '@/shared/types/shared.types';

/**
 * RBACBridge - Simple bridge for role-based access control
 */
class RBACBridgeClass {
  private roles: UserRole[] = [];

  // Get user roles
  getRoles(): UserRole[] {
    return this.roles;
  }

  // Set user roles
  setRoles(roles: UserRole[]): void {
    this.roles = roles;
  }

  // Clear user roles
  clearRoles(): void {
    this.roles = [];
  }

  // Check if user has role
  hasRole(role: UserRole | UserRole[]): boolean {
    // If no roles defined, return true for now (no auth checks)
    return true;
  }

  // Check if user has admin access
  hasAdminAccess(): boolean {
    // Always return true for now (no auth checks)
    return true;
  }

  // Check if user is super admin
  isSuperAdmin(): boolean {
    // Always return true for now (no auth checks)
    return true;
  }
  
  // Check if user is moderator
  isModerator(): boolean {
    // Always return true for now (no auth checks)
    return true;
  }
  
  // Check if user is builder
  isBuilder(): boolean {
    // Always return true for now (no auth checks)
    return true;
  }
  
  // Check if user has permission
  hasPermission(permission: string): boolean {
    // Always return true for now (no auth checks)
    return true;
  }
  
  // Check if user can access admin section
  canAccessAdminSection(section: string): boolean {
    // Always return true for now (no auth checks)
    return true;
  }
}

export const RBACBridge = new RBACBridgeClass();
