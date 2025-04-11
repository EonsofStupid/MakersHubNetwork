
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { PermissionValue, PERMISSIONS } from '@/auth/permissions';
import { mapRolesToPermissions } from '@/auth/rbac/roles';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { AuthBridge } from '@/bridges/AuthBridge';

/**
 * Hook to check admin permissions
 * Provides admin-specific permissions and management
 */
export function useAdminPermissions() {
  const [permissions, setPermissions] = useState<PermissionValue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const logger = useLogger('useAdminPermissions', LogCategory.ADMIN);
  
  // Get roles from auth store
  const roles = useAuthStore(state => state.roles);
  const isAdmin = AuthBridge.isAdmin();
  const isSuperAdmin = AuthBridge.isSuperAdmin();

  // Load permissions when roles change
  useEffect(() => {
    const loadPermissions = async () => {
      try {
        logger.info('Loading admin permissions', {
          details: { roles }
        });
        
        setIsLoading(true);
        
        // Map roles to permissions
        const mappedPermissions = mapRolesToPermissions(roles);
        
        // Super admins get all permissions
        const finalPermissions = isSuperAdmin
          ? Object.values(PERMISSIONS)
          : mappedPermissions;
        
        setPermissions(finalPermissions);
        
        logger.info('Admin permissions loaded', {
          details: { 
            permissionCount: finalPermissions.length,
            isSuperAdmin
          }
        });
      } catch (error) {
        logger.error('Failed to load admin permissions', {
          details: { error }
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    // Only load permissions for admin users
    if (isAdmin || isSuperAdmin) {
      loadPermissions();
    } else {
      setPermissions([]);
      setIsLoading(false);
    }
  }, [roles, isAdmin, isSuperAdmin, logger]);
  
  // Check if user has a specific permission
  const hasPermission = (permission: PermissionValue): boolean => {
    // Super admins have all permissions
    if (isSuperAdmin) {
      return true;
    }
    
    return permissions.includes(permission);
  };
  
  return {
    permissions,
    hasPermission,
    isLoading,
    isAdmin,
    isSuperAdmin
  };
}
