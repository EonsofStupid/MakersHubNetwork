
import { useCallback } from 'react';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/constants/log-category';

/**
 * Hook to access logger with a specific source and category
 */
export const useLogger = (source: string, category: LogCategory = LogCategory.DEFAULT) => {
  const logger = getLogger();
  
  const debug = useCallback((message: string, options?: { details?: Record<string, unknown> }) => {
    logger.debug(message, { ...options, source });
  }, [logger, source]);

  const info = useCallback((message: string, options?: { details?: Record<string, unknown> }) => {
    logger.info(message, { ...options, source, category });
  }, [logger, source, category]);

  const warn = useCallback((message: string, options?: { details?: Record<string, unknown> }) => {
    logger.warn(message, { ...options, source, category });
  }, [logger, source, category]);

  const error = useCallback((message: string, options?: { details?: Record<string, unknown> }) => {
    logger.error(message, { ...options, source, category });
  }, [logger, source, category]);

  const critical = useCallback((message: string, options?: { details?: Record<string, unknown> }) => {
    logger.critical(message, { ...options, source, category });
  }, [logger, source, category]);

  return {
    debug,
    info,
    warn,
    error,
    critical,
  };
};
