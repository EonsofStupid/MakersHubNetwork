
import { useCallback, useRef, useEffect } from 'react';
import { useLogger } from './useLogger';
import { LogCategory } from '../types';
import { createSimpleMeasurement, createMeasurement } from '../utils/performance';

/**
 * Hook for measuring performance within React components
 */
export function usePerformanceLogger(source: string = 'performance') {
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
      start(name);
      const result = await operation();
      end(name, description);
      
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

  // Measure async function execution
  const measureAsync = useCallback(async <T>(
    name: string,
    fn: () => Promise<T> | T,
    options?: any
  ): Promise<T> => {
    const startTime = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - startTime;
      
      performance(name, duration, {
        category: options?.category || LogCategory.PERFORMANCE,
        tags: options?.tags
      });
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      performance(`${name} failed`, duration, {
        category: options?.category || LogCategory.PERFORMANCE,
        details: { error }
      });
      throw error;
    }
  }, [performance]);
  
  return {
    start,
    end,
    measure,
    measureAsync,
    
    // Shorthand for common operations
    measureRender: useCallback((componentName: string, renderTime: number) => {
      performance(`${componentName} render`, renderTime, {
        tags: ['render']
      });
    }, [performance]),
    
    measureEffect: useCallback((effectName: string, fn: () => void | (() => void)) => {
      const startTime = performance.now();
      const cleanup = fn();
      const duration = performance.now() - startTime;
      
      performance(`Effect: ${effectName}`, duration, {
        tags: ['effect']
      });
      
      return cleanup;
    }, [performance])
  };
}

/**
 * Hook for monitoring React component performance
 */
export function useComponentPerformance(componentName: string) {
  const { start, end, measure } = usePerformanceLogger(componentName);
  const mountTimeRef = useRef<number>(0);
  const renderCountRef = useRef<number>(0);
  
  // Track component mounting and updates
  useEffect(() => {
    if (renderCountRef.current === 0) {
      // First render (mount)
      mountTimeRef.current = performance.now();
      start('mount');
    } else {
      // Re-render
      start(`render-${renderCountRef.current}`);
    }
    
    renderCountRef.current += 1;
    
    return () => {
      if (renderCountRef.current === 1) {
        // Component is unmounting after first render
        end('mount', 'Component mount to unmount');
      } else {
        // End the render timer
        end(`render-${renderCountRef.current - 1}`, `Component render #${renderCountRef.current - 1}`);
      }
    };
  });
  
  // Measure time to first meaningful render
  const markMeaningfulRender = useCallback(() => {
    if (mountTimeRef.current > 0) {
      const timeToMeaningful = performance.now() - mountTimeRef.current;
      
      end('mount', 'Time to meaningful render');
    }
  }, [end]);
  
  // Wrapper for measuring specific operations
  const measureOperation = useCallback(<T>(
    operationName: string,
    fn: () => T,
    description?: string
  ): T => {
    return measure(`${componentName}:${operationName}`, fn, description);
  }, [componentName, measure]);
  
  return {
    renderCount: renderCountRef.current,
    markMeaningfulRender,
    measureOperation
  };
}
