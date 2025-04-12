
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { LogCategory, LogLevel } from '@/shared/types/shared.types';
import { getLogger as getLoggerService } from '@/logging';

/**
 * Hook for accessing the logging service with a predefined source and category
 * 
 * @param source The source of the logs (component or module name)
 * @param category The category of logs
 * @returns Object with logging methods for different log levels
 */
export function useLogger(source: string, category: LogCategory = LogCategory.DEFAULT) {
  const logger = getLoggerService(source, category);
  
  // Debug level logs
  const debug = useCallback((message: string, options?: { details?: Record<string, unknown> }) => {
    logger.debug(message, options);
  }, [logger]);
  
  // Info level logs
  const info = useCallback((message: string, options?: { details?: Record<string, unknown> }) => {
    logger.info(message, options);
  }, [logger]);
  
  // Warning level logs
  const warn = useCallback((message: string, options?: { details?: Record<string, unknown> }) => {
    logger.warn(message, options);
  }, [logger]);
  
  // Error level logs
  const error = useCallback((message: string, options?: { details?: Record<string, unknown> }) => {
    logger.error(message, options);
  }, [logger]);
  
  // Critical level logs
  const critical = useCallback((message: string, options?: { details?: Record<string, unknown> }) => {
    logger.critical(message, options);
  }, [logger]);
  
  // Return the logger object with all methods
  return {
    debug,
    info,
    warn,
    error,
    critical,
  };
}
