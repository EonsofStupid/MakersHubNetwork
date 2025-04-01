
import { useCallback } from 'react';
import { getLogger, LogCategory } from '@/logging';
import { LogLevel } from '@/logging/constants/log-level';

/**
 * Hook for logging from React components
 */
export function useLogger(source: string, defaultCategory: LogCategory = LogCategory.UI) {
  const logger = getLogger();
  
  const debug = useCallback((message: string, options?: { 
    category?: LogCategory,
    details?: unknown,
    tags?: string[],
  }) => {
    logger.debug(message, {
      ...options,
      source,
      category: options?.category || defaultCategory,
    });
  }, [logger, source, defaultCategory]);
  
  const info = useCallback((message: string, options?: { 
    category?: LogCategory,
    details?: unknown,
    tags?: string[],
  }) => {
    logger.info(message, {
      ...options,
      source,
      category: options?.category || defaultCategory,
    });
  }, [logger, source, defaultCategory]);
  
  const warn = useCallback((message: string, options?: { 
    category?: LogCategory,
    details?: unknown,
    tags?: string[],
  }) => {
    logger.warn(message, {
      ...options,
      source,
      category: options?.category || defaultCategory,
    });
  }, [logger, source, defaultCategory]);
  
  const error = useCallback((message: string, options?: { 
    category?: LogCategory,
    details?: unknown,
    tags?: string[],
  }) => {
    logger.error(message, {
      ...options,
      source,
      category: options?.category || defaultCategory,
    });
  }, [logger, source, defaultCategory]);
  
  const critical = useCallback((message: string, options?: { 
    category?: LogCategory,
    details?: unknown,
    tags?: string[],
  }) => {
    logger.critical(message, {
      ...options,
      source,
      category: options?.category || defaultCategory,
    });
  }, [logger, source, defaultCategory]);
  
  return {
    debug,
    info,
    warn,
    error,
    critical
  };
}
