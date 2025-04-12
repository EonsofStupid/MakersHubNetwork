
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHasRole } from '@/auth/hooks/useHasRole';
import { useToast } from '@/shared/ui/use-toast';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory, UserRole } from '@/shared/types/shared.types';

/**
 * Hook to handle admin navigation with consistent checks
 */
export function useAdminNavigation() {
  const navigate = useNavigate();
  const { hasRole } = useHasRole();
  const { toast } = useToast();
  const logger = useLogger('AdminNavigation', LogCategory.ADMIN);

  /**
   * Check if the user has admin access
   */
  const hasAdminAccess = useCallback(() => {
    return hasRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]);
  }, [hasRole]);

  /**
   * Navigate to admin dashboard with permission check
   */
  const navigateToAdmin = useCallback(() => {
    if (hasAdminAccess()) {
      logger.info('Navigating to admin dashboard');
      navigate('/admin');
      return true;
    } else {
      logger.warn('Admin access denied');
      toast({
        title: 'Access Denied',
        description: 'You don\'t have permission to access the admin area',
        variant: 'destructive',
      });
      return false;
    }
  }, [navigate, hasAdminAccess, toast, logger]);

  return {
    navigateToAdmin,
    hasAdminAccess
  };
}
