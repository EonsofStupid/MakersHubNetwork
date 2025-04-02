
import { useRef, useCallback } from 'react';
import { useLogger } from './use-logger';
import { LogCategory } from '@/logging/types';
import { createSimpleMeasurement } from '@/shared/utils/performance';

/**
 * Hook for measuring performance within React components
 * 
 * @param source The source/component name
 * @returns Performance measurement utilities
 */
export function usePerformanceLogger(source: string) {
  const { performance } = useLogger(source, LogCategory.PERFORMANCE);
  const simpleMeasurement = useRef(createSimpleMeasurement()).current;
  
  // Start measuring
  const start = useCallback((name: string) => {
    simpleMeasurement.start(name);
  }, [simpleMeasurement]);
  
  // End measuring and log
  const end = useCallback((name: string, description?: string) => {
    const duration = simpleMeasurement.end(name);
    
    if (duration === 0) {
      return 0;
    }
    
    // Log the performance
    const message = description || `Completed ${name}`;
    performance(message, duration, { 
      details: { name, duration } 
    });
    
    return duration;
  }, [simpleMeasurement, performance]);
  
  // Measure an operation
  const measure = useCallback(async <T>(
    name: string,
    operation: () => T | Promise<T>,
    description?: string
  ): Promise<T> => {
    try {
      const { result, duration } = await simpleMeasurement.measure(name, operation);
      
      // Log the performance
      const message = description || `Completed ${name}`;
      performance(message, duration, { 
        details: { name, duration } 
      });
      
      return result;
    } catch (error) {
      // The error already has duration info from simpleMeasurement
      const duration = (error as any).duration || 0;
      
      // Log the failed operation
      performance(`Failed ${name}`, duration, { 
        details: { name, error } 
      });
      
      throw error;
    }
  }, [simpleMeasurement, performance]);
  
  return {
    start,
    end,
    measure
  };
}
