
import { useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { UserRole } from '@/auth/types/auth.types';
import { AdminAccess } from '@/auth/types/auth.types';

/**
 * Hook to determine if current user has admin access
 * 
 * @returns {AdminAccess} Object with admin access info
 */
export function useAdminAccess(): AdminAccess {
  const { roles } = useAuth();
  
  return useMemo(() => {
    const isAdmin = roles.includes('admin') || roles.includes('super_admin');
    const hasEditorAccess = roles.includes('editor');
    const hasModeratorAccess = roles.includes('moderator');
    
    // User has admin access if they are an admin or have editor/moderator roles
    const hasAdminAccess = isAdmin || hasEditorAccess || hasModeratorAccess;
    
    return {
      isAdmin,
      hasAdminAccess
    };
  }, [roles]);
}
