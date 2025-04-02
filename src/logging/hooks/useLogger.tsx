
import { useCallback, useMemo } from 'react';
import { getLogger } from '../service/logger.service';
import { Logger, LogCategory, LoggerOptions } from '../types';

/**
 * Hook for accessing the logger within React components
 */
export function useLogger(source: string = 'component', defaultCategory: LogCategory = LogCategory.UI): Logger {
  // Create a memoized logger instance
  const logger = useMemo(() => {
    return getLogger(source);
  }, [source]);
  
  // Create wrapped methods with default category
  const wrappedLogger = useMemo(() => {
    const wrapMethod = (
      method: (message: string, options?: LoggerOptions) => void
    ) => {
      return (message: string, options?: LoggerOptions) => {
        method(message, {
          category: defaultCategory,
          ...options
        });
      };
    };
    
    return {
      trace: wrapMethod(logger.trace),
      debug: wrapMethod(logger.debug),
      info: wrapMethod(logger.info),
      warn: wrapMethod(logger.warn),
      error: wrapMethod(logger.error),
      critical: wrapMethod(logger.critical),
      success: wrapMethod(logger.success),
      performance: (message: string, duration: number, options?: LoggerOptions) => {
        logger.performance(message, duration, {
          category: defaultCategory,
          ...options
        });
      }
    };
  }, [logger, defaultCategory]);
  
  return wrappedLogger;
}
