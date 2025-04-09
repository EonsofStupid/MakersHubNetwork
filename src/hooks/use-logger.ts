
import { useCallback } from 'react';
import { getLogger, LogCategory, LogLevel } from '@/logging';

/**
 * Custom hook to create a logger with a consistent name and default category
 * @param name Logger name (component or feature name)
 * @param defaultCategory Default category for log messages
 * @returns Logger object with consistent methods
 */
export function useLogger(name: string, defaultCategory: LogCategory = LogCategory.UI) {
  const logger = getLogger(name);
  
  const debug = useCallback((message: string, meta?: Record<string, any>) => {
    logger.debug(message, { category: defaultCategory, ...meta });
  }, [logger, defaultCategory]);
  
  const info = useCallback((message: string, meta?: Record<string, any>) => {
    logger.info(message, { category: defaultCategory, ...meta });
  }, [logger, defaultCategory]);
  
  const warn = useCallback((message: string, meta?: Record<string, any>) => {
    logger.warn(message, { category: defaultCategory, ...meta });
  }, [logger, defaultCategory]);
  
  const error = useCallback((message: string, meta?: Record<string, any>) => {
    logger.error(message, { category: defaultCategory, ...meta });
  }, [logger, defaultCategory]);
  
  return { debug, info, warn, error };
}
