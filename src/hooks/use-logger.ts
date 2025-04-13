
import { useCallback } from 'react';
import { LOG_LEVEL, LOG_CATEGORY, type LogLevel, type LogCategory } from '@/shared/types/shared.types';

interface LoggerOptions {
  level?: LogLevel;
  defaultDetails?: Record<string, unknown>;
}

/**
 * Custom hook for structured logging
 * 
 * @param source Source of the log (component, service, etc.)
 * @param category Log category
 * @param options Additional options
 * @returns Logger methods for various log levels
 */
export function useLogger(source: string, category: LogCategory, options: LoggerOptions = {}) {
  const log = useCallback((level: LogLevel, message: string, details?: Record<string, unknown>) => {
    const timestamp = new Date().toISOString();
    const logObject = {
      level,
      source,
      category,
      message,
      details: { 
        ...options.defaultDetails, 
        ...details 
      },
      timestamp,
    };
    
    switch (level) {
      case LOG_LEVEL.ERROR:
        console.error(`[${level}] [${source}] ${message}`, logObject);
        break;
      case LOG_LEVEL.WARN:
        console.warn(`[${level}] [${source}] ${message}`, logObject);
        break;
      case LOG_LEVEL.INFO:
        console.info(`[${level}] [${source}] ${message}`, logObject);
        break;
      case LOG_LEVEL.SUCCESS:
        console.info(`[${level}] [${source}] ${message}`, logObject);
        break;
      case LOG_LEVEL.DEBUG:
        console.debug(`[${level}] [${source}] ${message}`, logObject);
        break;
      case LOG_LEVEL.TRACE:
        console.debug(`[${level}] [${source}] ${message}`, logObject);
        break;
      default:
        console.log(`[${level}] [${source}] ${message}`, logObject);
    }
    
    // Here we would typically send logs to a logging service or bridge
    // For now, we're just using console methods
    
    return logObject;
  }, [source, category, options.defaultDetails]);
  
  return {
    trace: (message: string, details?: Record<string, unknown>) => log(LOG_LEVEL.TRACE, message, details),
    debug: (message: string, details?: Record<string, unknown>) => log(LOG_LEVEL.DEBUG, message, details),
    info: (message: string, details?: Record<string, unknown>) => log(LOG_LEVEL.INFO, message, details),
    success: (message: string, details?: Record<string, unknown>) => log(LOG_LEVEL.SUCCESS, message, details),
    warn: (message: string, details?: Record<string, unknown>) => log(LOG_LEVEL.WARN, message, details),
    error: (message: string, details?: Record<string, unknown>) => log(LOG_LEVEL.ERROR, message, details),
    fatal: (message: string, details?: Record<string, unknown>) => log(LOG_LEVEL.FATAL, message, details),
    log: (level: LogLevel, message: string, details?: Record<string, unknown>) => log(level, message, details),
  };
}
