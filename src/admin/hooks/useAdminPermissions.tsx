
import { useMemo } from 'react';
import { useAdminAccess } from './useAdminAccess';
import { UserRole } from '@/types/auth.unified';

export type Permission = 
  | 'dashboard:view'
  | 'users:view'
  | 'users:edit'
  | 'users:delete'
  | 'content:view'
  | 'content:edit'
  | 'content:publish'
  | 'settings:view'
  | 'settings:edit'
  | 'builds:view'
  | 'builds:approve'
  | 'builds:feature'
  | 'builds:delete';

/**
 * Hook to check admin permissions based on roles
 */
export function useAdminPermissions() {
  const { isAuthenticated, isAdmin } = useAdminAccess();
  
  const permissions = useMemo(() => {
    const permissionsByRole: Record<UserRole, Permission[]> = {
      'super_admin': [
        'dashboard:view', 'users:view', 'users:edit', 'users:delete', 
        'content:view', 'content:edit', 'content:publish',
        'settings:view', 'settings:edit',
        'builds:view', 'builds:approve', 'builds:feature', 'builds:delete'
      ],
      'admin': [
        'dashboard:view', 'users:view', 'users:edit',
        'content:view', 'content:edit', 'content:publish',
        'settings:view', 'settings:edit',
        'builds:view', 'builds:approve', 'builds:feature'
      ],
      'editor': [
        'dashboard:view', 'content:view', 'content:edit', 'content:publish',
        'builds:view', 'builds:approve'
      ],
      'moderator': [
        'dashboard:view', 'content:view', 'builds:view', 'builds:approve'
      ],
      'user': [],
      'guest': [],
      'maker': [
        'builds:view'
      ],
      'builder': [
        'builds:view'
      ]
    };
    return permissionsByRole;
  }, []);
  
  const hasPermission = (permission: Permission): boolean => {
    if (!isAuthenticated) return false;
    
    // Super admins have all permissions
    if (isAdmin) return true;
    
    // Check if user has the specific permission based on role
    // In a real app, you would check the user's roles from auth context
    return false;
  };
  
  return { hasPermission, permissions };
}
