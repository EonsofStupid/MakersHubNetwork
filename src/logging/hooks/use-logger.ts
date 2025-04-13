
import { useCallback } from 'react';
import { LogCategory, LogLevel } from '@/shared/types/shared.types';
import { logger } from '@/logging/logger.service';

/**
 * Logger interface with standardized methods
 */
interface Logger {
  debug: (message: string, data?: any) => void;
  info: (message: string, data?: any) => void;
  warn: (message: string, data?: any) => void;
  error: (message: string, data?: any) => void;
  trace: (message: string, data?: any) => void;
}

/**
 * Hook to create and use a logger with a specific source and category
 * 
 * @param source The source component/module using the logger
 * @param category The log category
 * @returns A logger instance
 */
export function useLogger(source: string, category: LogCategory): Logger {
  const logWithLevel = useCallback((level: LogLevel, message: string, data?: any) => {
    logger.log(level, category, message, {
      source,
      ...data
    });
  }, [source, category]);

  // Return a logger object with convenient methods
  return {
    debug: useCallback((message: string, data?: any) => {
      logWithLevel(LogLevel.DEBUG, message, data);
    }, [logWithLevel]),
    
    info: useCallback((message: string, data?: any) => {
      logWithLevel(LogLevel.INFO, message, data);
    }, [logWithLevel]),
    
    warn: useCallback((message: string, data?: any) => {
      logWithLevel(LogLevel.WARN, message, data);
    }, [logWithLevel]),
    
    error: useCallback((message: string, data?: any) => {
      logWithLevel(LogLevel.ERROR, message, data);
    }, [logWithLevel]),
    
    trace: useCallback((message: string, data?: any) => {
      logWithLevel(LogLevel.TRACE, message, data);
    }, [logWithLevel])
  };
}
