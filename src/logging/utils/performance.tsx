
import { PerformanceMeasurementOptions, MeasurementResult } from '../types';

/**
 * Simple performance measurement utility
 */
export function createSimpleMeasurement() {
  const measurements: Record<string, number> = {};
  
  return {
    /**
     * Start measuring performance for a named operation
     */
    start(name: string): void {
      measurements[name] = performance.now();
      if (typeof performance.mark === 'function') {
        performance.mark(`${name}:start`);
      }
    },
    
    /**
     * End measuring and return the duration in milliseconds
     */
    end(name: string): number {
      const startTime = measurements[name];
      
      if (!startTime) {
        console.warn(`No measurement started for "${name}"`);
        return 0;
      }
      
      const duration = performance.now() - startTime;
      delete measurements[name];
      
      if (typeof performance.mark === 'function') {
        performance.mark(`${name}:end`);
        if (typeof performance.measure === 'function') {
          try {
            performance.measure(name, `${name}:start`, `${name}:end`);
          } catch (e) {
            // Silence errors from performance measurement
          }
        }
      }
      
      return duration;
    },
    
    /**
     * Measure the duration of a function execution
     */
    async measure<T>(
      name: string, 
      fn: () => T | Promise<T>
    ): Promise<MeasurementResult<T>> {
      const startTime = performance.now();
      
      try {
        const result = await fn();
        const duration = performance.now() - startTime;
        
        return { result, duration };
      } catch (error) {
        const duration = performance.now() - startTime;
        (error as any).duration = duration;
        
        throw error;
      }
    }
  };
}

/**
 * Enhanced performance measurement with more features
 */
export function createMeasurement(source?: string) {
  const measurements: Record<string, number> = {};
  
  return {
    /**
     * Start measuring performance for a named operation
     */
    start(name: string): void {
      measurements[name] = performance.now();
      if (typeof performance.mark === 'function') {
        performance.mark(`${source || ''}:${name}:start`);
      }
    },
    
    /**
     * End measuring and return the duration in milliseconds
     */
    end(name: string): number {
      const startTime = measurements[name];
      
      if (!startTime) {
        console.warn(`[${source || 'Performance'}] No measurement started for "${name}"`);
        return 0;
      }
      
      const duration = performance.now() - startTime;
      delete measurements[name];
      
      if (typeof performance.mark === 'function') {
        const markId = `${source || ''}:${name}`;
        performance.mark(`${markId}:end`);
        if (typeof performance.measure === 'function') {
          try {
            performance.measure(markId, `${markId}:start`, `${markId}:end`);
          } catch (e) {
            // Silence errors from performance measurement
          }
        }
      }
      
      return duration;
    },
    
    /**
     * Measure the duration of a function execution
     */
    async measure<T>(
      name: string, 
      fn: () => T | Promise<T>,
      options?: PerformanceMeasurementOptions
    ): Promise<T> {
      const startTime = performance.now();
      
      try {
        const result = await fn();
        const duration = performance.now() - startTime;
        
        if (options?.tags) {
          console.info(`[${source || 'Performance'}] ${name}: ${duration.toFixed(2)}ms`, {
            name,
            duration,
            ...options
          });
        }
        
        return result;
      } catch (error) {
        const duration = performance.now() - startTime;
        (error as any).duration = duration;
        (error as any).measurement = { name, source };
        
        throw error;
      }
    }
  };
}

/**
 * Measure the execution time of a function
 */
export async function measureExecution<T>(
  name: string,
  fn: () => T | Promise<T>
): Promise<MeasurementResult<T>> {
  const measurement = createSimpleMeasurement();
  return measurement.measure(name, fn);
}

/**
 * Higher-order function to add performance measurement
 */
export function measurePerformance<T extends (...args: any[]) => any>(
  name: string,
  fn: T
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const { result, duration } = await measureExecution(name, () => fn(...args));
    console.info(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    return result as ReturnType<T>;
  };
}
