
import { useCallback, useEffect } from 'react';
import { getLogger, LogCategory } from '@/logging';

/**
 * Hook for error logging and global error handling
 */
export function useErrorLogger(source: string) {
  const logger = getLogger();
  
  /**
   * Log an error with contextual information
   */
  const logError = useCallback((error: unknown, options?: {
    message?: string;
    details?: unknown;
    tags?: string[];
  }) => {
    const message = options?.message || getErrorMessage(error);
    
    logger.error(message, {
      category: LogCategory.SYSTEM,
      details: {
        error,
        stack: error instanceof Error ? error.stack : undefined,
        ...options?.details
      },
      source,
      tags: options?.tags
    });
  }, [logger, source]);
  
  /**
   * Set up global error handlers
   */
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logger.error(`Unhandled Promise Rejection: ${getErrorMessage(event.reason)}`, {
        category: LogCategory.SYSTEM,
        details: {
          error: event.reason,
          stack: event.reason instanceof Error ? event.reason.stack : undefined
        },
        source: 'global',
        tags: ['unhandled-rejection']
      });
    };
    
    // Handle uncaught errors
    const handleError = (event: ErrorEvent) => {
      logger.error(`Uncaught Error: ${event.message}`, {
        category: LogCategory.SYSTEM,
        details: {
          error: event.error,
          stack: event.error?.stack,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        },
        source: 'global',
        tags: ['uncaught-error']
      });
    };
    
    // Add global error handlers
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);
    
    // Clean up
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, [logger]);
  
  /**
   * Higher-order function to wrap async functions with error logging
   */
  const withErrorLogging = useCallback(<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    options?: {
      message?: string | ((...args: T) => string);
      details?: unknown | ((...args: T) => unknown);
      tags?: string[];
    }
  ) => {
    return async (...args: T): Promise<R> => {
      try {
        return await fn(...args);
      } catch (error) {
        const message = typeof options?.message === 'function' 
          ? options.message(...args) 
          : options?.message || `Error in ${source}`;
        
        const details = typeof options?.details === 'function'
          ? options.details(...args)
          : options?.details;
        
        logError(error, {
          message,
          details: {
            ...details,
            args
          },
          tags: options?.tags
        });
        
        throw error;
      }
    };
  }, [source, logError]);
  
  return {
    logError,
    withErrorLogging
  };
}

/**
 * Get a readable error message from any error type
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else if (typeof error === 'object' && error !== null) {
    try {
      return JSON.stringify(error);
    } catch (e) {
      return String(error);
    }
  }
  return 'Unknown error';
}
