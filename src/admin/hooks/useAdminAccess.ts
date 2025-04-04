
import { useAuth } from '@/auth/hooks/useAuth';
import useAdmin from './useAdmin';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging/constants/log-level';

interface UseAdminAccessResult {
  hasAdminAccess: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Hook to check if a user has access to the admin panel
 */
export const useAdminAccess = (): UseAdminAccessResult => {
  const { user, isLoading: authLoading } = useAuth();
  const { isAdmin, isSuperAdmin, isModerator, isEditor, isLoading: adminLoading } = useAdmin();
  const logger = useLogger('useAdminAccess', { category: LogCategory.ADMIN });
  
  const isAuthenticated = !!user;
  const hasAdminAccess = isAdmin || isSuperAdmin || isModerator || isEditor;
  const isLoading = authLoading || adminLoading;
  
  return {
    hasAdminAccess,
    isAuthenticated,
    isLoading
  };
};

export default useAdminAccess;
