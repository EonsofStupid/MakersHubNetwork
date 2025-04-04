import { useAdmin } from '@/admin/hooks/useAdmin';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging/types';
import { PermissionValue } from '@/auth/permissions';

/**
 * Hook for checking admin permissions
 */
export function useAdminPermissions() {
  const { roles, hasRole, hasAnyRole } = useAdmin();
  const logger = useLogger('useAdminPermissions', { category: LogCategory.ADMIN });
  
  /**
   * Check if the user has a specific permission
   */
  const hasPermission = (permission: PermissionValue): boolean => {
    try {
      // Special case: if no permission is required, allow access
      if (!permission) return true;
      
      // If permission is a role check
      if (permission.startsWith('role:')) {
        const role = permission.replace('role:', '');
        return hasRole(role);
      }
      
      // For permissions like "admin:*"
      if (permission.endsWith(':*')) {
        const prefix = permission.split(':')[0];
        // Super admin and admin have access to all prefixed permissions
        if (hasAnyRole(['superadmin', 'admin'])) {
          return true;
        }
        
        // Check if user has any role with this prefix
        const prefixedRoles = roles.filter(role => role.startsWith(prefix));
        return prefixedRoles.length > 0;
      }
      
      // For specific feature permissions (to be implemented)
      // This is placeholder logic for now
      if (permission.includes(':')) {
        // If user is superadmin or admin, grant access
        if (hasAnyRole(['superadmin', 'admin'])) {
          return true;
        }
        
        // Other role-based permission checks could go here
        return false;
      }
      
      // Default deny for unknown permission formats
      logger.warn(`Unknown permission format: ${permission}`);
      return false;
      
    } catch (error) {
      logger.error('Error checking permission', { 
        details: { permission, error } 
      });
      return false;
    }
  };
  
  return {
    hasPermission
  };
}
