
/**
 * Performance measurement utilities that don't depend on the logging system
 * to avoid circular dependencies
 */

/**
 * Measures the execution time of a function and returns the result
 * @param fn The function to measure
 * @returns An object with the result and duration
 */
export async function measureExecution<T>(
  fn: () => T | Promise<T>
): Promise<{result: T; duration: number}> {
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
 * Creates a simple performance measurement utility that doesn't
 * depend on the logging system to avoid circular dependencies
 * @returns A measurement utility
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
     * @returns Duration in milliseconds
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
     * @returns Result and duration
     */
    measure: async <T>(
      name: string,
      operation: () => T | Promise<T>
    ): Promise<{ result: T; duration: number }> => {
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
