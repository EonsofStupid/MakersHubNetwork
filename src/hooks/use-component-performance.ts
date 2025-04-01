
import { useRef, useEffect, useCallback } from 'react';
import { usePerformanceLogger } from './use-performance-logger';

/**
 * Hook for monitoring React component performance
 */
export function useComponentPerformance(componentName: string) {
  const { startTimer, endTimer, measure } = usePerformanceLogger(componentName);
  const mountTimeRef = useRef<number>(0);
  const renderCountRef = useRef<number>(0);
  
  // Track component mounting and updates
  useEffect(() => {
    if (renderCountRef.current === 0) {
      // First render (mount)
      mountTimeRef.current = performance.now();
      startTimer('mount');
    } else {
      // Re-render
      startTimer(`render-${renderCountRef.current}`);
    }
    
    renderCountRef.current += 1;
    
    return () => {
      if (renderCountRef.current === 1) {
        // Component is unmounting after first render
        endTimer('mount', {
          details: { lifecycle: 'mount-unmount' }
        });
      } else {
        // End the render timer
        endTimer(`render-${renderCountRef.current - 1}`, {
          details: { renderCount: renderCountRef.current }
        });
      }
    };
  });
  
  // Measure time to first meaningful render
  const markMeaningfulRender = useCallback(() => {
    if (mountTimeRef.current > 0) {
      const timeToMeaningful = performance.now() - mountTimeRef.current;
      
      endTimer('mount', {
        details: {
          timeToMeaningful,
          lifecycle: 'meaningful-render'
        }
      });
    }
  }, [endTimer]);
  
  // Wrapper for measuring specific operations
  const measureOperation = useCallback(<T>(
    operationName: string,
    fn: () => T,
    options?: { details?: unknown }
  ): T => {
    return measure(`${componentName}:${operationName}`, fn, options);
  }, [componentName, measure]);
  
  return {
    renderCount: renderCountRef.current,
    markMeaningfulRender,
    measureOperation
  };
}
