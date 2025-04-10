
import React, { useEffect } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

interface AppInitializerProps {
  children: React.ReactNode;
}

export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const logger = useLogger('AppInitializer', LogCategory.SYSTEM);

  useEffect(() => {
    logger.info('Application initialized');
  }, [logger]);

  return <>{children}</>;
};
