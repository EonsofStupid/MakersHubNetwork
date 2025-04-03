
import { usePerformanceLogger as useOriginalPerformanceLogger, PerformanceLoggerOptions } from '@/logging/hooks/usePerformanceLogger';
import { LogCategory } from '@/logging/types';

/**
 * Performance logger hook for measuring and logging operation durations
 * This is a simplified interface over the core performance logger
 */
export function usePerformanceLogger(component: string, options: Partial<PerformanceLoggerOptions> = {}) {
  const { measure, measureAsync } = useOriginalPerformanceLogger(`Performance:${component}`);
  
  const defaultOptions: Partial<PerformanceLoggerOptions> = {
    category: LogCategory.PERFORMANCE,
    threshold: 50,
    ...options
  };
  
  // Wrap the measure function to include default options
  const wrappedMeasure = <T extends any>(
    operationName: string,
    operation: () => T
  ): T => {
    return measure(operationName, operation, defaultOptions);
  };
  
  // Wrap the measureAsync function to include default options
  const wrappedMeasureAsync = async <T extends any>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> => {
    return measureAsync(operationName, operation, defaultOptions);
  };
  
  return { 
    measure: wrappedMeasure, 
    measureAsync: wrappedMeasureAsync 
  };
}

// Re-export the types for external use
export type { PerformanceLoggerOptions };
