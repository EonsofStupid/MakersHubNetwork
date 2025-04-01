
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth/store';
import { useAdminRoles } from './useAdminRoles';

/**
 * Hook to check if user has admin access
 */
export function useAdminAccess() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const { status, user } = useAuthStore();
  const { isAdmin, isSuperAdmin } = useAdminRoles();
  const isAuthenticated = status === 'authenticated' && !!user;
  
  // Initialize admin access
  const initializeAdmin = () => {
    // Could add more initialization logic here if needed
    console.log("Admin access initialized");
  };
  
  useEffect(() => {
    const checkAccess = async () => {
      setIsLoading(true);
      
      // Only proceed if user is authenticated
      if (isAuthenticated) {
        setHasAdminAccess(isAdmin || isSuperAdmin);
      } else {
        setHasAdminAccess(false);
      }
      
      setIsLoading(false);
    };
    
    checkAccess();
  }, [isAuthenticated, isAdmin, isSuperAdmin]);
  
  return {
    isLoading,
    hasAdminAccess,
    isAuthenticated,
    initializeAdmin
  };
}
