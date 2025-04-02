
import { getLogger } from '../service/logger.service';
import { LogCategory, PerformanceMeasurementOptions, MeasurementResult } from '../types';

/**
 * Create a simple measurement utility for tracking performance
 */
export function createSimpleMeasurement() {
  const timers: Record<string, number> = {};
  
  return {
    start: (name: string) => {
      timers[name] = performance.now();
    },
    end: (name: string) => {
      const start = timers[name];
      if (start == null) return 0;
      const duration = performance.now() - start;
      delete timers[name];
      return duration;
    }
  };
}

/**
 * Measure the execution time of a function
 */
export async function measureExecution<T>(
  name: string,
  fn: () => T | Promise<T>,
  options?: PerformanceMeasurementOptions
): Promise<MeasurementResult<T>> {
  const logger = getLogger(options?.source || 'performance');
  const startTime = performance.now();
  
  try {
    const result = await Promise.resolve(fn());
    const duration = performance.now() - startTime;
    
    logger.performance(name, duration, {
      category: LogCategory.PERFORMANCE,
      ...options
    });
    
    return { result, duration };
  } catch (error) {
    const duration = performance.now() - startTime;
    
    logger.error(`Error in measured function: ${name}`, {
      category: LogCategory.PERFORMANCE,
      details: { 
        error, 
        duration,
        ...options?.details
      }
    });
    
    throw error;
  }
}

/**
 * Create a measurement utility bound to a specific context
 */
export function createMeasurement(source?: string) {
  const logger = getLogger(source || 'performance');
  const simpleMeasurement = createSimpleMeasurement();
  
  return {
    start: simpleMeasurement.start,
    end: (name: string, options?: PerformanceMeasurementOptions) => {
      const duration = simpleMeasurement.end(name);
      if (duration === 0) return 0;
      
      logger.performance(name, duration, options);
      return duration;
    },
    measure: async <T>(
      name: string,
      fn: () => T | Promise<T>,
      options?: PerformanceMeasurementOptions
    ): Promise<T> => {
      const result = await measureExecution(name, fn, {
        source,
        ...options
      });
      
      return result.result;
    }
  };
}

/**
 * Measure a single performance operation
 */
export async function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>,
  options?: PerformanceMeasurementOptions
): Promise<T> {
  const result = await measureExecution(name, fn, options);
  return result.result;
}
