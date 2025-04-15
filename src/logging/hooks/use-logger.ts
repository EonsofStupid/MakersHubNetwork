
import { useCallback } from 'react';
import { logger } from '../logger.service';
import { LogLevel, LogCategory, LogCategoryType, LogDetails } from '@/shared/types/shared.types';

/**
 * Custom hook for component-level logging
 * 
 * @param source - Source of the log (component name, service, etc.)
 * @param category - Log category
 * @returns Object with log methods for different log levels
 */
export const useLogger = (source: string, category: LogCategoryType = LogCategory.UI) => {
  const createLogDetails = (details?: Partial<LogDetails>): LogDetails => ({
    source,
    ...details
  });

  const debug = useCallback((message: string, details?: Partial<LogDetails>) => {
    logger.log(LogLevel.DEBUG, category, message, createLogDetails(details));
  }, [source, category]);

  const info = useCallback((message: string, details?: Partial<LogDetails>) => {
    logger.log(LogLevel.INFO, category, message, createLogDetails(details));
  }, [source, category]);

  const warn = useCallback((message: string, details?: Partial<LogDetails>) => {
    logger.log(LogLevel.WARN, category, message, createLogDetails(details));
  }, [source, category]);

  const error = useCallback((message: string, details?: Partial<LogDetails>) => {
    logger.log(LogLevel.ERROR, category, message, createLogDetails(details));
  }, [source, category]);

  return {
    debug,
    info,
    warn,
    error,
    log: useCallback((level: LogLevel, message: string, details?: Partial<LogDetails>) => {
      logger.log(level, category, message, createLogDetails(details));
    }, [source, category]),
    
    withCategory: useCallback((newCategory: LogCategoryType) => {
      return useLogger(source, newCategory);
    }, [source])
  };
};
