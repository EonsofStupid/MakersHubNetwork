
import { LogCategory, MeasurementResult, PerformanceMeasurement, PerformanceMeasurementOptions } from '../types';
import { getLogger } from '../service/logger.service';

/**
 * Create a simple measurement utility for timing operations
 */
export function createSimpleMeasurement() {
  const measurements = new Map<string, number>();
  
  return {
    start: (name: string): void => {
      measurements.set(name, performance.now());
    },
    
    end: (name: string): number => {
      const start = measurements.get(name);
      if (start === undefined) {
        console.warn(`No measurement started for "${name}"`);
        return 0;
      }
      
      const duration = performance.now() - start;
      measurements.delete(name);
      return duration;
    },
    
    measure: async <T>(
      name: string,
      fn: () => T | Promise<T>
    ): Promise<MeasurementResult<T>> => {
      const startTime = performance.now();
      try {
        const result = await fn();
        const duration = performance.now() - startTime;
        return { result, duration };
      } catch (error) {
        const duration = performance.now() - startTime;
        // Attach duration to error for logging
        if (error instanceof Error) {
          (error as any).duration = duration;
        }
        throw error;
      }
    }
  };
}

/**
 * Create a performance measurement utility that logs results
 */
export function createMeasurement(source: string): PerformanceMeasurement {
  const logger = getLogger(source);
  const measurements = new Map<string, number>();
  
  return {
    start: (name: string): void => {
      measurements.set(name, performance.now());
    },
    
    end: (name: string): number => {
      const start = measurements.get(name);
      if (start === undefined) {
        logger.warn(`No measurement started for "${name}"`, {
          category: LogCategory.PERFORMANCE
        });
        return 0;
      }
      
      const duration = performance.now() - start;
      measurements.delete(name);
      
      logger.performance(name, duration, {
        category: LogCategory.PERFORMANCE
      });
      
      return duration;
    },
    
    measure: async <T>(
      name: string,
      fn: () => T | Promise<T>,
      options?: PerformanceMeasurementOptions
    ): Promise<T> => {
      const start = performance.now();
      
      try {
        const result = await fn();
        const duration = performance.now() - start;
        
        logger.performance(name, duration, {
          category: options?.category || LogCategory.PERFORMANCE,
          tags: options?.tags
        });
        
        return result;
      } catch (error) {
        const duration = performance.now() - start;
        
        logger.error(`Error in ${name} (${duration.toFixed(2)}ms)`, {
          category: options?.category || LogCategory.PERFORMANCE,
          details: { error },
          tags: options?.tags
        });
        
        throw error;
      }
    }
  };
}

/**
 * Measure the execution time of a synchronous function
 */
export function measureExecution<T>(
  name: string,
  fn: () => T,
  options?: PerformanceMeasurementOptions
): MeasurementResult<T> {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  
  const logger = getLogger('performance');
  logger.performance(name, duration, {
    category: options?.category || LogCategory.PERFORMANCE,
    tags: options?.tags
  });
  
  return { result, duration };
}

/**
 * Measure the execution time of an asynchronous function
 */
export async function measurePerformance<T>(
  name: string,
  fn: () => Promise<T>,
  options?: PerformanceMeasurementOptions
): Promise<MeasurementResult<T>> {
  const start = performance.now();
  
  try {
    const result = await fn();
    const duration = performance.now() - start;
    
    const logger = getLogger('performance');
    logger.performance(name, duration, {
      category: options?.category || LogCategory.PERFORMANCE,
      tags: options?.tags
    });
    
    return { result, duration };
  } catch (error) {
    const duration = performance.now() - start;
    
    const logger = getLogger('performance');
    logger.error(`Error in ${name} (${duration.toFixed(2)}ms)`, {
      category: options?.category || LogCategory.PERFORMANCE,
      details: { error },
      tags: options?.tags
    });
    
    throw error;
  }
}
