
import { useCallback } from 'react';
import { getLogger } from '../core/logger.service';
import { LogCategory, LoggerOptions } from '../types';

/**
 * Hook for accessing the logger within React components
 * @param source The source/component name for the logs
 * @param defaultCategory Default category for all logs from this component
 * @returns Logger instance
 */
export function useLogger(source: string, defaultCategory: LogCategory = LogCategory.UI) {
  const logger = getLogger(source);
  
  // Wrap logger methods to include the default category
  const trace = useCallback((message: string, options?: Omit<LoggerOptions, 'source'>) => {
    logger.trace(message, { 
      category: options?.category || defaultCategory, 
      details: options?.details,
      tags: options?.tags 
    });
  }, [logger, defaultCategory]);
  
  const debug = useCallback((message: string, options?: Omit<LoggerOptions, 'source'>) => {
    logger.debug(message, { 
      category: options?.category || defaultCategory, 
      details: options?.details,
      tags: options?.tags 
    });
  }, [logger, defaultCategory]);
  
  const info = useCallback((message: string, options?: Omit<LoggerOptions, 'source'>) => {
    logger.info(message, { 
      category: options?.category || defaultCategory, 
      details: options?.details,
      tags: options?.tags 
    });
  }, [logger, defaultCategory]);
  
  const warn = useCallback((message: string, options?: Omit<LoggerOptions, 'source'>) => {
    logger.warn(message, { 
      category: options?.category || defaultCategory, 
      details: options?.details,
      tags: options?.tags 
    });
  }, [logger, defaultCategory]);
  
  const error = useCallback((message: string, options?: Omit<LoggerOptions, 'source'>) => {
    logger.error(message, { 
      category: options?.category || defaultCategory, 
      details: options?.details,
      tags: options?.tags 
    });
  }, [logger, defaultCategory]);
  
  const critical = useCallback((message: string, options?: Omit<LoggerOptions, 'source'>) => {
    logger.critical(message, { 
      category: options?.category || defaultCategory, 
      details: options?.details,
      tags: options?.tags 
    });
  }, [logger, defaultCategory]);
  
  const success = useCallback((message: string, options?: Omit<LoggerOptions, 'source'>) => {
    logger.success(message, { 
      category: options?.category || defaultCategory, 
      details: options?.details,
      tags: options?.tags 
    });
  }, [logger, defaultCategory]);
  
  const performance = useCallback((message: string, duration: number, options?: Omit<LoggerOptions, 'source'>) => {
    logger.performance(message, duration, { 
      category: options?.category || defaultCategory, 
      details: options?.details,
      tags: options?.tags 
    });
  }, [logger, defaultCategory]);
  
  return { 
    trace, 
    debug, 
    info, 
    warn, 
    error, 
    critical, 
    success, 
    performance 
  };
}
