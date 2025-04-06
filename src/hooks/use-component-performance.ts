
import { useEffect, useRef } from 'react';
import { usePerformanceLogger } from './use-performance-logger';
import { LogCategory } from '@/logging/types';

// Unique identifier for components
let componentCounter = 0;

interface ComponentPerformanceOptions {
  trackRender?: boolean;
  trackMount?: boolean;
  trackUnmount?: boolean;
  category?: LogCategory;
  componentId?: string;
}

export function useComponentPerformance(
  componentName: string,
  options: ComponentPerformanceOptions = {}
) {
  const {
    trackRender = true,
    trackMount = true,
    trackUnmount = true,
    category = LogCategory.PERFORMANCE,
    componentId,
  } = options;
  
  // Create a unique ID for this component instance
  const idRef = useRef(`${componentName}-${componentId || componentCounter++}`);
  const renderCountRef = useRef(0);
  const mountTimeRef = useRef<number | null>(null);
  
  // Track time between renders
  const lastRenderTimeRef = useRef<number | null>(null);
  
  const { logCustomTiming, performance } = usePerformanceLogger(componentName, category);
  
  // Handle component mount
  useEffect(() => {
    if (trackMount) {
      const mountTime = performance.now();
      mountTimeRef.current = mountTime;
      
      // Create unique mark for this component instance
      const mountMarkName = `${idRef.current}-mount`;
      performance.mark(mountMarkName);
      
      // Log mount timing
      logCustomTiming(`${componentName}:mount`, 0, {
        component: componentName,
        componentId: idRef.current,
      });
    }
    
    // Handle component unmount
    return () => {
      if (trackUnmount && mountTimeRef.current !== null) {
        const unmountTime = performance.now();
        const lifetimeDuration = unmountTime - mountTimeRef.current;
        
        // Log component lifetime
        logCustomTiming(`${componentName}:lifetime`, lifetimeDuration, {
          component: componentName,
          componentId: idRef.current,
          renderCount: renderCountRef.current,
        });
      }
    };
  }, [componentName, trackMount, trackUnmount, logCustomTiming, performance]);
  
  // Track renders
  useEffect(() => {
    if (trackRender) {
      // Increment render count
      renderCountRef.current += 1;
      
      const now = performance.now();
      
      // Track time between renders
      if (lastRenderTimeRef.current !== null) {
        const timeBetweenRenders = now - lastRenderTimeRef.current;
        
        // Only log if this isn't the first render
        if (renderCountRef.current > 1) {
          logCustomTiming(`${componentName}:re-render`, timeBetweenRenders, {
            component: componentName,
            componentId: idRef.current,
            renderCount: renderCountRef.current,
          });
        }
      }
      
      // Update last render time
      lastRenderTimeRef.current = now;
    }
  });
  
  return {
    componentId: idRef.current,
    renderCount: renderCountRef.current,
  };
}
