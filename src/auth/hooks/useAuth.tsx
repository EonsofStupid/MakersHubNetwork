
import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/auth.store';
import { User, Session, AuthStatus, UserRole } from '../types/auth.types';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { formatLogDetails } from '@/logging/utils/details-formatter';

/**
 * React hook for working with authentication
 * Provides access to the user, session, and authentication status
 */
export function useAuth() {
  const {
    user,
    session,
    roles,
    status,
    error,
    isLoading,
    initialized,
    signIn,
    signOut,
    initialize
  } = useAuthStore();
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const logger = useLogger('useAuth', { category: LogCategory.AUTH });
  
  // Check if user is authenticated
  useEffect(() => {
    const authenticated = status === 'authenticated' && !!user;
    setIsAuthenticated(authenticated);
    
    if (authenticated) {
      logger.debug('User is authenticated', { 
        details: { userId: user?.id, roles }
      });
    }
  }, [status, user, roles, logger]);
  
  // Initialize auth on mount if not already initialized
  useEffect(() => {
    const initAuth = async () => {
      if (!initialized) {
        try {
          logger.info('Initializing auth');
          await initialize();
        } catch (error) {
          logger.error('Error initializing auth', {
            details: formatLogDetails(error)
          });
        }
      }
    };
    
    initAuth();
  }, [initialized, initialize, logger]);
  
  // Custom sign in with error handling
  const handleSignIn = useCallback(async (email: string, password: string) => {
    try {
      logger.info('Signing in user');
      return await signIn(email, password);
    } catch (error) {
      logger.error('Sign in error', {
        details: formatLogDetails(error)
      });
      throw error;
    }
  }, [signIn, logger]);
  
  // Custom sign out with error handling
  const handleSignOut = useCallback(async () => {
    try {
      logger.info('Signing out user');
      return await signOut();
    } catch (error) {
      logger.error('Sign out error', {
        details: formatLogDetails(error)
      });
      throw error;
    }
  }, [signOut, logger]);
  
  return {
    user,
    session,
    roles,
    status,
    error,
    isLoading,
    isAuthenticated,
    initialized,
    signIn: handleSignIn,
    signOut: handleSignOut,
    initialize
  };
}
