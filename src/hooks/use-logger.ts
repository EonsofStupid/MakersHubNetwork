
import { useCallback } from 'react';
import { getLogger } from '@/logging';
import { LogCategory, LogOptions } from '@/logging/types';
import { LogLevel } from '@/logging/constants/log-level';

/**
 * Hook for logging from React components
 */
export function useLogger(source: string, defaultCategory: LogCategory = LogCategory.UI) {
  const logger = getLogger(source);
  
  const debug = useCallback((message: string, options?: Omit<LogOptions, 'category'>) => {
    logger.debug(message, {
      ...options,
      category: defaultCategory,
    });
  }, [logger, defaultCategory]);
  
  const info = useCallback((message: string, options?: Omit<LogOptions, 'category'>) => {
    logger.info(message, {
      ...options,
      category: defaultCategory,
    });
  }, [logger, defaultCategory]);
  
  const warn = useCallback((message: string, options?: Omit<LogOptions, 'category'>) => {
    logger.warn(message, {
      ...options,
      category: defaultCategory,
    });
  }, [logger, defaultCategory]);
  
  const error = useCallback((message: string, options?: Omit<LogOptions, 'category'>) => {
    logger.error(message, {
      ...options,
      category: defaultCategory,
    });
  }, [logger, defaultCategory]);
  
  const critical = useCallback((message: string, options?: Omit<LogOptions, 'category'>) => {
    logger.critical(message, {
      ...options,
      category: defaultCategory,
    });
  }, [logger, defaultCategory]);
  
  return {
    debug,
    info,
    warn,
    error,
    critical
  };
}
