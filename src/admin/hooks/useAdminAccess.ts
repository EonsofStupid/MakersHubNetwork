
import { useAuthState } from '@/auth/hooks/useAuthState';
import { canAccessAdmin } from '@/auth/rbac/enforce';
import { useCallback } from 'react';

/**
 * Hook that provides information about admin access
 */
export function useAdminAccess() {
  const { roles, isLoading, isAuthenticated } = useAuthState();
  
  // Check if user has admin access based on roles
  const hasAdminAccess = canAccessAdmin(roles);
  
  // Function to initialize admin functionality if needed
  const initializeAdmin = useCallback(() => {
    // This function could later include more admin initialization logic
    // For now, it's just a placeholder
    console.log('Admin functionality initialized');
  }, []);
  
  return {
    hasAdminAccess,
    isLoading,
    isAuthenticated,
    initializeAdmin
  };
}
