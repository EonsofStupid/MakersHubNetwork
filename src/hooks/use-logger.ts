
import { useCallback } from 'react';
import { getLogger } from '@/logging';
import { LogCategory, LogOptions } from '@/logging/types';
import { LogLevel } from '@/logging/constants/log-level';
import { ReactNode } from 'react';

/**
 * Hook for logging from React components
 */
export function useLogger(source: string, defaultCategory: LogCategory = LogCategory.UI) {
  const logger = getLogger(source);
  
  const debug = useCallback((message: string | ReactNode, options?: Omit<LogOptions, 'category'>) => {
    logger.debug(message, {
      ...options,
      category: defaultCategory,
      source
    });
  }, [logger, defaultCategory, source]);
  
  const info = useCallback((message: string | ReactNode, options?: Omit<LogOptions, 'category'>) => {
    logger.info(message, {
      ...options,
      category: defaultCategory,
      source
    });
  }, [logger, defaultCategory, source]);
  
  const warn = useCallback((message: string | ReactNode, options?: Omit<LogOptions, 'category'>) => {
    logger.warn(message, {
      ...options,
      category: defaultCategory,
      source
    });
  }, [logger, defaultCategory, source]);
  
  const error = useCallback((message: string | ReactNode, options?: Omit<LogOptions, 'category'>) => {
    logger.error(message, {
      ...options,
      category: defaultCategory,
      source,
      error: true
    });
  }, [logger, defaultCategory, source]);
  
  const critical = useCallback((message: string | ReactNode, options?: Omit<LogOptions, 'category'>) => {
    logger.critical(message, {
      ...options,
      category: defaultCategory,
      source,
      error: true
    });
  }, [logger, defaultCategory, source]);
  
  return {
    debug,
    info,
    warn,
    error,
    critical
  };
}
