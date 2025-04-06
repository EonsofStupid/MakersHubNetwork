
import { useCallback } from 'react';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { LogLevel } from '@/logging/constants/log-level';

// Extended options type for logger
interface LogOptions {
  category?: LogCategory;
  details?: Record<string, unknown>;
  tags?: string[];
  success?: boolean;
  error?: boolean;
  warning?: boolean;
  errorMessage?: string;
  originalTheme?: string;
  theme?: string;
}

/**
 * Hook for logging from React components
 */
export function useLogger(source: string, defaultCategory: LogCategory = LogCategory.UI) {
  const logger = getLogger(source);
  
  const debug = useCallback((message: string, options?: LogOptions) => {
    logger.debug(message, {
      ...options,
      category: options?.category || defaultCategory,
    });
  }, [logger, source, defaultCategory]);
  
  const info = useCallback((message: string, options?: LogOptions) => {
    logger.info(message, {
      ...options,
      category: options?.category || defaultCategory,
    });
  }, [logger, source, defaultCategory]);
  
  const warn = useCallback((message: string, options?: LogOptions) => {
    logger.warn(message, {
      ...options,
      category: options?.category || defaultCategory,
    });
  }, [logger, source, defaultCategory]);
  
  const error = useCallback((message: string, options?: LogOptions) => {
    logger.error(message, {
      ...options,
      category: options?.category || defaultCategory,
    });
  }, [logger, source, defaultCategory]);
  
  const critical = useCallback((message: string, options?: LogOptions) => {
    logger.critical(message, {
      ...options,
      category: options?.category || defaultCategory,
    });
  }, [logger, source, defaultCategory]);
  
  return {
    debug,
    info,
    warn,
    error,
    critical
  };
}
