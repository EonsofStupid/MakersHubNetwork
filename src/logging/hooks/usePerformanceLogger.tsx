
import { useCallback } from 'react';
import { getLogger } from '../service/logger.service';
import { LogCategory } from '../types';
import { useComponentPerformance } from './useComponentPerformance';

export interface PerformanceLoggerOptions {
  category?: LogCategory;
  details?: Record<string, unknown>;
}

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
      logger.performance(`${label}`, duration, {
        category: LogCategory.PERFORMANCE
      });
    }
    
    return result;
  }, [logger]);
  
  // Fix the measure method syntax
  const measure = useCallback((
    name: string,
    callback: () => void,
    options?: PerformanceLoggerOptions
  ) => {
    const start = performance.now();
    try {
      const result = callback();
      const duration = performance.now() - start;
      
      logger.performance(name, duration, {
        category: options?.category || LogCategory.PERFORMANCE,
        details: options?.details
      });
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      logger.error(`Error in ${name} after ${duration.toFixed(2)}ms`, {
        category: options?.category || LogCategory.PERFORMANCE,
        details: {
          duration,
          error: error instanceof Error ? {
            message: error.message,
            name: error.name,
            stack: error.stack
          } : String(error),
          ...options?.details
        }
      });
      throw error;
    }
  }, [logger]);
  
  // Fix the measureAsync method syntax
  const measureAsync = useCallback(async <T>(
    name: string,
    asyncFn: () => Promise<T>,
    options?: PerformanceLoggerOptions
  ): Promise<T> => {
    const start = performance.now();
    
    try {
      const result = await asyncFn();
      const duration = performance.now() - start;
      
      logger.performance(name, duration, {
        category: options?.category || LogCategory.PERFORMANCE,
        details: options?.details
      });
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      logger.error(`Error in ${name} after ${duration.toFixed(2)}ms`, {
        category: options?.category || LogCategory.PERFORMANCE,
        details: {
          duration,
          error: error instanceof Error ? {
            message: error.message,
            name: error.name,
            stack: error.stack
          } : String(error),
          ...options?.details
        }
      });
      throw error;
    }
  }, [logger]);
  
  return { 
    logPerformance,
    measure,
    measureAsync
  };
}
