
import { useCallback } from 'react';
import { LogLevel, LogCategory } from '@/shared/types/shared.types';
import { getLogger } from '@/logging/logger.service';

/**
 * Hook to create a logger instance scoped to a component or module
 * 
 * @param source Source name for the logger
 * @param category Log category
 * @returns Logger methods
 */
export function useLogger(source: string, category: LogCategory = LogCategory.APP) {
  const logger = getLogger(source, category);
  
  const debug = useCallback((message: string, details?: Record<string, any>) => {
    logger.debug(message, details);
  }, [logger]);
  
  const info = useCallback((message: string, details?: Record<string, any>) => {
    logger.info(message, details);
  }, [logger]);
  
  const warn = useCallback((message: string, details?: Record<string, any>) => {
    logger.warn(message, details);
  }, [logger]);
  
  const error = useCallback((message: string, details?: Record<string, any>) => {
    logger.error(message, details);
  }, [logger]);
  
  const critical = useCallback((message: string, details?: Record<string, any>) => {
    logger.critical(message, details);
  }, [logger]);
  
  const success = useCallback((message: string, details?: Record<string, any>) => {
    logger.success(message, details);
  }, [logger]);
  
  const trace = useCallback((message: string, details?: Record<string, any>) => {
    logger.trace(message, details);
  }, [logger]);
  
  const log = useCallback((level: LogLevel, message: string, details?: Record<string, any>) => {
    logger.log(level, category, message, details);
  }, [logger, category]);
  
  return {
    debug,
    info,
    warn,
    error,
    critical,
    success,
    trace,
    log
  };
}
