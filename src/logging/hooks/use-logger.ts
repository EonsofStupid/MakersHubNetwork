
import { useCallback } from 'react';
import { logger } from '../logger.service';
import { LogCategory, LogLevel, LogDetails } from '@/shared/types/shared.types';

/**
 * Hook for component-level logging
 */
export function useLogger(source: string, category: LogCategory) {
  const debug = useCallback(
    (message: string, details?: LogDetails) => {
      logger.log(LogLevel.DEBUG, category, message, { ...details, source });
    },
    [source, category]
  );

  const info = useCallback(
    (message: string, details?: LogDetails) => {
      logger.log(LogLevel.INFO, category, message, { ...details, source });
    },
    [source, category]
  );

  const warn = useCallback(
    (message: string, details?: LogDetails) => {
      logger.log(LogLevel.WARN, category, message, { ...details, source });
    },
    [source, category]
  );

  const error = useCallback(
    (message: string, details?: LogDetails) => {
      logger.log(LogLevel.ERROR, category, message, { ...details, source });
    },
    [source, category]
  );

  const success = useCallback(
    (message: string, details?: LogDetails) => {
      logger.log(LogLevel.SUCCESS, category, message, { ...details, source });
    },
    [source, category]
  );

  return {
    debug,
    info,
    warn,
    error,
    success,
  };
}

export default useLogger;
