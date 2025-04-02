
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

/**
 * Creates a performance measurement utility
 * 
 * @param source The source/component making the measurement
 * @param category The log category
 * @returns A measurement utility
 */
export function createMeasurement(source: string, category: LogCategory = LogCategory.PERFORMANCE) {
  const logger = getLogger(source);
  const measurements = new Map<string, number>();
  
  return {
    /**
     * Start measuring a named operation
     * @param name Name of the operation to measure
     */
    start: (name: string): void => {
      measurements.set(name, performance.now());
    },
    
    /**
     * End measuring a named operation and log the results
     * @param name Name of the operation that was measured
     * @param description Optional description of what was measured
     * @param tags Optional tags to categorize the measurement
     */
    end: (name: string, description?: string, tags?: string[]): number => {
      const startTime = measurements.get(name);
      
      if (!startTime) {
        logger.warn(`Measurement "${name}" was never started`, {
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
      logger.performance(message, duration, {
        category,
        details: { name, duration },
        tags: tags || ['performance', name]
      });
      
      return duration;
    },
    
    /**
     * Measure an operation's execution time
     * @param name Name of the operation
     * @param operation Function to measure
     * @param description Optional description of what was measured
     * @param tags Optional tags to categorize the measurement
     * @returns The result of the operation
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
        logger.performance(message, duration, {
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
        logger.performance(`Failed ${name}`, duration, {
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
 * 
 * @param fn The function to measure
 * @param logger The logger to use
 * @param category The log category
 * @param name Name of the measurement
 * @returns The result of the function
 */
export async function measureExecution<T>(
  fn: () => T | Promise<T>,
  source: string,
  name: string,
  category: LogCategory = LogCategory.PERFORMANCE
): Promise<T> {
  const logger = getLogger(source);
  const startTime = performance.now();
  
  try {
    const result = await fn();
    const duration = performance.now() - startTime;
    
    logger.performance(`Executed ${name}`, duration, {
      category,
      details: { name, duration }
    });
    
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    
    logger.error(`Failed to execute ${name}`, {
      category,
      details: { name, duration, error }
    });
    
    throw error;
  }
}
