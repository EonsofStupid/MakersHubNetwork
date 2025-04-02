
import { v4 as uuidv4 } from 'uuid';
import { LogCategory, MeasurementResult } from '../types';
import { loggerService } from '../service';

/**
 * Creates a measurement utility for logging performance metrics
 */
export function createMeasurement(source: string, category: LogCategory = LogCategory.PERFORMANCE) {
  const measurements = new Map<string, number>();
  
  return {
    /**
     * Start measuring a named operation
     */
    start: (name: string): void => {
      measurements.set(name, performance.now());
    },
    
    /**
     * End measuring a named operation and log the results
     */
    end: (name: string, description?: string, tags?: string[]): number => {
      const startTime = measurements.get(name);
      
      if (!startTime) {
        loggerService.warn(`Measurement "${name}" was never started`, {
          source,
          category,
          details: { name }
        });
        return 0;
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Remove from measurements map
      measurements.delete(name);
      
      // Log the performance measurement
      const message = description || `Completed ${name}`;
      loggerService.performance(message, duration, {
        source,
        category,
        details: { name, duration },
        tags: tags || ['performance', name]
      });
      
      return duration;
    },
    
    /**
     * Measure an operation's execution time
     */
    measure: async <T>(
      name: string,
      operation: () => T | Promise<T>,
      description?: string,
      tags?: string[]
    ): Promise<T> => {
      measurements.set(name, performance.now());
      
      try {
        const result = await operation();
        const endTime = performance.now();
        const duration = endTime - measurements.get(name)!;
        
        // Remove from measurements map
        measurements.delete(name);
        
        // Log the performance measurement
        const message = description || `Completed ${name}`;
        loggerService.performance(message, duration, {
          source,
          category,
          details: { name, duration },
          tags: tags || ['performance', name]
        });
        
        return result;
      } catch (error) {
        // If operation fails, still record duration
        const endTime = performance.now();
        const duration = endTime - measurements.get(name)!;
        
        // Remove from measurements map
        measurements.delete(name);
        
        // Log the failed operation
        loggerService.performance(`Failed ${name}`, duration, {
          source,
          category,
          details: { name, duration, error },
          tags: tags ? [...tags, 'error'] : ['performance', name, 'error']
        });
        
        throw error;
      }
    }
  };
}

/**
 * Measures the execution time of a function and returns the result
 */
export async function measureExecution<T>(
  fn: () => T | Promise<T>,
  source: string,
  name: string,
  category: LogCategory = LogCategory.PERFORMANCE
): Promise<T> {
  const measurement = createMeasurement(source, category);
  return measurement.measure(name, fn);
}

/**
 * Standalone performance measurement utilities that don't depend on the logging system
 * to avoid circular dependencies
 */

/**
 * Measures the execution time of a function without logging
 */
export async function measurePerformance<T>(
  fn: () => T | Promise<T>
): Promise<MeasurementResult<T>> {
  const start = performance.now();
  
  try {
    const result = await fn();
    const duration = performance.now() - start;
    
    return { result, duration };
  } catch (error) {
    const duration = performance.now() - start;
    
    // Add duration information to the error
    const enhancedError = error as any;
    enhancedError.duration = duration;
    
    throw enhancedError;
  }
}

/**
 * Creates a simple performance measurement utility without logging
 */
export function createSimpleMeasurement() {
  const measurements = new Map<string, number>();
  
  return {
    /**
     * Start measuring with given name
     */
    start: (name: string): void => {
      measurements.set(name, performance.now());
    },
    
    /**
     * End measuring with given name
     */
    end: (name: string): number => {
      const startTime = measurements.get(name);
      
      if (!startTime) {
        console.warn(`Measurement "${name}" was never started`);
        return 0;
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Remove from measurements map
      measurements.delete(name);
      
      return duration;
    },
    
    /**
     * Measure an operation from start to finish
     */
    measure: async <T>(
      name: string,
      operation: () => T | Promise<T>
    ): Promise<MeasurementResult<T>> => {
      measurements.set(name, performance.now());
      
      try {
        const result = await operation();
        const endTime = performance.now();
        const duration = endTime - measurements.get(name)!;
        
        // Remove from measurements map
        measurements.delete(name);
        
        return { result, duration };
      } catch (error) {
        // If operation fails, still record duration
        const endTime = performance.now();
        const duration = endTime - measurements.get(name)!;
        
        // Remove from measurements map
        measurements.delete(name);
        
        // Add duration info to error
        const enhancedError = error as any;
        enhancedError.duration = duration;
        
        throw enhancedError;
      }
    }
  };
}
