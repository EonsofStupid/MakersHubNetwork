
import React from 'react';
import { MeasurementResult, PerformanceMeasurementOptions } from '../types';

/**
 * Creates a performance measurement utility
 */
export function createMeasurement(source: string, defaultOptions?: PerformanceMeasurementOptions) {
  return {
    /**
     * Measures the execution time of a synchronous function
     */
    measure: function measure<T>(name: string, fn: () => T, options?: PerformanceMeasurementOptions): MeasurementResult<T> {
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
        
        throw Object.assign(
          error instanceof Error ? error : new Error(String(error)),
          { duration }
        );
      }
    },
    
    /**
     * Measures the execution time of an asynchronous function
     */
    measureAsync: async function measureAsync<T>(
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
        
        throw Object.assign(
          error instanceof Error ? error : new Error(String(error)),
          { duration }
        );
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

/**
 * Creates a simple performance measurement utility
 * for measuring time between start and end calls
 */
export function createSimpleMeasurement() {
  const timers = new Map<string, number>();
  
  return {
    /**
     * Start timing an operation
     */
    start(name: string): void {
      timers.set(name, performance.now());
    },
    
    /**
     * End timing an operation and return the duration
     * Returns 0 if the timer was not started
     */
    end(name: string): number {
      const startTime = timers.get(name);
      if (startTime === undefined) return 0;
      
      const duration = performance.now() - startTime;
      timers.delete(name);
      return duration;
    }
  };
}

/**
 * Measures the average performance of a function over multiple iterations
 */
export function measurePerformance(fn: Function, iterations: number = 1): number {
  const startTime = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const endTime = performance.now();
  return (endTime - startTime) / iterations;
}
