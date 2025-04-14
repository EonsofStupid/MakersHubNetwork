
import React from 'react';
import { RBACInitializer } from '@/rbac';
import { useLogger } from '@/logging/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';

interface AppInitializerProps {
  children: React.ReactNode;
}

/**
 * Application Initializer
 * Manages initialization of all core system services
 */
export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const logger = useLogger('AppInitializer', LogCategory.APP);
  
  logger.info('Application initializing');
  
  return (
    <>
      {/* Initialize RBAC system */}
      <RBACInitializer />
      
      {/* Render application */}
      {children}
    </>
  );
};

export default AppInitializer;
