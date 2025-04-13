
import { UserRole, ROLES, LogCategory, LogLevel } from '@/shared/types/shared.types';
import { logger } from '@/logging/logger.service';

/**
 * RBAC Bridge implementation
 * Provides a clean abstraction layer for role-based access control
 */
class RBACBridgeImpl {
  private loggerSource = 'RBACBridge';
  private roles: UserRole[] = [];

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
    // Get roles from storage, default to empty array
    const storageRoles = this.getRolesFromStorage();
    return storageRoles.length > 0 ? storageRoles : this.roles;
  }

  /**
   * Set user roles
   */
  setRoles(roles: UserRole[]): void {
    try {
      this.roles = roles;
      // Store roles in session storage
      sessionStorage.setItem('user_roles', JSON.stringify(roles));
      logger.log(LogLevel.INFO, LogCategory.RBAC, 'User roles set', { 
        details: { roles },
        source: this.loggerSource
      });
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.RBAC, 'Failed to set roles in storage', { 
        details: { error },
        source: this.loggerSource
      });
    }
  }

  /**
   * Clear user roles
   */
  clearRoles(): void {
    try {
      this.roles = [];
      sessionStorage.removeItem('user_roles');
      logger.log(LogLevel.INFO, LogCategory.RBAC, 'User roles cleared', {
        source: this.loggerSource
      });
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.RBAC, 'Failed to clear roles from storage', { 
        details: { error },
        source: this.loggerSource
      });
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
      
      // Default role if no roles found
      return [];
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.RBAC, 'Failed to parse roles from storage', { 
        details: { error },
        source: this.loggerSource
      });
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
    // For now, we'll just check if the user is a super_admin
    return this.isSuperAdmin();
  }

  /**
   * Check if user can access a specific route
   */
  canAccessRoute(path: string): boolean {
    const PATH_POLICIES: Record<string, UserRole[]> = {
      '/admin': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
      '/admin/users': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
      '/admin/roles': [ROLES.SUPER_ADMIN],
      '/admin/permissions': [ROLES.SUPER_ADMIN],
      '/admin/keys': [ROLES.SUPER_ADMIN],
      '/admin/analytics': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
      '/projects/create': [ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPER_ADMIN],
      '/projects/edit': [ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPER_ADMIN],
      '/projects/delete': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
    };
    
    // Get the most specific policy for the path
    const policyPaths = Object.keys(PATH_POLICIES).sort((a, b) => b.length - a.length);
    const matchedPath = policyPaths.find(p => path.startsWith(p));
    
    if (!matchedPath) return true; // No policy, allow access
    
    const allowedRoles = PATH_POLICIES[matchedPath];
    return this.hasRole(allowedRoles);
  }

  /**
   * Check if user is an admin
   */
  isAdmin(): boolean {
    return this.hasRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]);
  }

  /**
   * Check if user can perform an action
   */
  can(permission: string): boolean {
    return this.hasPermission(permission);
  }
}

// Export a singleton instance
export const RBACBridge = new RBACBridgeImpl();
