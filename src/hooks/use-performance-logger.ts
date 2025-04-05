
import { useRef, useEffect } from 'react';
import { useLogger } from './use-logger';
import { LogCategory } from '@/logging';

/**
 * Hook for measuring and logging component performance
 * @param componentName Name of the component
 * @param options Options for performance logging
 */
export function usePerformanceLogger(
  componentName: string,
  options: {
    logMountTime?: boolean;
    logRenderTime?: boolean;
    threshold?: number; // ms threshold for logging warnings
    category?: LogCategory;
  } = {}
) {
  const {
    logMountTime = true,
    logRenderTime = false,
    threshold = 50, // ms
    category = LogCategory.PERFORMANCE
  } = options;
  
  const mountTimeRef = useRef<number>(0);
  const renderTimeRef = useRef<number>(0);
  const logger = useLogger(componentName, category);
  
  // Log mount time
  useEffect(() => {
    if (logMountTime) {
      mountTimeRef.current = performance.now();
      
      return () => {
        const mountDuration = performance.now() - mountTimeRef.current;
        
        if (mountDuration > threshold) {
          logger.warn(`Slow mount time`, {
            details: { 
              mountDuration: `${mountDuration.toFixed(2)}ms`,
              threshold: `${threshold}ms`
            }
          });
        } else {
          logger.debug(`Mount time: ${mountDuration.toFixed(2)}ms`);
        }
      };
    }
  }, [logger, logMountTime, threshold]);
  
  // Log every render time
  useEffect(() => {
    if (logRenderTime) {
      renderTimeRef.current = performance.now();
      
      logger.debug(`Render started`);
      
      return () => {
        const renderDuration = performance.now() - renderTimeRef.current;
        
        if (renderDuration > threshold) {
          logger.warn(`Slow render time`, {
            details: {
              renderDuration: `${renderDuration.toFixed(2)}ms`,
              threshold: `${threshold}ms`
            }
          });
        } else {
          logger.debug(`Render time: ${renderDuration.toFixed(2)}ms`);
        }
      };
    }
  });
  
  return {
    logCustomTiming: (label: string, startTime: number) => {
      const duration = performance.now() - startTime;
      
      if (duration > threshold) {
        logger.warn(`Slow operation: ${label}`, {
          details: {
            duration: `${duration.toFixed(2)}ms`,
            threshold: `${threshold}ms`
          }
        });
      } else {
        logger.debug(`${label}: ${duration.toFixed(2)}ms`);
      }
      
      return duration;
    }
  };
}
