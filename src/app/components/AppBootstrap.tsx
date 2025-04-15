
import { useEffect } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory, LogLevel } from '@/shared/types/shared.types';

export function AppBootstrap() {
  const logger = useLogger('AppBootstrap', LogCategory.APP);

  useEffect(() => {
    logger.log(LogLevel.INFO, LogCategory.APP, 'Application bootstrapped');
  }, [logger]);

  return null;
}
