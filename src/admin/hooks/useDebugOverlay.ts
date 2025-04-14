
import { useState, useCallback } from 'react';
import { RBACBridge } from '@/rbac/bridge';
import { useLogger } from '@/logging/hooks/use-logger';
import { LOG_CATEGORY } from '@/shared/types/shared.types';

export function useDebugOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const hasSuperAdminAccess = RBACBridge.isSuperAdmin();
  const logger = useLogger('DebugOverlay', LOG_CATEGORY.ADMIN);

  const toggleOverlay = useCallback(() => {
    if (hasSuperAdminAccess) {
      setIsVisible(!isVisible);
      logger.info(`Debug overlay ${!isVisible ? 'shown' : 'hidden'}`);
    }
  }, [hasSuperAdminAccess, isVisible, logger]);

  return {
    isVisible,
    toggleOverlay,
    hasAccess: hasSuperAdminAccess
  };
}
