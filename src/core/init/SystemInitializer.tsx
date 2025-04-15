
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { useInitStore } from '@/shared/stores/init/initStore';
import { CyberLoadingScreen } from '@/shared/ui/loading/CyberLoadingScreen';
import { useLogger } from '@/logging/hooks/use-logger';
import { LogCategory, LogLevel } from '@/shared/types/shared.types';
import { logBridge } from '@/logging/bridge';
import { RBACBridge } from '@/rbac/bridge';

interface SystemInitializerProps {
  children: React.ReactNode;
}

export function SystemInitializer({ children }: SystemInitializerProps) {
  const logger = useLogger('SystemInitializer', LogCategory.SYSTEM);
  const { initialize: initAuth, isAuthenticated, roles } = useAuthStore();
  const { 
    isInitializing,
    progress,
    error,
    initPhase,
    startInit,
    setProgress,
    setError,
    completeInit,
  } = useInitStore();
  
  const [errorRecoveryAttempt, setErrorRecoveryAttempt] = useState(0);

  // Initialize system components in sequence
  useEffect(() => {
    const initSystem = async () => {
      try {
        startInit();
        logger.info('Starting robust system initialization sequence');
        
        // Phase 1: Configure logging system
        setProgress(10, 'Configuring logging system');
        await configureLogging();
        
        // Phase 2: Initialize core services
        setProgress(20, 'Initializing core services');
        await new Promise(resolve => setTimeout(resolve, 50)); // Small delay for visual feedback
        
        // Phase 3: Initialize authentication
        setProgress(40, 'Setting up authentication');
        await initAuth();
        
        // Phase 4: Initialize RBAC if user is authenticated
        setProgress(60, 'Configuring role-based access control');
        if (isAuthenticated && roles?.length > 0) {
          RBACBridge.setRoles(roles);
          logger.info('RBAC roles configured', { roles });
        }
        
        // Phase 5: Final initialization steps
        setProgress(80, 'Loading application components');
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for visual feedback
        
        // System ready
        logger.info('System initialization complete');
        completeInit();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('System initialization failed');
        logger.error('Critical failure during system initialization', { 
          error: error.message, 
          stack: error.stack,
          attempt: errorRecoveryAttempt + 1
        });
        
        setError(error);
      }
    };

    initSystem();
  }, [errorRecoveryAttempt]);

  // Configure logging system
  const configureLogging = async () => {
    // Enable console transport for immediate feedback
    logger.debug('Configuring logging system');
    
    // This is where you would configure any additional logging transports
    return Promise.resolve();
  };

  // Handle retry after error
  const handleRetry = () => {
    logger.info('Attempting system initialization recovery', {
      previousError: error?.message,
      attemptNumber: errorRecoveryAttempt + 1
    });
    setErrorRecoveryAttempt(prev => prev + 1);
  };

  // Show error state with retry option
  if (error) {
    return (
      <CyberLoadingScreen 
        message="System Initialization Error"
        subMessage={`${error.message} - Check logs for details`}
        progress={progress}
        errorDetails={error}
        onRetry={handleRetry}
        showConsoleToggle={true}
      />
    );
  }

  // Show loading state during initialization
  if (isInitializing) {
    return (
      <CyberLoadingScreen 
        message="Initializing System"
        subMessage={initPhase || "Loading core components..."}
        progress={progress}
        showConsoleToggle={true}
      />
    );
  }

  // System is ready - render children
  return <>{children}</>;
}
