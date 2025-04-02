
/**
 * Performance measurement utilities that don't depend on the logging system
 * to avoid circular dependencies
 */

/**
 * Measures the execution time of a function and returns the result
 * This version doesn't depend on the logging system
 * 
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
    
    // Re-throw with duration information
    const enhancedError = error as any;
    enhancedError.duration = duration;
    
    throw enhancedError;
  }
}

/**
 * Simple performance measurement with callback for the result
 * 
 * @param fn Function to measure
 * @param onComplete Callback with the duration
 * @returns The result of the function
 */
export async function measure<T>(
  fn: () => T | Promise<T>,
  onComplete: (duration: number, error?: any) => void
): Promise<T> {
  const start = performance.now();
  
  try {
    const result = await fn();
    const duration = performance.now() - start;
    
    onComplete(duration);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    
    onComplete(duration, error);
    throw error;
  }
}

/**
 * Creates a simple performance measurement utility
 * that doesn't depend on the logging system
 * 
 * @returns A measurement utility
 */
export function createSimpleMeasurement() {
  const measurements = new Map<string, number>();
  
  return {
    start: (name: string): void => {
      measurements.set(name, performance.now());
    },
    
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
