
import { useAuthStore } from '@/auth/store/auth.store';
import { UserRole, ROLES, LogCategory } from '@/shared/types/shared.types';
import { useLogger } from '@/hooks/use-logger';

class RBACBridgeImpl {
  private logger = useLogger('RBACBridge', LogCategory.RBAC);

  /**
   * Check if user has the specified role(s)
   */
  hasRole(roleOrRoles: UserRole | UserRole[]): boolean {
    const userRoles = this.getRoles();
    
    // Super admin has access to everything
    if (userRoles.includes(ROLES.SUPER_ADMIN)) {
      return true;
    }
    
    // Convert single role to array for consistent handling
    const requiredRoles = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];
    
    // Check if user has any of the required roles
    return requiredRoles.some(role => userRoles.includes(role));
  }

  /**
   * Get all roles for the current user
   */
  getRoles(): UserRole[] {
    // Get roles from auth store if available, otherwise return empty array
    const state = useAuthStore.getState();
    const storageRoles = this.getRolesFromStorage();
    
    if (!state.isAuthenticated) {
      return [];
    }
    
    return storageRoles;
  }

  /**
   * Set user roles
   */
  setRoles(roles: UserRole[]): void {
    try {
      // Store roles in session storage
      sessionStorage.setItem('user_roles', JSON.stringify(roles));
      this.logger.info('User roles set', { details: { roles } });
    } catch (error) {
      this.logger.error('Failed to set roles in storage', { details: { error } });
    }
  }

  /**
   * Clear user roles
   */
  clearRoles(): void {
    try {
      sessionStorage.removeItem('user_roles');
      this.logger.info('User roles cleared');
    } catch (error) {
      this.logger.error('Failed to clear roles from storage', { details: { error } });
    }
  }

  /**
   * Get roles from storage (session/local storage)
   */
  private getRolesFromStorage(): UserRole[] {
    try {
      // Try to get roles from storage
      const rolesStr = sessionStorage.getItem('user_roles');
      if (rolesStr) {
        const roles = JSON.parse(rolesStr);
        if (Array.isArray(roles)) {
          return roles as UserRole[];
        }
      }
      
      // Default role if authenticated but no roles found
      if (useAuthStore.getState().isAuthenticated) {
        return [ROLES.USER];
      }
      
      return [];
    } catch (error) {
      this.logger.error('Failed to parse roles from storage', { details: { error } });
      return [];
    }
  }

  /**
   * Check if user has admin access
   */
  hasAdminAccess(): boolean {
    return this.hasRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]);
  }

  /**
   * Check if user is a super admin
   */
  isSuperAdmin(): boolean {
    return this.hasRole(ROLES.SUPER_ADMIN);
  }

  /**
   * Check if user is a moderator
   */
  isModerator(): boolean {
    return this.hasRole([ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN]);
  }

  /**
   * Check if user is a builder
   */
  isBuilder(): boolean {
    return this.hasRole([ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPER_ADMIN]);
  }

  /**
   * Check if user can access a specific admin section
   */
  canAccessAdminSection(section: string): boolean {
    // Basic section permission mapping
    const sectionPermissions: Record<string, UserRole[]> = {
      'dashboard': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
      'users': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
      'content': [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MODERATOR],
      'settings': [ROLES.SUPER_ADMIN],
    };

    const requiredRoles = sectionPermissions[section] || [ROLES.SUPER_ADMIN];
    return this.hasRole(requiredRoles);
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(permission: string): boolean {
    // In a real app, this would check against a permissions store
    // For now, we'll just check if the user is a super_admin
    return this.isSuperAdmin();
  }
}

// Export a singleton instance
export const RBACBridge = new RBACBridgeImpl();
