
import { useCallback } from 'react';
import { LogLevel, LogCategory } from '@/shared/types/shared.types';
import { logger } from '@/logging/logger.service';

/**
 * Hook to create a consistent logger with a given source and category
 * @param source The source of the logs (e.g., component name)
 * @param category The log category 
 * @returns An object with logger methods
 */
export function useLogger(source: string, category: LogCategory = LogCategory.UI) {
  const log = useCallback((level: LogLevel, message: string, details?: Record<string, any>) => {
    logger.log(level, category, message, { ...details, source });
  }, [source, category]);

  const trace = useCallback((message: string, details?: Record<string, any>) => {
    logger.log(LogLevel.TRACE, category, message, { ...details, source });
  }, [source, category]);

  const debug = useCallback((message: string, details?: Record<string, any>) => {
    logger.log(LogLevel.DEBUG, category, message, { ...details, source });
  }, [source, category]);

  const info = useCallback((message: string, details?: Record<string, any>) => {
    logger.log(LogLevel.INFO, category, message, { ...details, source });
  }, [source, category]);

  const success = useCallback((message: string, details?: Record<string, any>) => {
    logger.log(LogLevel.SUCCESS, category, message, { ...details, source });
  }, [source, category]);

  const warn = useCallback((message: string, details?: Record<string, any>) => {
    logger.log(LogLevel.WARN, category, message, { ...details, source });
  }, [source, category]);

  const error = useCallback((message: string, details?: Record<string, any>) => {
    logger.log(LogLevel.ERROR, category, message, { ...details, source });
  }, [source, category]);

  const fatal = useCallback((message: string, details?: Record<string, any>) => {
    logger.log(LogLevel.FATAL, category, message, { ...details, source });
  }, [source, category]);

  return {
    log,
    trace,
    debug,
    info,
    success,
    warn,
    error,
    fatal
  };
}
