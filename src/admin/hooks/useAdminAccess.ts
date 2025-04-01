
import { useCallback, useEffect, useState } from 'react';
import { useAuthSelector } from '@/store/slices/auth/auth.selector';
import { useAuthStore } from '@/store/slices/auth/auth.slice';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export function useAdminAccess() {
  const [hasAdminAccess, setHasAdminAccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { roles, isAuthenticated } = useAuthSelector();
  const { fetchUserRoles } = useAuthStore();
  const { getCurrentUser } = useSupabaseAuth();
  
  useEffect(() => {
    // Check if user has admin or super_admin role
    const adminRoles = roles.filter(role => role === 'admin' || role === 'super_admin');
    setHasAdminAccess(adminRoles.length > 0);
    setIsLoading(false);
  }, [roles]);
  
  // Initialize admin data
  const initializeAdmin = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        await fetchUserRoles();
      }
    } catch (error) {
      console.error("Error initializing admin access:", error);
    }
  }, [getCurrentUser, fetchUserRoles]);

  return {
    hasAdminAccess,
    isLoading,
    isAuthenticated,
    initializeAdmin
  };
}
