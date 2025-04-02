
import { useCallback } from 'react';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { ErrorInfo } from 'react';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for logging errors from React components and error boundaries
 */
export function useErrorLogger(source: string) {
  const logger = getLogger(source);
  const { toast } = useToast();
  
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
    });
    
    // Show toast notification for user feedback
    toast({
      title: 'Error Occurred',
      description: error.message,
      variant: 'destructive',
      icon: 'alert-triangle'
    });
  }, [logger, source, toast]);

  const logErrorWithContext = useCallback((error: Error, context: Record<string, unknown> = {}) => {
    logger.error(error.message, {
      category: LogCategory.SYSTEM,
      source,
      details: {
        errorName: error.name,
        stack: error.stack,
        context
      }
    });
    
    toast({
      title: 'Error Occurred',
      description: error.message,
      variant: 'destructive',
      icon: 'alert-triangle'
    });
  }, [logger, source, toast]);

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
    });
    
    toast({
      title: 'API Error',
      description: errorMessage,
      variant: 'destructive',
      icon: 'cloud-off'
    });
  }, [logger, source, toast]);

  return {
    logError,
    logErrorWithContext,
    logApiError
  };
}
