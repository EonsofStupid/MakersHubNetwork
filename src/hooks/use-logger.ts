
import { useCallback, useMemo } from 'react';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

/**
 * Hook for component-level logging
 * 
 * @param source - Component or module name for log attribution
 * @param defaultCategory - Default category for all logs from this hook
 * @returns A logger instance with component context
 */
export function useLogger(source: string, defaultCategory: LogCategory = LogCategory.UI) {
  const logger = useMemo(() => getLogger(source), [source]);
  
  // Create memoized logging functions with default category
  const debug = useCallback((message: string, options?: { 
    category?: LogCategory; 
    details?: any; 
    tags?: string[] 
  }) => {
    logger.debug(message, { 
      category: options?.category || defaultCategory,
      details: options?.details,
      tags: options?.tags
    });
  }, [logger, defaultCategory]);
  
  const info = useCallback((message: string, options?: { 
    category?: LogCategory; 
    details?: any; 
    tags?: string[] 
  }) => {
    logger.info(message, { 
      category: options?.category || defaultCategory,
      details: options?.details,
      tags: options?.tags
    });
  }, [logger, defaultCategory]);
  
  const warn = useCallback((message: string, options?: { 
    category?: LogCategory; 
    details?: any; 
    tags?: string[] 
  }) => {
    logger.warn(message, { 
      category: options?.category || defaultCategory,
      details: options?.details,
      tags: options?.tags
    });
  }, [logger, defaultCategory]);
  
  const error = useCallback((message: string, options?: { 
    category?: LogCategory; 
    details?: any; 
    tags?: string[] 
  }) => {
    logger.error(message, { 
      category: options?.category || defaultCategory,
      details: options?.details,
      tags: options?.tags
    });
  }, [logger, defaultCategory]);
  
  const critical = useCallback((message: string, options?: { 
    category?: LogCategory; 
    details?: any; 
    tags?: string[] 
  }) => {
    logger.critical(message, { 
      category: options?.category || defaultCategory,
      details: options?.details,
      tags: options?.tags
    });
  }, [logger, defaultCategory]);
  
  const performance = useCallback((message: string, duration: number, options?: { 
    category?: LogCategory; 
    details?: any; 
    tags?: string[] 
  }) => {
    logger.performance(message, duration, { 
      category: options?.category || defaultCategory,
      details: options?.details,
      tags: options?.tags
    });
  }, [logger, defaultCategory]);
  
  return {
    debug,
    info,
    warn,
    error,
    critical,
    performance
  };
}
