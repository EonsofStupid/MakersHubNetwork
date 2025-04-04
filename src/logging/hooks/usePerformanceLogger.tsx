
import { useCallback, useRef } from 'react';
import { getLogger } from '@/logging';
import { LogCategory, PerformanceMeasurementOptions } from '@/logging/types';

/**
 * Hook for measuring and logging operation durations
 */
export function usePerformanceLogger(source: string, options: Partial<PerformanceMeasurementOptions> = {}) {
  const logger = getLogger(source);
  const defaultOptions: PerformanceMeasurementOptions = {
    category: LogCategory.PERFORMANCE,
    warnThreshold: 100,
    ...options
  };
  
  const activeTimers = useRef<Record<string, { start: number; operationName: string }>>({});
  
  // Measure synchronous operations
  const measure = useCallback(
    function measure<T>(operationName: string, operation: () => T): T {
      const start = performance.now();
      let result: T;
      let success = false;
      let error: any;
      
      try {
        result = operation();
        success = true;
        return result;
      } catch (e) {
        error = e;
        throw e;
      } finally {
        const end = performance.now();
        const duration = Math.round(end - start);
        
        logger.performance(
          `${operationName} ${success ? 'completed' : 'failed'} in ${duration}ms`,
          duration,
          success,
          {
            category: defaultOptions.category,
            details: {
              operationName,
              duration,
              success,
              error: error ? String(error) : undefined,
              ...options.details
            },
            tags: [...(defaultOptions.tags || []), 'performance', success ? 'success' : 'error']
          }
        );
        
        if (defaultOptions.onComplete) {
          defaultOptions.onComplete({
            name: operationName,
            duration,
            success
          });
        }
      }
    },
    [logger, defaultOptions]
  );
  
  // Measure asynchronous operations
  const measureAsync = useCallback(
    async function measureAsync<T>(operationName: string, operation: () => Promise<T>): Promise<T> {
      const start = performance.now();
      let success = false;
      let error: any;
      
      try {
        const result = await operation();
        success = true;
        return result;
      } catch (e) {
        error = e;
        throw e;
      } finally {
        const end = performance.now();
        const duration = Math.round(end - start);
        
        logger.performance(
          `${operationName} ${success ? 'completed' : 'failed'} in ${duration}ms`,
          duration,
          success,
          {
            category: defaultOptions.category,
            details: {
              operationName,
              duration,
              success,
              error: error ? String(error) : undefined,
              ...options.details
            },
            tags: [...(defaultOptions.tags || []), 'performance', 'async', success ? 'success' : 'error']
          }
        );
        
        if (defaultOptions.onComplete) {
          defaultOptions.onComplete({
            name: operationName,
            duration,
            success
          });
        }
      }
    },
    [logger, defaultOptions]
  );
  
  return {
    measure,
    measureAsync
  };
}
