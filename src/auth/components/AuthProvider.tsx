
import { useEffect } from 'react';
import { useAuth } from '@/auth/hooks/useAuth';
import { AuthStatus } from '@/auth/types/auth.types';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/constants/logLevel';

interface AuthProviderProps {
  children: React.ReactNode;
  onInitialized?: () => Promise<void>;
}

export function AuthProvider({ children, onInitialized }: AuthProviderProps) {
  const { user, isLoading, status, initialized, initialize } = useAuth();
  const logger = useLogger('AuthProvider', { category: LogCategory.AUTH });
  
  useEffect(() => {
    logger.info('Auth provider mounted');
    
    const initAuth = async () => {
      try {
        logger.info('Initializing auth state');
        await initialize();
        
        if (onInitialized) {
          await onInitialized();
        }
        
        logger.info('Auth state initialized');
      } catch (error) {
        logger.error('Failed to initialize auth state', { details: error });
      }
    };
    
    if (!initialized && !isLoading) {
      initAuth();
    } else if (status === AuthStatus.AUTHENTICATED) {
      logger.info('User is already authenticated', { 
        details: { userId: user?.id } 
      });
    } else if (status === AuthStatus.UNAUTHENTICATED) {
      logger.info('User is not authenticated');
    }
  }, [initialize, initialized, isLoading, logger, onInitialized, status, user]);
  
  if (isLoading && !initialized) {
    // Initial loading state
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading authentication state...</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}
