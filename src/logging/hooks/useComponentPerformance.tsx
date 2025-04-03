
import { useEffect, useRef } from 'react';
import { getLogger } from '../service/logger.service';
import { LogCategory } from '../types';

export function useComponentPerformance(
  componentName: string, 
  options: { 
    trackMount?: boolean;
    trackUpdate?: boolean;
    trackUnmount?: boolean;
    warnThreshold?: number; 
  } = {}
) {
  const logger = getLogger(componentName);
  const mountTime = useRef<number>(0);
  const updateCount = useRef<number>(0);
  const renderTime = useRef<number>(0);
  
  const { 
    trackMount = true, 
    trackUpdate = false, 
    trackUnmount = false,
    warnThreshold = 50 
  } = options;
  
  // Track component mount time
  useEffect(() => {
    if (trackMount) {
      mountTime.current = performance.now();
      const mountDuration = mountTime.current - performance.timeOrigin;
      
      logger.performance(`${componentName} mounted`, mountDuration, {
        category: LogCategory.PERFORMANCE,
        details: { phase: 'mount' }
      });
    }
    
    // Track component unmount
    return () => {
      if (trackUnmount) {
        const unmountTime = performance.now();
        const totalLifetime = unmountTime - mountTime.current;
        
        logger.performance(`${componentName} unmounted`, totalLifetime, {
          category: LogCategory.PERFORMANCE,
          details: { 
            phase: 'unmount',
            updateCount: updateCount.current,
            totalLifetime
          }
        });
      }
    };
  }, [componentName, logger, trackMount, trackUnmount]);
  
  // Track component updates
  useEffect(() => {
    if (trackUpdate && updateCount.current > 0) {
      const updateTime = performance.now();
      const updateDuration = updateTime - renderTime.current;
      
      if (updateDuration > warnThreshold) {
        logger.warn(`${componentName} update took ${updateDuration.toFixed(2)}ms`, {
          category: LogCategory.PERFORMANCE,
          details: { 
            phase: 'update', 
            updateNumber: updateCount.current,
            duration: updateDuration
          }
        });
      } else {
        logger.performance(`${componentName} updated`, updateDuration, {
          category: LogCategory.PERFORMANCE,
          details: { 
            phase: 'update', 
            updateNumber: updateCount.current
          }
        });
      }
    }
    
    renderTime.current = performance.now();
    updateCount.current += 1;
  });
  
  return { 
    updateCount: updateCount.current,
    logger
  };
}
