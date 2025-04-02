
import { useCallback, useRef, useEffect } from 'react';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { useToast } from '@/hooks/use-toast';

/**
 * Threshold for slow operations in milliseconds
 */
const SLOW_OPERATION_THRESHOLD = 300;

/**
 * Hook for measuring and logging performance
 */
export function usePerformanceLogger(source: string) {
  const logger = getLogger(source);
  const timers = useRef<Record<string, number>>({});
  const { toast } = useToast();
  
  // Clean up any pending timers on unmount
  useEffect(() => {
    return () => {
      const pendingTimers = Object.keys(timers.current);
      if (pendingTimers.length > 0) {
        logger.warn(`Component unmounted with ${pendingTimers.length} uncompleted timers`, {
          category: LogCategory.PERFORMANCE,
          details: { pendingTimers }
        });
        timers.current = {};
      }
    };
  }, [logger]);
  
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
    tags?: string[],
    alertIfSlow?: boolean
  }) => {
    const startTime = timers.current[operationName];
    if (startTime) {
      const duration = performance.now() - startTime;
      
      // Use the added performance method
      logger.performance(
        `${operationName} completed in ${duration.toFixed(2)}ms`,
        duration,
        {
          ...options,
          source,
          category: options?.category || LogCategory.PERFORMANCE
        }
      );
      
      // Alert if the operation was slow and alertIfSlow is true
      if (options?.alertIfSlow && duration > SLOW_OPERATION_THRESHOLD) {
        toast({
          title: 'Performance Alert',
          description: `${operationName} took ${duration.toFixed(0)}ms, which is slower than expected`,
          variant: 'warning',
          icon: 'clock'
        });
      }
      
      delete timers.current[operationName];
      return duration;
    }
    
    logger.warn(`Timer "${operationName}" was never started`, {
      source,
      category: LogCategory.PERFORMANCE
    });
    return -1;
  }, [logger, source, toast]);
  
  /**
   * Wrap an async function with performance logging
   */
  const measureAsync = useCallback(async <T>(
    operationName: string,
    fn: () => Promise<T>,
    options?: {
      details?: unknown,
      category?: LogCategory,
      tags?: string[],
      alertIfSlow?: boolean
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
        details: { ...(options?.details || {}), error }
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
      tags?: string[],
      alertIfSlow?: boolean
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
        details: { ...(options?.details || {}), error }
      });
      throw error;
    }
  }, [startTimer, endTimer]);
  
  /**
   * Create a memoized callback that includes performance measurement
   */
  const createMeasuredCallback = useCallback(<T extends (...args: any[]) => any>(
    operationName: string,
    fn: T,
    options?: {
      details?: unknown,
      category?: LogCategory,
      tags?: string[],
      alertIfSlow?: boolean
    }
  ): T => {
    return ((...args: Parameters<T>): ReturnType<T> => {
      startTimer(operationName);
      try {
        const result = fn(...args);
        
        // Handle if result is a promise
        if (result instanceof Promise) {
          return result
            .then(value => {
              endTimer(operationName, options);
              return value;
            })
            .catch(error => {
              endTimer(operationName, {
                ...options,
                details: { ...(options?.details || {}), error }
              });
              throw error;
            }) as ReturnType<T>;
        }
        
        endTimer(operationName, options);
        return result;
      } catch (error) {
        endTimer(operationName, {
          ...options,
          details: { ...(options?.details || {}), error }
        });
        throw error;
      }
    }) as T;
  }, [startTimer, endTimer]);
  
  return {
    startTimer,
    endTimer,
    measure,
    measureAsync,
    createMeasuredCallback
  };
}
