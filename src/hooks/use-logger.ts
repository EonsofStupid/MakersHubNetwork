
import { LogLevel, LogCategory } from '@/shared/types/shared.types';
import { logger } from '@/logging/logger.service';

/**
 * Custom hook for component logging
 * 
 * @param source - The source of the log (usually component name)
 * @param category - The category of the log
 * @returns Logger interface with methods for different log levels
 */
export function useLogger(source: string, category: LogCategory = LogCategory.APP) {
  return {
    trace: (message: string, details?: Record<string, unknown>) => {
      logger.log(LogLevel.TRACE, message, category, { source, ...details });
    },
    debug: (message: string, details?: Record<string, unknown>) => {
      logger.log(LogLevel.DEBUG, message, category, { source, ...details });
    },
    info: (message: string, details?: Record<string, unknown>) => {
      logger.log(LogLevel.INFO, message, category, { source, ...details });
    },
    warn: (message: string, details?: Record<string, unknown>) => {
      logger.log(LogLevel.WARN, message, category, { source, ...details });
    },
    error: (message: string, details?: Record<string, unknown>) => {
      logger.log(LogLevel.ERROR, message, category, { source, ...details });
    },
    fatal: (message: string, details?: Record<string, unknown>) => {
      logger.log(LogLevel.FATAL, message, category, { source, ...details });
    },
    success: (message: string, details?: Record<string, unknown>) => {
      logger.log(LogLevel.SUCCESS, message, category, { source, ...details });
    },
    log: (level: LogLevel, message: string, details?: Record<string, unknown>) => {
      logger.log(level, message, category, { source, ...details });
    }
  };
}
