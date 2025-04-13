
import { LogLevel, LogCategory } from '@/shared/types/shared.types';
import { logger } from '@/logging/logger.service';

/**
 * Custom hook for component logging
 * 
 * @param source - The source of the log (usually component name)
 * @param category - The category of the log
 * @returns Logger interface with methods for different log levels
 */
export function useLogger(source: string, category: string) {
  return {
    trace: (message: string, details?: Record<string, unknown>) => {
      logger.log('trace', message, category, { source, ...details });
    },
    debug: (message: string, details?: Record<string, unknown>) => {
      logger.log('debug', message, category, { source, ...details });
    },
    info: (message: string, details?: Record<string, unknown>) => {
      logger.log('info', message, category, { source, ...details });
    },
    warn: (message: string, details?: Record<string, unknown>) => {
      logger.log('warn', message, category, { source, ...details });
    },
    error: (message: string, details?: Record<string, unknown>) => {
      logger.log('error', message, category, { source, ...details });
    },
    fatal: (message: string, details?: Record<string, unknown>) => {
      logger.log('fatal', message, category, { source, ...details });
    },
    success: (message: string, details?: Record<string, unknown>) => {
      logger.log('success', message, category, { source, ...details });
    },
    log: (level: string, message: string, details?: Record<string, unknown>) => {
      logger.log(level as LogLevel, message, category, { source, ...details });
    }
  };
}
