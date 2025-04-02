
import { useRef, useCallback } from 'react';
import { useLogger } from './use-logger';
import { LogCategory } from '@/logging/types';

/**
 * Hook for measuring performance within React components
 * 
 * @param source The source/component name
 * @returns Performance measurement utilities
 */
export function usePerformanceLogger(source: string) {
  const { performance } = useLogger(source, LogCategory.PERFORMANCE);
  const measurements = useRef<Record<string, number>>({});
  
  // Start measuring
  const start = useCallback((name: string) => {
    measurements.current[name] = window.performance.now();
  }, []);
  
  // End measuring and log
  const end = useCallback((name: string, description?: string) => {
    const startTime = measurements.current[name];
    
    if (!startTime) {
      console.warn(`Measurement "${name}" was never started`);
      return 0;
    }
    
    const endTime = window.performance.now();
    const duration = endTime - startTime;
    
    // Remove from measurements
    delete measurements.current[name];
    
    // Log the performance
    const message = description || `Completed ${name}`;
    performance(message, duration, { 
      details: { name, duration } 
    });
    
    return duration;
  }, [performance]);
  
  // Measure an operation
  const measure = useCallback(async <T>(
    name: string,
    operation: () => T | Promise<T>,
    description?: string
  ): Promise<T> => {
    start(name);
    
    try {
      const result = await operation();
      end(name, description);
      return result;
    } catch (error) {
      // Still log the duration on error
      const startTime = measurements.current[name];
      if (startTime) {
        const duration = window.performance.now() - startTime;
        delete measurements.current[name];
        
        performance(`Failed ${name}`, duration, { 
          details: { name, error } 
        });
      }
      
      throw error;
    }
  }, [start, end, performance]);
  
  return {
    start,
    end,
    measure
  };
}
