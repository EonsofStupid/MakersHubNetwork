
import { useCallback } from 'react';
import { getLogger } from '@/logging';
import { LogCategory, LogOptions } from '@/logging/types';

export function useLogger(source: string, category: LogCategory = LogCategory.UI) {
  const logger = getLogger(source);
  
  const debug = useCallback((message: string, options?: LogOptions) => {
    logger.debug(message, { ...options, category, source });
  }, [logger, category, source]);
  
  const info = useCallback((message: string, options?: LogOptions) => {
    logger.info(message, { ...options, category, source });
  }, [logger, category, source]);
  
  const warn = useCallback((message: string, options?: LogOptions) => {
    logger.warn(message, { ...options, category, source });
  }, [logger, category, source]);
  
  const error = useCallback((message: string, options?: LogOptions) => {
    logger.error(message, { ...options, category, source });
  }, [logger, category, source]);
  
  const critical = useCallback((message: string, options?: LogOptions) => {
    logger.critical(message, { ...options, category, source });
  }, [logger, category, source]);
  
  // Add logCustomTiming if available
  const logCustomTiming = useCallback(
    (name: string, duration: number, options?: LogOptions) => {
      if (logger.logCustomTiming) {
        logger.logCustomTiming(name, duration, { ...options, category, source });
      } else {
        logger.info(`Timing - ${name}: ${duration}ms`, {
          ...options,
          category,
          source,
          duration,
        });
      }
    },
    [logger, category, source]
  );
  
  return {
    debug,
    info,
    warn,
    error,
    critical,
    logCustomTiming,
  };
}
