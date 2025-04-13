import { useState, useEffect } from 'react';
import { useAdminAccess } from './useAdminAccess';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';

export function useDebugOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const { hasSuperAdminAccess } = useAdminAccess();
  const logger = useLogger('DebugOverlay', LogCategory.ADMIN);

  useEffect(() => {
    if (hasSuperAdminAccess) {
      document.body.classList.add('debug-overlay-enabled');
      logger.info('Debug overlay enabled');
    } else {
      document.body.classList.remove('debug-overlay-enabled');
      setIsVisible(false);
      logger.info('Debug overlay disabled');
    }

    return () => {
      document.body.classList.remove('debug-overlay-enabled');
    };
  }, [hasSuperAdminAccess, logger]);

  const toggleOverlay = () => {
    if (hasSuperAdminAccess) {
      setIsVisible(!isVisible);
      logger.info(`Debug overlay ${!isVisible ? 'shown' : 'hidden'}`);
    }
  };

  return {
    isVisible,
    toggleOverlay,
    hasAccess: hasSuperAdminAccess
  };
} 