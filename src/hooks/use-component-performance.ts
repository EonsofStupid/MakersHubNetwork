
import { useEffect, useRef } from 'react';
import { useLogger } from './use-logger';
import { LogCategory } from '@/logging';

interface PerformanceOptions {
  enabled?: boolean;
  threshold?: number;
  trackUpdates?: boolean;
}

/**
 * Hook to track component mount and update performance
 */
export function useComponentPerformance(
  componentName: string,
  options: PerformanceOptions = {}
) {
  const {
    enabled = true,
    threshold = 0,
    trackUpdates = true
  } = options;
  
  const logger = useLogger('ComponentPerformance', LogCategory.PERFORMANCE);
  const mountTime = useRef<number | null>(null);
  const updateCount = useRef<number>(0);
  const lastUpdateTime = useRef<number | null>(null);
  
  // On mount
  useEffect(() => {
    if (!enabled) return;
    
    const startTime = performance.now();
    mountTime.current = startTime;
    
    return () => {
      // On unmount
      const unmountTime = performance.now();
      const duration = mountTime.current 
        ? unmountTime - mountTime.current 
        : 0;
      
      if (duration > threshold) {
        logger.logCustomTiming(
          `${componentName} (total lifecycle)`, 
          duration,
          { details: { component: componentName, type: 'lifecycle' } }
        );
      }
      
      if (trackUpdates && updateCount.current > 0) {
        logger.info(`${componentName} rendered ${updateCount.current} times`, {
          details: { 
            component: componentName, 
            updateCount: updateCount.current 
          } 
        });
      }
    };
  }, [enabled, componentName, threshold, trackUpdates, logger]);
  
  // On each render after mount
  useEffect(() => {
    if (!enabled || !trackUpdates) return;
    
    const now = performance.now();
    
    // Skip first render as it's already tracked by mount timing
    if (lastUpdateTime.current !== null) {
      updateCount.current++;
      const timeSinceLastUpdate = now - lastUpdateTime.current;
      
      if (timeSinceLastUpdate > threshold) {
        logger.logCustomTiming(
          `${componentName} update`, 
          timeSinceLastUpdate,
          { details: { component: componentName, type: 'update', count: updateCount.current } }
        );
      }
    }
    
    lastUpdateTime.current = now;
  });
}

export default useComponentPerformance;
