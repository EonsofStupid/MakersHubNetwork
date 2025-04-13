
import React, { ReactNode, useEffect } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LOG_CATEGORY } from '@/shared/types/shared.types';
import { useAuthStore } from '@/auth/store/auth.store';

interface AppInitializerProps {
  children: ReactNode;
}

export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const logger = useLogger('AppInitializer', LOG_CATEGORY.SYSTEM);
  const initialize = useAuthStore(state => state.initialize);
  const initialized = useAuthStore(state => state.initialized);
  
  // Initialize app systems
  useEffect(() => {
    if (!initialized) {
      logger.info('Initializing app systems');
      initialize();
    }
  }, [initialize, initialized, logger]);
  
  // If not initialized yet, show loading state
  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Application</h1>
          <p className="text-muted-foreground">Initializing systems...</p>
        </div>
      </div>
    );
  }
  
  // Once initialized, render children
  return <>{children}</>;
};
