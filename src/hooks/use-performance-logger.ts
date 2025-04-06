
import { useCallback, useRef } from 'react';
import { getLogger, LogCategory } from '@/logging';

/**
 * Hook for measuring and logging performance
 */
export function usePerformanceLogger(source: string) {
  const logger = getLogger(source);
  const timers = useRef<Record<string, number>>({});
  
  /**
   * Start measuring performance for an operation
   */
  const startTimer = useCallback((operationName: string) => {
    timers.current[operationName] = performance.now();
  }, []);
  
  /**
   * End measuring and log the duration
   */
  const endTimer = useCallback((operationName: string, options?: {
    details?: unknown,
    category?: LogCategory,
    tags?: string[]
  }) => {
    const startTime = timers.current[operationName];
    if (startTime) {
      const duration = performance.now() - startTime;
      
      // Use info level with duration in details
      logger.info(
        `${operationName} completed in ${duration.toFixed(2)}ms`,
        {
          category: options?.category || LogCategory.PERFORMANCE,
          source,
          details: {
            ...(options?.details as Record<string, unknown> || {}),
            duration
          },
          tags: options?.tags
        }
      );
      
      delete timers.current[operationName];
      return duration;
    }
    
    logger.warn(`Timer "${operationName}" was never started`, {
      source,
      category: LogCategory.PERFORMANCE
    });
    return -1;
  }, [logger, source]);
  
  /**
   * Wrap an async function with performance logging
   */
  const measureAsync = useCallback(async <T>(
    operationName: string,
    fn: () => Promise<T>,
    options?: {
      details?: unknown,
      category?: LogCategory,
      tags?: string[]
    }
  ): Promise<T> => {
    startTimer(operationName);
    try {
      const result = await fn();
      endTimer(operationName, options);
      return result;
    } catch (error) {
      endTimer(operationName, {
        ...options,
        details: { ...(options?.details as Record<string, unknown> || {}), error }
      });
      throw error;
    }
  }, [startTimer, endTimer]);
  
  /**
   * Wrap a synchronous function with performance logging
   */
  const measure = useCallback(<T>(
    operationName: string,
    fn: () => T,
    options?: {
      details?: unknown,
      category?: LogCategory,
      tags?: string[]
    }
  ): T => {
    startTimer(operationName);
    try {
      const result = fn();
      endTimer(operationName, options);
      return result;
    } catch (error) {
      endTimer(operationName, {
        ...options,
        details: { ...(options?.details as Record<string, unknown> || {}), error }
      });
      throw error;
    }
  }, [startTimer, endTimer]);
  
  return {
    startTimer,
    endTimer,
    measure,
    measureAsync
  };
}
