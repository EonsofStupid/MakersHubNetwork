
import { logger } from '@/logging/logger.service';
import { LogLevel, LogCategory } from '@/shared/types/shared.types';

/**
 * Log details type
 */
interface LogDetails {
  details?: Record<string, any>;
  tags?: string[];
}

/**
 * Custom hook for component-level logging
 * @param source The source of the log (usually component name)
 * @param defaultCategory The default category for logs
 * @returns Object with log methods
 */
export function useLogger(source: string, defaultCategory: LogCategory = LogCategory.APP) {
  const logWithSource = (level: LogLevel, message: string, options?: LogDetails) => {
    logger.log(level, defaultCategory, message, {
      source,
      details: options?.details,
      tags: options?.tags
    });
  };

  return {
    debug: (message: string, options?: LogDetails) => {
      logWithSource(LogLevel.DEBUG, message, options);
    },
    info: (message: string, options?: LogDetails) => {
      logWithSource(LogLevel.INFO, message, options);
    },
    warn: (message: string, options?: LogDetails) => {
      logWithSource(LogLevel.WARN, message, options);
    },
    error: (message: string, options?: LogDetails) => {
      logWithSource(LogLevel.ERROR, message, options);
    },
    log: (level: LogLevel, message: string, options?: LogDetails) => {
      logWithSource(level, message, options);
    },
    withCategory: (category: LogCategory) => {
      return useLogger(source, category);
    }
  };
}
