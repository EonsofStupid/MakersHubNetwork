
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { authBridge } from '@/bridges/AuthBridge';
import { ADMIN_PERMISSIONS } from '@/admin/constants/permissions';
import { UserRole } from '@/shared/types';

export function useAdminRoles() {
  const [adminRoles, setAdminRoles] = useState<UserRole[]>([]);
  const { roles } = useAuthStore();

  useEffect(() => {
    // Filter only admin roles
    const filterAdminRoles = () => {
      const adminRoleList = roles.filter(role => 
        role === 'admin' || role === 'superadmin' || role === 'moderator'
      ) as UserRole[];
      
      setAdminRoles(adminRoleList);
    };

    filterAdminRoles();

    // Subscribe to auth events
    const unsubscribe = authBridge.subscribeToEvent('AUTH_STATE_CHANGE', () => {
      filterAdminRoles();
    });

    return () => {
      unsubscribe();
    };
  }, [roles]);

  const hasAdminPermission = (permission: string) => {
    if (adminRoles.includes('superadmin')) return true;
    
    // Check specific permissions based on roles
    switch (permission) {
      case ADMIN_PERMISSIONS.VIEW_ADMIN_PANEL:
        return adminRoles.length > 0;
      case ADMIN_PERMISSIONS.MANAGE_USERS:
        return adminRoles.includes('admin') || adminRoles.includes('moderator');
      case ADMIN_PERMISSIONS.MANAGE_CONTENT:
        return adminRoles.includes('admin') || adminRoles.includes('moderator');
      case ADMIN_PERMISSIONS.MANAGE_SETTINGS:
        return adminRoles.includes('admin');
      default:
        return false;
    }
  };

  return {
    adminRoles,
    hasAdminPermission,
    isSuperAdmin: adminRoles.includes('superadmin'),
    isAdmin: adminRoles.includes('admin'),
    isModerator: adminRoles.includes('moderator')
  };
}
