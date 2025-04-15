
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { useInitStore } from '@/shared/stores/init/initStore';
import { CyberLoadingScreen } from '@/shared/ui/loading/CyberLoadingScreen';
import { useLogger } from '@/logging/hooks/use-logger';
import { LogCategory, LogLevel } from '@/shared/types/shared.types';
import { logBridge } from '@/logging/bridge';
import { RBACBridge } from '@/rbac/bridge';
import { useThemeStore } from '@/shared/store/theme/store';

interface SystemInitializerProps {
  children: React.ReactNode;
}

export function SystemInitializer({ children }: SystemInitializerProps) {
  const logger = useLogger('SystemInitializer', LogCategory.SYSTEM);
  const { initialize: initAuth, isAuthenticated, roles } = useAuthStore();
  const { isInitializing, progress, error, initPhase, startInit, setProgress, setError, completeInit } = useInitStore();
  const themeStore = useThemeStore();
  const [initAttempt, setInitAttempt] = useState(0);

  // Initialize system components in sequence
  useEffect(() => {
    let isMounted = true;

    const initSystem = async () => {
      if (!isMounted) return;
      
      try {
        startInit();
        logger.info('Starting robust system initialization sequence');
        
        // Phase 1: Configure logging system
        setProgress(10, 'Configuring logging system');
        await configureLogging();
        
        // Phase 2: Initialize theme system
        setProgress(30, 'Initializing theme system');
        await initializeTheme();
        
        // Phase 3: Initialize auth
        setProgress(60, 'Setting up authentication');
        await initAuth();
        
        // Phase 4: Initialize RBAC if user is authenticated
        setProgress(80, 'Configuring role-based access control');
        if (isAuthenticated && roles?.length > 0) {
          RBACBridge.setRoles(roles);
        }
        
        if (!isMounted) return;
        
        logger.info('System initialization complete');
        completeInit();
      } catch (err) {
        if (!isMounted) return;
        
        const error = err instanceof Error ? err : new Error('System initialization failed');
        logger.error('Critical failure during system initialization', { 
          error: error.message,
          stack: error.stack,
          attempt: initAttempt + 1
        });
        
        setError(error);
      }
    };

    initSystem();
    
    return () => {
      isMounted = false;
    };
  }, [initAttempt]);

  // Configure logging system
  const configureLogging = async () => {
    logger.debug('Configuring logging system');
    return Promise.resolve();
  };

  // Initialize theme system
  const initializeTheme = async () => {
    try {
      logger.debug('Initializing theme system');
      await themeStore.fetchThemes();
      themeStore.setActiveTheme('default');
      logger.info('Theme system initialized successfully');
    } catch (error) {
      logger.error('Theme initialization failed', { error });
      throw error;
    }
  };

  // Show error state with retry option
  if (error) {
    return (
      <CyberLoadingScreen 
        message="System Initialization Error"
        subMessage={`${error.message} - Check logs for details`}
        progress={progress}
        errorDetails={error}
        onRetry={() => setInitAttempt(prev => prev + 1)}
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
