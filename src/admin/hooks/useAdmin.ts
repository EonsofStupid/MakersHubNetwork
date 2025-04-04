
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
  const { isLoading: storeLoading, dashboardData, theme } = useAdminStore();
  const { hasPermission, permissions, isLoading: permissionsLoading } = useAdminPermissions();
  const { isAdmin, isSuperAdmin } = useAdminRoles();
  const logger = useLogger('useAdmin', { category: LogCategory.ADMIN });
  
  // Get environment mode from process.env
  const isDevMode = process.env.NODE_ENV === 'development';
  
  logger.debug('Admin hook initialized', {
    details: {
      isAdmin,
      isSuperAdmin,
      permissionsCount: permissions.length,
      isDevMode
    }
  });
  
  return {
    isAdmin,
    isSuperAdmin,
    hasPermission,
    permissions,
    isLoading: storeLoading || permissionsLoading,
    dashboardData,
    theme,
    isDevMode
  };
}
