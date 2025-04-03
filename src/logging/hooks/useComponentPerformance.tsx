
import { useEffect, useRef } from 'react';
import { useLogger } from './useLogger';
import { LogCategory } from '../types';

interface ComponentPerformanceOptions {
  /**
   * Component name (defaults to "Component")
   */
  name?: string;
  
  /**
   * Whether to measure updates
   */
  trackUpdates?: boolean;
  
  /**
   * Threshold in milliseconds for warning about slow renders
   */
  renderWarningThreshold?: number;
  
  /**
   * Log additional component lifecycle events
   */
  verbose?: boolean;
}

/**
 * Hook to measure component performance
 */
export function useComponentPerformance(options: ComponentPerformanceOptions = {}) {
  const {
    name = 'Component',
    trackUpdates = true,
    renderWarningThreshold = 16, // ~1 frame at 60fps
    verbose = false
  } = options;
  
  const logger = useLogger(name, { category: LogCategory.PERFORMANCE as string });
  const mountedAt = useRef<number>(0);
  const renderCount = useRef<number>(0);
  const lastRenderAt = useRef<number>(0);
  
  // Measure mount time
  useEffect(() => {
    const mountedAtTime = performance.now();
    mountedAt.current = mountedAtTime;
    renderCount.current = 1;
    lastRenderAt.current = mountedAtTime;
    
    if (verbose) {
      logger.debug(`${name} mounted`);
    }
    
    return () => {
      const unmountTime = performance.now();
      const lifetime = unmountTime - mountedAt.current;
      
      if (lifetime > 1000) {
        const lifetimeSeconds = (lifetime / 1000).toFixed(2);
        logger.debug(
          `${name} unmounted after ${lifetimeSeconds}s with ${renderCount.current} renders`
        );
      } else {
        logger.debug(
          `${name} unmounted after ${Math.round(lifetime)}ms with ${renderCount.current} renders`
        );
      }
    };
  }, [name, logger, verbose]);
  
  // Track render times
  useEffect(() => {
    if (!trackUpdates || renderCount.current === 0) return;
    
    const renderTime = performance.now();
    const timeSinceLastRender = renderTime - lastRenderAt.current;
    
    // Skip the first render since it's tracked by mount
    if (renderCount.current > 1) {
      if (timeSinceLastRender > renderWarningThreshold) {
        logger.warn(`${name} re-rendered slowly`, {
          details: {
            renderTime: `${timeSinceLastRender.toFixed(2)}ms`,
            renderCount: renderCount.current,
            threshold: `${renderWarningThreshold}ms`
          }
        });
      } else if (verbose) {
        logger.debug(`${name} re-rendered`, {
          details: {
            renderTime: `${timeSinceLastRender.toFixed(2)}ms`,
            renderCount: renderCount.current
          }
        });
      }
    }
    
    renderCount.current += 1;
    lastRenderAt.current = renderTime;
  });
}
