
import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { CircuitBreaker } from '@/utils/circuitBreaker';

// Create a circuit breaker specifically for bootstrap operations
const bootstrapBreaker = new CircuitBreaker('app-bootstrap', 2, 10000);

/**
 * AppBootstrap Component
 * 
 * Handles initialization of core app services like auth
 * Designed to run only once when the app mounts
 */
export function AppBootstrap() {
  const logger = useLogger('AppBootstrap', LogCategory.SYSTEM);
  const initialize = useAuthStore(state => state.initialize);
  const initialized = useAuthStore(state => state.initialized);
  const initAttemptRef = useRef(false);
  
  // Handle initialization of auth on mount
  useEffect(() => {
    // Prevent multiple initialization attempts
    if (initAttemptRef.current || initialized) {
      return;
    }
    
    // Mark as attempted immediately
    initAttemptRef.current = true;
    
    logger.info('Bootstrapping application services');
    
    // Use the circuit breaker to prevent infinite initialization loops
    bootstrapBreaker.execute(
      // Async function to initialize
      async () => {
        try {
          logger.info('Initializing auth service');
          await initialize();
          logger.info('Auth service initialized successfully');
        } catch (error) {
          logger.error('Auth initialization failed', { 
            details: error instanceof Error 
              ? { message: error.message } // Fix: Properly format error as Record<string, unknown>
              : { message: String(error) }
          });
          throw error;
        }
      },
      // Fallback function if circuit breaker trips
      () => {
        logger.warn('Auth initialization skipped due to circuit breaker');
        return null;
      }
    );
    
    return () => {
      // Clean up any resources if needed
    };
  }, [initialize, initialized, logger]);
  
  // This is a utility component that doesn't render anything
  return null;
}
