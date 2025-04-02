
import { useCallback } from 'react';
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
  const loggerInstance = getLogger(source);
  
  // Create memoized logging functions with default category
  const debug = useCallback((message: string, options?: { 
    category?: LogCategory; 
    details?: any; 
    tags?: string[] 
  }) => {
    loggerInstance.debug(message, { 
      category: options?.category || defaultCategory,
      details: options?.details,
      tags: options?.tags
    });
  }, [loggerInstance, defaultCategory]);
  
  const info = useCallback((message: string, options?: { 
    category?: LogCategory; 
    details?: any; 
    tags?: string[] 
  }) => {
    loggerInstance.info(message, { 
      category: options?.category || defaultCategory,
      details: options?.details,
      tags: options?.tags
    });
  }, [loggerInstance, defaultCategory]);
  
  const warn = useCallback((message: string, options?: { 
    category?: LogCategory; 
    details?: any; 
    tags?: string[] 
  }) => {
    loggerInstance.warn(message, { 
      category: options?.category || defaultCategory,
      details: options?.details,
      tags: options?.tags
    });
  }, [loggerInstance, defaultCategory]);
  
  const error = useCallback((message: string, options?: { 
    category?: LogCategory; 
    details?: any; 
    tags?: string[] 
  }) => {
    loggerInstance.error(message, { 
      category: options?.category || defaultCategory,
      details: options?.details,
      tags: options?.tags
    });
  }, [loggerInstance, defaultCategory]);
  
  const critical = useCallback((message: string, options?: { 
    category?: LogCategory; 
    details?: any; 
    tags?: string[] 
  }) => {
    loggerInstance.critical(message, { 
      category: options?.category || defaultCategory,
      details: options?.details,
      tags: options?.tags
    });
  }, [loggerInstance, defaultCategory]);
  
  const success = useCallback((message: string, options?: { 
    category?: LogCategory; 
    details?: any; 
    tags?: string[] 
  }) => {
    loggerInstance.success(message, { 
      category: options?.category || defaultCategory,
      details: options?.details,
      tags: options?.tags
    });
  }, [loggerInstance, defaultCategory]);
  
  const performance = useCallback((message: string, duration: number, options?: { 
    category?: LogCategory; 
    details?: any; 
    tags?: string[] 
  }) => {
    loggerInstance.performance(message, duration, { 
      category: options?.category || defaultCategory,
      details: options?.details,
      tags: options?.tags
    });
  }, [loggerInstance, defaultCategory]);
  
  return {
    debug,
    info,
    warn,
    error,
    critical,
    success,
    performance
  };
}
