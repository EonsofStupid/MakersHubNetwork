
import { useCallback } from 'react';
import { LogCategory } from '../types';
import { useLogger } from './useLogger';
import { createSimpleMeasurement } from '../utils/performance';

/**
 * Hook for measuring performance within React components
 * @param source The source/component name
 * @returns Performance measurement utilities
 */
export function usePerformanceLogger(source: string) {
  const logger = useLogger(source, LogCategory.PERFORMANCE);
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
    logger.performance(message, duration, { 
      details: { name, duration } 
    });
    
    return duration;
  }, [simpleMeasurement, logger]);
  
  // Measure an operation
  const measure = useCallback(async <T,>(
    name: string,
    operation: () => T | Promise<T>,
    description?: string
  ): Promise<T> => {
    try {
      const { result, duration } = await simpleMeasurement.measure(name, operation);
      
      // Log the performance
      const message = description || `Completed ${name}`;
      logger.performance(message, duration, { 
        details: { name, duration } 
      });
      
      return result;
    } catch (error) {
      // The error already has duration info from simpleMeasurement
      const duration = (error as any).duration || 0;
      
      // Log the failed operation
      logger.performance(`Failed ${name}`, duration, { 
        details: { name, error } 
      });
      
      throw error;
    }
  }, [simpleMeasurement, logger]);
  
  return {
    start,
    end,
    measure
  };
}

/**
 * Re-export the component performance hook from React utilities
 */
export { useComponentPerformance } from '../utils/react';
