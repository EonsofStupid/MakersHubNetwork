
import { useCallback } from 'react';
import { getLogger } from '../service/logger.service';
import { LogCategory, LogLevel } from '../types';
import { useMemo } from 'react';

export interface ErrorLoggerOptions {
  silent?: boolean;
  context?: string;
  namespace?: string;
  category?: LogCategory;
  details?: Record<string, unknown>;
}

export function useErrorLogger(source: string, defaultOptions: ErrorLoggerOptions = {}) {
  const logger = useMemo(() => getLogger(source, {
    category: defaultOptions.category || LogCategory.ERROR
  }), [source, defaultOptions.category]);
  
  const logError = useCallback((error: Error | unknown, options: ErrorLoggerOptions = {}) => {
    const combinedOptions: ErrorLoggerOptions = {
      ...defaultOptions,
      ...options
    };
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : String(error);
    
    const errorDetails = error instanceof Error
      ? { 
          name: error.name, 
          message: error.message, 
          stack: error.stack,
          ...combinedOptions.details
        }
      : { 
          error: String(error),
          ...combinedOptions.details
        };

    if (!combinedOptions.silent) {
      logger.error(
        `${combinedOptions.context ? `[${combinedOptions.context}] ` : ''}${errorMessage}`,
        { category: combinedOptions.category || LogCategory.ERROR, details: errorDetails }
      );
    }
    
    return errorMessage;
  }, [logger, defaultOptions]);
  
  const captureError = useCallback((fn: () => any, options: ErrorLoggerOptions = {}) => {
    try {
      return fn();
    } catch (error) {
      logError(error, options);
      return null;
    }
  }, [logError]);
  
  const captureErrorAsync = useCallback(async (fn: () => Promise<any>, options: ErrorLoggerOptions = {}) => {
    try {
      return await fn();
    } catch (error) {
      logError(error, options);
      return null;
    }
  }, [logError]);
  
  return { 
    logError,
    captureError,
    captureErrorAsync,
  };
}
