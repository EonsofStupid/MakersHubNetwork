
import { useCallback } from 'react';
import { logger } from '../logger.service';
import { LogCategory, LogLevel, LogDetails } from '@/shared/types/shared.types';

/**
 * Custom hook for component-level logging
 * 
 * @param source - Source of the log (component name, service, etc.)
 * @param category - Log category
 * @returns Object with log methods for different log levels
 */
export const useLogger = (source: string, category: LogCategory = LogCategory.UI) => {
  const createLogDetails = (details?: any): LogDetails => ({
    source,
    ...details
  });

  const debug = useCallback((message: string, details?: any) => {
    logger.log(LogLevel.DEBUG, category, message, createLogDetails(details));
  }, [source, category]);

  const info = useCallback((message: string, details?: any) => {
    logger.log(LogLevel.INFO, category, message, createLogDetails(details));
  }, [source, category]);

  const warn = useCallback((message: string, details?: any) => {
    logger.log(LogLevel.WARN, category, message, createLogDetails(details));
  }, [source, category]);

  const error = useCallback((message: string, details?: any) => {
    logger.log(LogLevel.ERROR, category, message, createLogDetails(details));
  }, [source, category]);

  return {
    debug,
    info,
    warn,
    error
  };
};
