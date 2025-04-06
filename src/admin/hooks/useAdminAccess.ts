
import { useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { UserRole } from '@/types/auth';
import { AdminAccess } from '@/types/auth';

/**
 * Hook to determine if current user has admin access
 * 
 * @returns {AdminAccess} Object with admin access info
 */
export function useAdminAccess(): AdminAccess {
  const { roles, isLoading, isAuthenticated } = useAuth();
  
  return useMemo(() => {
    const isAdmin = roles.includes('admin' as UserRole) || roles.includes('super_admin' as UserRole);
    const hasEditorAccess = roles.includes('editor' as UserRole);
    const hasModeratorAccess = roles.includes('moderator' as UserRole);
    
    // User has admin access if they are an admin or have editor/moderator roles
    const hasAdminAccess = isAdmin || hasEditorAccess || hasModeratorAccess;
    
    return {
      isAdmin,
      hasAdminAccess,
      isLoading,
      isAuthenticated
    };
  }, [roles, isLoading, isAuthenticated]);
}
