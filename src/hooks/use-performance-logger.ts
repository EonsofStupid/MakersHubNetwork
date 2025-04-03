
import { useCallback } from 'react';
import { usePerformanceLogger as useOriginalPerformanceLogger, PerformanceLoggerOptions } from '@/logging/hooks/usePerformanceLogger';
import { LogCategory } from '@/logging/types';

/**
 * Performance logger hook for measuring and logging operation durations
 * This is a simplified interface over the core performance logger
 */
export function usePerformanceLogger(component: string, options: Partial<PerformanceLoggerOptions> = {}) {
  const { measure: originalMeasure, measureAsync: originalMeasureAsync } = useOriginalPerformanceLogger(`Performance:${component}`);
  
  const defaultOptions: Partial<PerformanceLoggerOptions> = {
    category: LogCategory.PERFORMANCE,
    threshold: 50,
    ...options
  };
  
  // Wrap the measure function to include default options
  const measure = useCallback(function measure<T>(
    operationName: string,
    operation: () => T
  ): T {
    return originalMeasure(operationName, operation, defaultOptions);
  }, [originalMeasure, defaultOptions]);
  
  // Wrap the measureAsync function to include default options
  const measureAsync = useCallback(async function measureAsync<T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> {
    return originalMeasureAsync(operationName, operation, defaultOptions);
  }, [originalMeasureAsync, defaultOptions]);
  
  return { 
    measure, 
    measureAsync 
  };
}

// Re-export the types for external use
export type { PerformanceLoggerOptions };
