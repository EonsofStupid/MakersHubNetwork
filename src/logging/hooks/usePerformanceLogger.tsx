
import { useCallback } from 'react';
import { getLogger } from '../service/logger.service';
import { LogCategory } from '../types';
import { useComponentPerformance } from './useComponentPerformance';

export function usePerformanceLogger(source: string = 'Performance') {
  const logger = getLogger(source);
  
  const logPerformance = useCallback((
    label: string, 
    fn: () => any, 
    warnThreshold: number = 100
  ) => {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    
    if (duration > warnThreshold) {
      logger.warn(`Slow operation: ${label} took ${duration.toFixed(2)}ms`, {
        category: LogCategory.PERFORMANCE,
        details: { duration, threshold: warnThreshold }
      });
    } else {
      logger.performance(label, duration, {
        category: LogCategory.PERFORMANCE
      });
    }
    
    return result;
  }, [logger]);
  
  return { logPerformance };
}
