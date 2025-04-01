
import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/stores/auth/store';
import { ADMIN_PERMISSIONS, ROLE_PERMISSIONS } from '@/admin/constants/permissions';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { AdminPermissionValue } from '@/admin/types/permissions';

export function useAdminPermissions() {
  const user = useAuthStore(state => state.user);
  const roles = useAuthStore(state => state.roles || []);
  const [permissions, setPermissions] = useState<AdminPermissionValue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const logger = useLogger('useAdminPermissions', LogCategory.ADMIN);

  // Fetch and set permissions based on user roles
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        if (!user) {
          setPermissions([]);
          setIsLoading(false);
          return;
        }

        // Get all permissions from the user's roles
        const userPermissions: AdminPermissionValue[] = [];
        
        roles.forEach(role => {
          const rolePermissions = ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS];
          if (rolePermissions) {
            rolePermissions.forEach(permission => {
              if (!userPermissions.includes(permission)) {
                userPermissions.push(permission);
              }
            });
          }
        });

        setPermissions(userPermissions);
        logger.info('User permissions loaded', { 
          details: { 
            userId: user.id,
            roles,
            permissionsCount: userPermissions.length 
          } 
        });
      } catch (error) {
        logger.error('Error loading user permissions', { 
          details: { error } 
        });
        setPermissions([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Always run this effect when roles change
    fetchPermissions();
  }, [user, roles, logger]);

  // Memoize the hasPermission function to prevent unnecessary re-renders
  const hasPermission = useMemo(() => {
    return (permission: AdminPermissionValue): boolean => {
      return permissions.includes(permission);
    };
  }, [permissions]);

  return {
    permissions,
    hasPermission,
    isLoading
  };
}
