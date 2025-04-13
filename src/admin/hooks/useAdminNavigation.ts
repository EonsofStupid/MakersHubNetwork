
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authBridge } from '@/auth/bridge';

/**
 * Hook for handling admin navigation with role-based checks
 */
export function useAdminNavigation() {
  const navigate = useNavigate();

  /**
   * Check if user has admin access
   */
  const hasAdminAccess = useCallback(() => {
    return authBridge.hasRole(['admin', 'superadmin']);
  }, []);

  /**
   * Navigate to admin dashboard with role check
   */
  const navigateToAdmin = useCallback(() => {
    if (hasAdminAccess()) {
      navigate('/admin');
    } else {
      navigate('/admin/unauthorized');
    }
  }, [navigate, hasAdminAccess]);

  /**
   * Navigate to specific admin section with role check
   */
  const navigateToAdminSection = useCallback((section: string) => {
    if (hasAdminAccess()) {
      navigate(`/admin/${section}`);
    } else {
      navigate('/admin/unauthorized');
    }
  }, [navigate, hasAdminAccess]);

  return {
    navigateToAdmin,
    navigateToAdminSection,
    hasAdminAccess,
  };
}
