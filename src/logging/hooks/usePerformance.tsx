
import { useCallback, useRef, useEffect } from 'react';
import { useLogger } from './useLogger';
import { LogCategory } from '../types';
import { createSimpleMeasurement } from '../utils/performance';

/**
 * Re-export from the newer implementation for backward compatibility
 * @deprecated Use usePerformanceLogger from './usePerformanceLogger' instead
 */
export { usePerformanceLogger, useComponentPerformance } from './usePerformanceLogger';

/**
 * @deprecated Use usePerformanceLogger from './usePerformanceLogger' instead
 */
export function useSimplePerformanceLogger(source: string) {
  const { performance } = useLogger(source, LogCategory.PERFORMANCE);
  const simpleMeasurement = createSimpleMeasurement();
  
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
      start(name);
      const result = await operation();
      const duration = end(name, description);
      
      return result;
    } catch (error) {
      // The error already has duration info from simpleMeasurement
      const duration = end(name);
      
      // Log the failed operation
      performance(`Failed ${name}`, duration, { 
        details: { name, error } 
      });
      
      throw error;
    }
  }, [start, end, performance]);
  
  return {
    start,
    end,
    measure
  };
}
