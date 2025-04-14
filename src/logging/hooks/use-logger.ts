
import { useCallback } from 'react';
import { logger } from '../logger.service';
import { LogCategory, LogLevel, LogDetails } from '@/shared/types/shared.types';

/**
 * Hook for component-level logging
 */
export function useLogger(source: string, defaultCategory: LogCategory = LogCategory.UI) {
  const logWithSource = useCallback((level: LogLevel, message: string, options?: Partial<LogDetails>) => {
    const details = options ? { ...options, source } : { source };
    logger.log(level, defaultCategory, message, details);
  }, [source, defaultCategory]);

  return {
    debug: useCallback((message: string, options?: Partial<LogDetails>) => {
      logWithSource(LogLevel.DEBUG, message, options);
    }, [logWithSource]),
    
    info: useCallback((message: string, options?: Partial<LogDetails>) => {
      logWithSource(LogLevel.INFO, message, options);
    }, [logWithSource]),
    
    warn: useCallback((message: string, options?: Partial<LogDetails>) => {
      logWithSource(LogLevel.WARN, message, options);
    }, [logWithSource]),
    
    error: useCallback((message: string, options?: Partial<LogDetails>) => {
      logWithSource(LogLevel.ERROR, message, options);
    }, [logWithSource]),
    
    log: useCallback((level: LogLevel, message: string, options?: Partial<LogDetails>) => {
      logWithSource(level, message, options);
    }, [logWithSource])
  };
}

export default useLogger;
