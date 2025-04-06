
import { useRef } from 'react';
import { useLogger } from './use-logger';
import { LogCategory } from '@/logging';

/**
 * Hook for measuring component performance
 */
export function useComponentPerformance(componentName: string) {
  const logger = useLogger(componentName, LogCategory.PERFORMANCE);
  const timers = useRef<Record<string, number>>({});
  
  /**
   * Start measuring a performance timing
   * @param label Label for the timing
   */
  const startTimer = (label: string): void => {
    timers.current[label] = performance.now();
  };
  
  /**
   * End measuring a performance timing and log the result
   * @param label Label for the timing
   * @returns Duration in milliseconds
   */
  const endTimer = (label: string): number | null => {
    const startTime = timers.current[label];
    if (startTime === undefined) {
      logger.warn(`Timer "${label}" was not started`);
      return null;
    }
    
    const duration = logger.logCustomTiming(label, startTime);
    delete timers.current[label];
    return duration;
  };
  
  /**
   * Measure execution time of a function
   * @param label Label for the timing
   * @param fn Function to measure
   * @returns Result of the function
   */
  const measure = <T>(label: string, fn: () => T): T => {
    startTimer(label);
    const result = fn();
    endTimer(label);
    return result;
  };
  
  return {
    startTimer,
    endTimer,
    measure,
    logCustomTiming: logger.logCustomTiming
  };
}
