
import { useCallback } from 'react';
import { getLogger } from '@/logging';
import { LogCategory, LogOptions } from '@/logging/types';
import { ErrorInfo } from 'react';

/**
 * Hook for logging errors from React components and error boundaries
 */
export function useErrorLogger(source: string) {
  const logger = getLogger();
  
  const logError = useCallback((error: Error, errorInfo?: ErrorInfo) => {
    logger.error(error.message, {
      category: LogCategory.SYSTEM,
      source,
      details: {
        errorName: error.name,
        stack: error.stack,
        componentStack: errorInfo?.componentStack,
        error // Pass the full error object
      }
    } as LogOptions);
  }, [logger, source]);

  const logErrorWithContext = useCallback((error: Error, context: Record<string, unknown> = {}) => {
    logger.error(error.message, {
      category: LogCategory.SYSTEM,
      source,
      details: {
        errorName: error.name,
        stack: error.stack,
        context
      }
    } as LogOptions);
  }, [logger, source]);

  const logApiError = useCallback((error: unknown, endpoint: string, params?: unknown) => {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown API error';
    
    logger.error(`API Error: ${endpoint}`, {
      category: LogCategory.NETWORK,
      source,
      details: {
        error,
        endpoint,
        params
      }
    } as LogOptions);
  }, [logger, source]);

  return {
    logError,
    logErrorWithContext,
    logApiError
  };
}
