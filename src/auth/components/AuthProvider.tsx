
import React, { useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider Component
 * 
 * Initializes authentication state and provides auth context
 * This is the top-level auth component to be used in App or routes
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const initialize = useAuthStore(state => state.initialize);
  const initialized = useAuthStore(state => state.initialized);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const status = useAuthStore(state => state.status);
  const logger = useLogger('AuthProvider', LogCategory.AUTH);

  // Initialize auth on mount
  useEffect(() => {
    if (initialized) return;
    
    logger.info('Initializing auth provider');
    
    initialize()
      .then(() => {
        logger.info('Auth provider initialized', {
          details: { status: useAuthStore.getState().status }
        });
      })
      .catch(error => {
        logger.error('Error initializing auth provider', {
          details: { error }
        });
      });
  }, [initialize, initialized, logger]);

  useEffect(() => {
    logger.debug('Auth state updated', {
      details: { isAuthenticated, status, initialized }
    });
  }, [isAuthenticated, status, initialized, logger]);

  // Return children, no additional context needed as we're using Zustand
  return <>{children}</>;
}
