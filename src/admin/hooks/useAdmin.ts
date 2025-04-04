
import { useAdminStore } from '../store/admin.store';
import { useAdminPermissions } from './useAdminPermissions';
import { useAdminRoles } from './useAdminRoles';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging/types';

/**
 * Central hook for admin functionality
 * Combines permissions, roles, and other admin-specific functionality
 */
export function useAdmin() {
  const { sidebarExpanded, dashboardCollapsed, permissions, isLoadingPermissions } = useAdminStore();
  const { hasPermission } = useAdminPermissions();
  const { isAdmin, isSuperAdmin } = useAdminRoles();
  const logger = useLogger('useAdmin', { category: LogCategory.ADMIN });
  
  // Get environment mode from process.env
  const isDevMode = process.env.NODE_ENV === 'development';
  
  logger.debug('Admin hook initialized', {
    details: {
      isAdmin,
      isSuperAdmin,
      permissionsCount: permissions?.length || 0,
      isDevMode
    }
  });
  
  return {
    isAdmin,
    isSuperAdmin,
    hasPermission,
    permissions: permissions || [],
    isLoading: isLoadingPermissions,
    dashboardData: null, // Placeholder until we implement dashboard data
    theme: null, // Placeholder until we implement theme
    isDevMode
  };
}
