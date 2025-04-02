
import { MeasurementResult, PerformanceMeasurementOptions } from '../types';

/**
 * Creates a performance measurement utility
 */
export function createMeasurement(source: string, defaultOptions?: PerformanceMeasurementOptions) {
  return {
    /**
     * Measures the execution time of a synchronous function
     */
    measure<T>(name: string, fn: () => T, options?: PerformanceMeasurementOptions): MeasurementResult<T> {
      const mergedOptions = { ...defaultOptions, ...options };
      const startTime = performance.now();
      
      try {
        const result = fn();
        const duration = performance.now() - startTime;
        
        if (mergedOptions?.onComplete) {
          mergedOptions.onComplete({
            name,
            duration,
            success: true,
            ...mergedOptions
          });
        }
        
        return { result, duration };
      } catch (error) {
        const duration = performance.now() - startTime;
        
        if (mergedOptions?.onComplete) {
          mergedOptions.onComplete({
            name,
            duration,
            success: false,
            error,
            ...mergedOptions
          });
        }
        
        // Ensure we're returning a proper Error object with duration attached
        const enhancedError = error instanceof Error 
          ? Object.assign(error, { duration }) 
          : Object.assign(new Error(String(error)), { duration, originalError: error });
        
        throw enhancedError;
      }
    },
    
    /**
     * Measures the execution time of an asynchronous function
     */
    async measureAsync<T>(
      name: string, 
      fn: () => Promise<T>, 
      options?: PerformanceMeasurementOptions
    ): Promise<MeasurementResult<T>> {
      const mergedOptions = { ...defaultOptions, ...options };
      const startTime = performance.now();
      
      try {
        const result = await fn();
        const duration = performance.now() - startTime;
        
        if (mergedOptions?.onComplete) {
          mergedOptions.onComplete({
            name,
            duration,
            success: true,
            ...mergedOptions
          });
        }
        
        return { result, duration };
      } catch (error) {
        const duration = performance.now() - startTime;
        
        if (mergedOptions?.onComplete) {
          mergedOptions.onComplete({
            name,
            duration,
            success: false,
            error,
            ...mergedOptions
          });
        }
        
        // Ensure we're returning a proper Error object with duration attached
        const enhancedError = error instanceof Error 
          ? Object.assign(error, { duration }) 
          : Object.assign(new Error(String(error)), { duration, originalError: error });
        
        throw enhancedError;
      }
    }
  };
}

/**
 * Simplified measurement utility functions
 */
export function measureExecution<T>(name: string, fn: () => T): MeasurementResult<T> {
  return createMeasurement('global').measure(name, fn);
}

export function createSimpleMeasurement(source: string) {
  return {
    start(name: string) {
      const startTime = performance.now();
      return {
        end() {
          return performance.now() - startTime;
        }
      };
    }
  };
}

export function measurePerformance(fn: Function, iterations: number = 1): number {
  const startTime = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const endTime = performance.now();
  return (endTime - startTime) / iterations;
}
