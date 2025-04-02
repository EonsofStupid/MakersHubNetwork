
import { useCallback, useRef, useEffect } from 'react';
import { useLogger } from './useLogger';
import { LogCategory } from '../types';
import { createSimpleMeasurement } from '../utils/performance';

/**
 * Hook for measuring performance within React components
 * @deprecated Use usePerformanceLogger from './usePerformanceLogger' instead
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

/**
 * Hook for monitoring React component performance
 * @deprecated Use useComponentPerformance from './usePerformanceLogger' instead
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
