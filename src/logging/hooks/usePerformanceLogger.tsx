
import { useCallback, useMemo, useEffect, useRef } from 'react';
import { useLogger } from './useLogger';
import { LogCategory, PerformanceMeasurementOptions } from '../types';
import { createMeasurement } from '../utils/performance';

/**
 * Hook for measuring performance in React components
 */
export function usePerformanceLogger(source: string = 'performance') {
  const logger = useLogger(source, LogCategory.PERFORMANCE);
  
  // Create performance measurement utilities
  const { start, end, measure } = useMemo(() => {
    return createMeasurement(source);
  }, [source]);
  
  // Measure async function execution
  const measureAsync = useCallback(async <T>(
    name: string,
    fn: () => Promise<T> | T,
    options?: PerformanceMeasurementOptions
  ): Promise<T> => {
    const startTime = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - startTime;
      
      logger.performance(name, duration, {
        category: options?.category || LogCategory.PERFORMANCE,
        tags: options?.tags
      });
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      logger.error(`${name} failed after ${duration.toFixed(2)}ms`, {
        category: options?.category || LogCategory.PERFORMANCE,
        details: { error }
      });
      throw error;
    }
  }, [logger]);
  
  return {
    start,
    end,
    measure,
    measureAsync,
    
    // Shorthand for common operations
    measureRender: useCallback((componentName: string, renderTime: number) => {
      logger.performance(`${componentName} render`, renderTime, {
        tags: ['render']
      });
    }, [logger]),
    
    measureEffect: useCallback((effectName: string, fn: () => void | (() => void)) => {
      const startTime = performance.now();
      const cleanup = fn();
      const duration = performance.now() - startTime;
      
      logger.performance(`Effect: ${effectName}`, duration, {
        tags: ['effect']
      });
      
      return cleanup;
    }, [logger])
  };
}

/**
 * Hook for measuring component render performance
 */
export function useComponentPerformance(componentName: string) {
  const { measureRender } = usePerformanceLogger();
  const renderCountRef = useRef(0);
  const renderStartTimeRef = useRef(0);
  
  useEffect(() => {
    renderStartTimeRef.current = performance.now();
    renderCountRef.current += 1;
    
    return () => {
      const renderTime = performance.now() - renderStartTimeRef.current;
      measureRender(componentName, renderTime);
    };
  }, [componentName, measureRender]);
  
  return {
    renderCount: renderCountRef.current
  };
}
