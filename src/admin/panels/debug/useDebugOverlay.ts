
import { useState, useCallback } from 'react';
import { RBACBridge } from '@/rbac/bridge';
import { useLogger } from '@/logging/hooks/use-logger';
import { LogCategory } from '@/shared/types/core/logging.types';

export function useDebugOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const hasSuperAdminAccess = RBACBridge.isSuperAdmin();
  const logger = useLogger('DebugOverlay', LogCategory.ADMIN);

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
