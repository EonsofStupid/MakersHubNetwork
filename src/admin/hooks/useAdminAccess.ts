
import { useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';

/**
 * Hook to check admin access permissions
 */
export function useAdminAccess() {
  const { roles, user, status, isLoading } = useAuth();
  
  const adminAccess = useMemo(() => {
    const isAdmin = roles.includes('admin') || roles.includes('super_admin');
    const hasAdminAccess = isAdmin;
    const isAuthenticated = !!user;
    
    return {
      isAdmin,
      hasAdminAccess,
      isLoading,
      isAuthenticated
    };
  }, [roles, user, isLoading]);

  return adminAccess;
}
