
import { useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { UserRole } from '@/auth/types/auth.types';

// Define permission type
type Permission = 
  | 'view_admin_panel' 
  | 'manage_users' 
  | 'manage_content'
  | 'manage_settings'
  | 'manage_themes'
  | 'manage_plugins'
  | 'view_analytics'
  | 'manage_roles';

// Define role-permission mapping
const rolePermissions: Record<UserRole, Permission[]> = {
  'super_admin': [
    'view_admin_panel',
    'manage_users',
    'manage_content',
    'manage_settings',
    'manage_themes',
    'manage_plugins',
    'view_analytics',
    'manage_roles'
  ],
  'admin': [
    'view_admin_panel',
    'manage_users',
    'manage_content',
    'manage_settings',
    'manage_themes',
    'view_analytics'
  ],
  'editor': [
    'view_admin_panel',
    'manage_content',
    'view_analytics'
  ],
  'moderator': [
    'view_admin_panel',
    'manage_content',
    'view_analytics'
  ],
  'user': [],
  'maker': [
    'view_admin_panel',
    'manage_content'
  ],
  'builder': [
    'view_admin_panel'
  ]
};

/**
 * Hook to check if the current user has specific permissions
 */
export function useAdminPermissions() {
  const { roles } = useAuth();
  
  const permissions = useMemo(() => {
    const allPermissions = new Set<Permission>();
    
    // Add permissions for each role the user has
    roles.forEach(role => {
      const perms = rolePermissions[role] || [];
      perms.forEach(permission => allPermissions.add(permission));
    });
    
    return Array.from(allPermissions);
  }, [roles]);
  
  /**
   * Check if user has specific permission
   */
  const hasPermission = (permission: Permission): boolean => {
    return permissions.includes(permission);
  };
  
  /**
   * Check if user has all specified permissions
   */
  const hasAllPermissions = (requiredPermissions: Permission[]): boolean => {
    return requiredPermissions.every(p => permissions.includes(p));
  };
  
  /**
   * Check if user has any of the specified permissions
   */
  const hasAnyPermission = (requiredPermissions: Permission[]): boolean => {
    return requiredPermissions.some(p => permissions.includes(p));
  };
  
  return {
    permissions,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission
  };
}
