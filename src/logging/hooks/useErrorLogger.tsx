
import { useCallback } from 'react';
import { getLogger } from '../service/logger.service';
import { LogCategory } from '../types';
import { safeDetails } from '../utils/safeDetails';

export function useErrorLogger(source: string = 'ErrorBoundary') {
  const logger = getLogger(source);
  
  const logError = useCallback((error: Error, errorInfo?: React.ErrorInfo) => {
    logger.error(`Uncaught error: ${error.message}`, {
      category: LogCategory.ERROR,
      details: safeDetails({
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        },
        componentStack: errorInfo?.componentStack
      })
    });
  }, [logger]);
  
  return { logError };
}
