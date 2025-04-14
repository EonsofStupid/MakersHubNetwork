
import { useMemo } from 'react';
import { logger } from '@/logging/logger.service';
import { LogLevel, LogCategory } from '@/shared/types/shared.types';

export interface Logger {
  debug: (message: string, details?: Record<string, any>) => void;
  info: (message: string, details?: Record<string, any>) => void;
  warn: (message: string, details?: Record<string, any>) => void;
  error: (message: string, details?: Record<string, any>) => void;
  log: (level: LogLevel, message: string, details?: Record<string, any>) => void;
}

export function useLogger(source: string, category: LogCategory): Logger {
  return useMemo(() => ({
    debug: (message: string, details?: Record<string, any>) => {
      logger.log(LogLevel.DEBUG, category, message, { source, details });
    },
    info: (message: string, details?: Record<string, any>) => {
      logger.log(LogLevel.INFO, category, message, { source, details });
    },
    warn: (message: string, details?: Record<string, any>) => {
      logger.log(LogLevel.WARN, category, message, { source, details });
    },
    error: (message: string, details?: Record<string, any>) => {
      logger.log(LogLevel.ERROR, category, message, { source, details });
    },
    log: (level: LogLevel, message: string, details?: Record<string, any>) => {
      logger.log(level, category, message, { source, details });
    }
  }), [source, category]);
}
