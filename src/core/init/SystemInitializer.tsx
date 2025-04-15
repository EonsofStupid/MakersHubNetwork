
import React, { useEffect } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { useInitStore } from '@/shared/stores/init/initStore';
import { CyberLoadingScreen } from '@/shared/ui/loading/CyberLoadingScreen';
import { useLogger } from '@/logging/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';

interface SystemInitializerProps {
  children: React.ReactNode;
}

export function SystemInitializer({ children }: SystemInitializerProps) {
  const logger = useLogger('SystemInitializer', LogCategory.SYSTEM);
  const { initialize: initAuth, isAuthenticated } = useAuthStore();
  const { 
    isInitializing,
    progress,
    error,
    startInit,
    setProgress,
    setError,
    completeInit,
  } = useInitStore();

  useEffect(() => {
    const initSystem = async () => {
      try {
        startInit();
        logger.info('Starting system initialization');
        
        // Initialize core systems
        setProgress(20);
        await initAuth();
        setProgress(60);
        
        // Additional initialization steps can be added here
        await new Promise(resolve => setTimeout(resolve, 500)); // Ensure loading is visible
        
        logger.info('System initialization complete');
        completeInit();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('System initialization failed');
        logger.error('Failed to initialize system', { error });
        setError(error);
      }
    };

    initSystem();
  }, []);

  if (error) {
    return (
      <CyberLoadingScreen 
        message="System Initialization Error"
        subMessage={error.message}
        progress={progress}
      />
    );
  }

  if (isInitializing) {
    return (
      <CyberLoadingScreen 
        message="Initializing System"
        subMessage="Loading core components..."
        progress={progress}
      />
    );
  }

  return <>{children}</>;
}
