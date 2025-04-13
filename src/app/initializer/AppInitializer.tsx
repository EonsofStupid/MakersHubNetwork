
import React, { ReactNode, useEffect, useState } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { useLogger } from '@/hooks/use-logger';
import { Spinner } from '@/shared/ui/spinner';

interface AppInitializerProps {
  children: ReactNode;
}

export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const initialize = useAuthStore(state => state.initialize);
  const initialized = useAuthStore(state => state.initialized);
  const status = useAuthStore(state => state.status);
  const logger = useLogger('AppInitializer', 'system');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!initialized) {
      logger.info('Initializing application');
      
      const initApp = async () => {
        try {
          await initialize();
        } catch (error) {
          logger.error('Failed to initialize app', { error });
        } finally {
          setIsLoading(false);
        }
      };
      
      initApp();
    } else {
      setIsLoading(false);
    }
  }, [initialize, initialized, logger]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Spinner className="h-12 w-12" />
          <p className="text-lg font-medium">Loading application...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
