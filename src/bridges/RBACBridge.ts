
import { UserRole, ROLES } from '@/shared/types/core/auth.types';
import { IRBACBridge } from '@/shared/types/core/rbac.types';

class RBACBridgeClass implements IRBACBridge {
  private roles: UserRole[] = [];

  setRoles(roles: UserRole[]): void {
    this.roles = [...roles];
  }

  clearRoles(): void {
    this.roles = [];
  }

  getRoles(): UserRole[] {
    return [...this.roles];
  }

  hasRole(roleOrRoles: UserRole | UserRole[]): boolean {
    const rolesToCheck = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];
    return this.roles.some(role => rolesToCheck.includes(role));
  }

  hasAdminAccess(): boolean {
    return this.hasRole([ROLES.admin, ROLES.super_admin]);
  }

  isSuperAdmin(): boolean {
    return this.hasRole(ROLES.super_admin);
  }

  isModerator(): boolean {
    return this.hasRole(ROLES.moderator);
  }

  isBuilder(): boolean {
    return this.hasRole(ROLES.builder);
  }

  hasPermission(permission: string): boolean {
    if (this.isSuperAdmin()) return true;
    if (permission === 'create' && this.isBuilder()) return true;
    if (permission === 'read') return true;
    if (permission === 'update' && this.hasAdminAccess()) return true;
    if (permission === 'delete' && this.hasAdminAccess()) return true;
    if (permission === 'admin' && this.hasAdminAccess()) return true;
    return false;
  }
  
  canAccessAdminSection(section?: string): boolean {
    return this.hasAdminAccess();
  }
}

export const RBACBridge = new RBACBridgeClass();
