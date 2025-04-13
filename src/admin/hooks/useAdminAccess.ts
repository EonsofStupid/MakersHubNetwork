
import { useCallback } from 'react';
import { RBACBridge } from '@/rbac/bridge';
import { useLogger } from '@/logging/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';

/**
 * Hook for checking admin access permissions
 */
export function useAdminAccess() {
  const logger = useLogger('useAdminAccess', LogCategory.RBAC);
  
  // Check if user has admin access
  const hasAdminAccess = useCallback(() => {
    return RBACBridge.hasAdminAccess();
  }, []);
  
  // Check if user has super admin access
  const hasSuperAdminAccess = useCallback(() => {
    return RBACBridge.isSuperAdmin();
  }, []);
  
  // Check if user can access a specific admin section
  const canAccessSection = useCallback((section: string) => {
    const hasAccess = RBACBridge.canAccessAdminSection(section);
    logger.debug(`Access check for section ${section}`, {
      details: {
        section,
        hasAccess
      }
    });
    return hasAccess;
  }, [logger]);
  
  return {
    hasAdminAccess,
    hasSuperAdminAccess,
    canAccessSection
  };
}
