
import { useEffect, useState } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useAuthStore } from '@/stores/auth/store';
import { ADMIN_PERMISSIONS } from '@/admin/constants/permissions';

export function useAdminAccess() {
  const authStatus = useAuthStore(state => state.status);
  const user = useAuthStore(state => state.user);
  const userRoles = useAuthStore(state => state.roles || []);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const logger = useLogger('useAdminAccess', LogCategory.ADMIN);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const isAuthenticated = authStatus === 'authenticated' && !!user;
        
        // User is an admin if they have either 'admin' or 'super_admin' role
        const isAdmin = userRoles.some(role => 
          role === 'admin' || role === 'super_admin'
        );
        
        setHasAdminAccess(isAuthenticated && isAdmin);
        setIsLoading(false);
        
        logger.info('Admin access check completed', { 
          details: { 
            isAuthenticated, 
            hasAdminAccess: isAuthenticated && isAdmin,
            roles: userRoles 
          } 
        });
      } catch (error) {
        logger.error('Error checking admin access', { 
          details: { error } 
        });
        setHasAdminAccess(false);
        setIsLoading(false);
      }
    };

    // Only run the check if auth status is determined
    if (authStatus !== 'loading') {
      checkAdminAccess();
    }
  }, [authStatus, user, userRoles, logger]);

  return {
    isAuthenticated: authStatus === 'authenticated' && !!user,
    hasAdminAccess,
    isLoading: authStatus === 'loading' || isLoading,
    user,
    roles: userRoles
  };
}
