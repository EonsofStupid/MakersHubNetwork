
import { useCallback } from 'react';
import { logger } from '@/logging/logger.service';
import { LogCategory, LogLevel, LogDetails } from '@/shared/types/shared.types';

/**
 * Custom hook for component-scoped logging
 * @param source The source of the logs (usually component name)
 * @param category The category of logs (default: UI)
 */
export function useLogger(source: string, category: LogCategory = LogCategory.UI) {
  const debug = useCallback((message: string, details?: LogDetails) => {
    logger.log(LogLevel.DEBUG, category, message, { source, ...details });
  }, [source, category]);

  const info = useCallback((message: string, details?: LogDetails) => {
    logger.log(LogLevel.INFO, category, message, { source, ...details });
  }, [source, category]);

  const warn = useCallback((message: string, details?: LogDetails) => {
    logger.log(LogLevel.WARN, category, message, { source, ...details });
  }, [source, category]);

  const error = useCallback((message: string, details?: LogDetails) => {
    logger.log(LogLevel.ERROR, category, message, { source, ...details });
  }, [source, category]);

  const success = useCallback((message: string, details?: LogDetails) => {
    logger.log(LogLevel.SUCCESS, category, message, { source, ...details });
  }, [source, category]);

  return {
    debug,
    info,
    warn,
    error,
    success,
    // Add the source name to allow for reference in other places
    source
  };
}
