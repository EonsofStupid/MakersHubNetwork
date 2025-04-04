
import { useEffect, useRef } from 'react';
import { LoggerOptions } from '../types';
import { useLogger } from './useLogger';
import { safeDetails } from '../utils/safeDetails';

interface ErrorLoggerOptions extends LoggerOptions {
  enableGlobalHandlers?: boolean;
}

/**
 * Hook for automatic error logging in components
 */
export function useErrorLogger(source?: string, options: ErrorLoggerOptions = {}): void {
  const logger = useLogger(source || 'ErrorBoundary', options);
  const prevHandler = useRef<OnErrorEventHandler | null>(null);
  
  useEffect(() => {
    // Only set up global handlers if explicitly enabled
    if (options.enableGlobalHandlers !== true) {
      return;
    }
    
    // Store previous handlers to restore them on cleanup
    prevHandler.current = window.onerror;
    
    // Global uncaught error handler
    window.onerror = (event, source, lineno, colno, error) => {
      logger.error('Uncaught error', {
        details: safeDetails({
          message: error?.message || String(event),
          source,
          lineno,
          colno,
          stack: error?.stack
        })
      });
      
      // Call previous handler if it exists
      if (typeof prevHandler.current === 'function') {
        return prevHandler.current(event, source, lineno, colno, error);
      }
      
      // Return false to allow default browser handling
      return false;
    };
    
    // Unhandled promise rejection handler
    const handleRejection = (event: PromiseRejectionEvent) => {
      logger.error('Unhandled promise rejection', {
        details: safeDetails(event.reason)
      });
    };
    
    window.addEventListener('unhandledrejection', handleRejection);
    
    // Clean up
    return () => {
      window.onerror = prevHandler.current;
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, [logger, options.enableGlobalHandlers]);
}
