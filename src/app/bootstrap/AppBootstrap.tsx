
import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { LogCategory, LogLevel, LogDetails } from '@/shared/types/shared.types';
import { logger } from '@/logging/logger.service';

/**
 * AppBootstrap Component
 * 
 * Handles initialization of core app services like auth
 * Designed to run only once when the app mounts
 */
export function AppBootstrap() {
  const { initialize, initialized } = useAuthStore();
  const initAttemptRef = useRef(false);
  
  // Handle initialization of auth on mount
  useEffect(() => {
    // Prevent multiple initialization attempts
    if (initAttemptRef.current || initialized) {
      return;
    }
    
    // Mark as attempted immediately
    initAttemptRef.current = true;
    
    console.info('Bootstrapping application services');
    
    const initApp = async () => {
      try {
        console.info('Initializing auth service');
        await initialize();
        console.info('Auth service initialized successfully');
      } catch (error) {
        const details: LogDetails = { 
          error: error instanceof Error ? error.message : String(error),
          source: 'AppBootstrap' 
        };
        
        console.error('Auth initialization failed', details);
        
        // Log through the logger service
        logger.log(LogLevel.ERROR, LogCategory.APP, 'Auth initialization failed', details);
      }
    };
    
    initApp();
    
    return () => {
      // Clean up any resources if needed
    };
  }, [initialize, initialized]);
  
  // This is a utility component that doesn't render anything
  return null;
}
