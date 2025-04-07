
import { useCallback } from 'react';
import { getLogger } from '@/logging';
import { LogCategory, LogOptions } from '@/logging/types';
import { LogLevel } from '@/logging/constants/log-level';
import { ReactNode } from 'react';
import { createLogOptions } from '@/logging/utils/log-helpers';

/**
 * Hook for logging from React components
 */
export function useLogger(source: string, defaultCategory: LogCategory = LogCategory.UI) {
  const logger = getLogger(source);
  
  const debug = useCallback((message: string | ReactNode, options?: Partial<Omit<LogOptions, 'category'>>) => {
    logger.debug(message, createLogOptions(defaultCategory, {
      ...options,
      source
    }));
  }, [logger, defaultCategory, source]);
  
  const info = useCallback((message: string | ReactNode, options?: Partial<Omit<LogOptions, 'category'>>) => {
    logger.info(message, createLogOptions(defaultCategory, {
      ...options,
      source
    }));
  }, [logger, defaultCategory, source]);
  
  const warn = useCallback((message: string | ReactNode, options?: Partial<Omit<LogOptions, 'category'>>) => {
    logger.warn(message, createLogOptions(defaultCategory, {
      ...options,
      source
    }));
  }, [logger, defaultCategory, source]);
  
  const error = useCallback((message: string | ReactNode, options?: Partial<Omit<LogOptions, 'category'>>) => {
    logger.error(message, createLogOptions(defaultCategory, {
      ...options,
      source,
      error: true
    }));
  }, [logger, defaultCategory, source]);
  
  const critical = useCallback((message: string | ReactNode, options?: Partial<Omit<LogOptions, 'category'>>) => {
    logger.critical(message, createLogOptions(defaultCategory, {
      ...options,
      source,
      error: true
    }));
  }, [logger, defaultCategory, source]);
  
  return {
    debug,
    info,
    warn,
    error,
    critical
  };
}
