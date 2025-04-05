
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/auth/hooks/useAuth';
import { AuthStatus } from '@/auth/types/auth.types';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging/types';

interface AuthProviderProps {
  children: React.ReactNode;
  onInitialized?: () => Promise<void>;
}

export function AuthProvider({ children, onInitialized }: AuthProviderProps) {
  const { user, isLoading, status, initialized, initialize } = useAuth();
  const [initializationAttempted, setInitializationAttempted] = useState(false);
  const [timeoutElapsed, setTimeoutElapsed] = useState(false);
  const logger = useLogger('AuthProvider', { category: LogCategory.AUTHENTICATION });
  
  useEffect(() => {
    logger.info('Auth provider mounted');
    
    // Set a timeout to continue rendering the app after 2 seconds max
    const timeoutId = setTimeout(() => {
      logger.warn('Auth initialization timeout reached');
      setTimeoutElapsed(true);
    }, 2000);
    
    const initAuth = async () => {
      try {
        logger.info('Initializing auth state');
        setInitializationAttempted(true);
        await initialize();
        
        if (onInitialized) {
          await onInitialized();
        }
        
        logger.info('Auth state initialized');
      } catch (error) {
        logger.error('Failed to initialize auth state', { details: error });
      }
    };
    
    if (!initialized && !isLoading && !initializationAttempted) {
      initAuth();
    } else if (status === AuthStatus.AUTHENTICATED) {
      logger.info('User is already authenticated', { 
        details: { userId: user?.id } 
      });
    } else if (status === AuthStatus.UNAUTHENTICATED) {
      logger.info('User is not authenticated');
    }
    
    // Clear timeout on cleanup
    return () => clearTimeout(timeoutId);
  }, [initialize, initialized, isLoading, logger, onInitialized, status, user, initializationAttempted]);
  
  // Only show loading state for a short period to prevent blocking the app
  if (isLoading && !initialized && !timeoutElapsed) {
    return (
      <>
        {/* Minimal loading indicator that doesn't block the UI */}
        <div className="fixed top-2 right-2 z-50 animate-pulse p-2 bg-background/80 rounded-md text-xs">
          Loading auth...
        </div>
        {children}
      </>
    );
  }
  
  return <>{children}</>;
}
