
import { useCallback } from 'react';
import { useLogger } from './useLogger';
import { LogCategory } from '../types';
import { ErrorInfo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { safeDetails } from '../utils/safeDetails';

/**
 * Hook for logging errors from React components and error boundaries
 */
export function useErrorLogger(source: string = 'error') {
  const logger = useLogger(source, LogCategory.SYSTEM);
  const { toast } = useToast();
  
  const logError = useCallback((error: Error, errorInfo?: ErrorInfo) => {
    logger.error(error.message, {
      category: LogCategory.SYSTEM,
      details: safeDetails({
        error,
        componentStack: errorInfo?.componentStack
      })
    });
    
    // Show toast notification for user feedback
    toast({
      title: 'Error Occurred',
      description: error.message,
      variant: 'destructive'
    });
  }, [logger, toast]);

  const logErrorWithContext = useCallback((error: Error, context: Record<string, unknown> = {}) => {
    logger.error(error.message, {
      category: LogCategory.SYSTEM,
      details: safeDetails({
        error,
        context
      })
    });
    
    toast({
      title: 'Error Occurred',
      description: error.message,
      variant: 'destructive'
    });
  }, [logger, toast]);

  const logApiError = useCallback((error: unknown, endpoint: string, params?: unknown) => {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown API error';
    
    logger.error(`API Error: ${endpoint}`, {
      category: LogCategory.NETWORK,
      details: safeDetails({
        error,
        endpoint,
        params
      })
    });
    
    toast({
      title: 'API Error',
      description: errorMessage,
      variant: 'destructive'
    });
  }, [logger, toast]);

  return {
    logError,
    logErrorWithContext,
    logApiError
  };
}
