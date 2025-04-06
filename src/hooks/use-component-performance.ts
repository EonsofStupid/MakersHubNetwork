import { useState, useEffect, useRef } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

interface PerformanceMetrics {
  renderCount: number;
  totalRenderTime: number;
  averageRenderTime: number;
  maxRenderTime: number;
  minRenderTime: number;
  startRender: () => void;
  endRender: () => void;
}

interface PerformanceOptions {
  enabled?: boolean;
  logThreshold?: number;
}

// Fix the performance.now() type error by using a type guard
const getPerformanceNow = (): number => {
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return performance.now();
  }
  return Date.now(); // Fallback for environments without performance.now()
};

export function useComponentPerformance(componentName: string, options: PerformanceOptions = {}): PerformanceMetrics {
  const { enabled = true, logThreshold = 1 } = options;
  const [renderCount, setRenderCount] = useState(0);
  const [totalRenderTime, setTotalRenderTime] = useState(0);
  const [averageRenderTime, setAverageRenderTime] = useState(0);
  const [maxRenderTime, setMaxRenderTime] = useState(0);
  const [minRenderTime, setMinRenderTime] = useState(Number.MAX_SAFE_INTEGER);
  const [renderStart, setRenderStart] = useState<number | null>(null);
  const logger = useLogger('ComponentPerformance', LogCategory.PERFORMANCE);
  const isFirstRender = useRef(true);
  
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    if (renderCount > 0) {
      const newAverage = totalRenderTime / renderCount;
      setAverageRenderTime(newAverage);
    }
  }, [renderCount, totalRenderTime]);
  
  const startRender = () => {
    try {
      if (!enabled) return;
      
      // Use our safe wrapper for performance.now()
      const startTime = getPerformanceNow();
      setRenderStart(startTime);
      
      if (process.env.NODE_ENV === 'development') {
        logger.debug(`[${componentName}] Render started`);
      }
    } catch (e) {
      logger.error(`[${componentName}] Error starting render timer: ${e}`);
    }
  };
  
  const endRender = () => {
    try {
      if (!enabled || renderStart === null) return;
      
      // Use our safe wrapper for performance.now()
      const endTime = getPerformanceNow();
      const duration = endTime - renderStart;
      
      setRenderCount((prevCount) => prevCount + 1);
      setTotalRenderTime((prevTotal) => prevTotal + duration);
      setMaxRenderTime((prevMax) => Math.max(prevMax, duration));
      setMinRenderTime((prevMin) => Math.min(prevMin, duration));
      
      if (process.env.NODE_ENV === 'development') {
        logger.debug(`[${componentName}] Render ended in ${duration.toFixed(2)}ms`);
      }
      
      if (duration > logThreshold) {
        logger.warn(`[${componentName}] Render time exceeded threshold (${logThreshold}ms): ${duration.toFixed(2)}ms`);
      }
    } catch (e) {
      logger.error(`[${componentName}] Error ending render timer: ${e}`);
    }
  };
  
  return {
    renderCount,
    totalRenderTime,
    averageRenderTime,
    maxRenderTime,
    minRenderTime,
    startRender,
    endRender
  };
}
