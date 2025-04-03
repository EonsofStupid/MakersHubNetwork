
import { useCallback, useRef } from 'react';
import { LoggerOptions } from '../types';
import { useLogger } from './useLogger';
import { LogCategory } from '../types';

export interface PerformanceLoggerOptions extends LoggerOptions {
  /**
   * Log level threshold in milliseconds
   * Operations below this threshold will be logged at INFO level
   * Operations above this threshold will be logged at WARN level
   */
  warnThreshold?: number;
  
  /**
   * Whether to automatically add the duration to the log message
   */
  includeDuration?: boolean;
  
  /**
   * Custom formatting function for the duration
   */
  formatDuration?: (duration: number) => string;
}

type PerformanceCallback<T> = () => T;
type AsyncPerformanceCallback<T> = () => Promise<T>;

/**
 * Hook for measuring and logging the performance of operations
 */
export function usePerformanceLogger(
  source?: string,
  options: PerformanceLoggerOptions = {}
) {
  const logger = useLogger(source, {
    ...options,
    category: options.category || LogCategory.PERFORMANCE as string,
  });
  
  const marks = useRef<Map<string, number>>(new Map());
  const warnThreshold = options.warnThreshold || 100; // Default 100ms
  const includeDuration = options.includeDuration !== false; // Default true
  
  /**
   * Format the duration for log messages
   */
  const formatDuration = useCallback((duration: number): string => {
    if (options.formatDuration) {
      return options.formatDuration(duration);
    }
    
    if (duration < 1) {
      return `${duration.toFixed(3)}ms`;
    } else if (duration < 1000) {
      return `${duration.toFixed(2)}ms`;
    } else {
      return `${(duration / 1000).toFixed(2)}s`;
    }
  }, [options]);
  
  /**
   * Start measuring performance for a named operation
   */
  const start = useCallback((name: string) => {
    marks.current.set(name, performance.now());
  }, []);
  
  /**
   * End measuring and log the duration
   */
  const end = useCallback((name: string, message?: string) => {
    const startTime = marks.current.get(name);
    if (startTime === undefined) {
      logger.warn(`Performance mark "${name}" does not exist`, {
        details: { availableMarks: Array.from(marks.current.keys()) }
      });
      return 0;
    }
    
    const duration = performance.now() - startTime;
    const logMessage = message || `Operation "${name}" completed`;
    const formattedMessage = includeDuration 
      ? `${logMessage} in ${formatDuration(duration)}`
      : logMessage;
    
    logger.performance(formattedMessage, duration);
    marks.current.delete(name);
    
    return duration;
  }, [logger, includeDuration, formatDuration]);
  
  /**
   * Measure the execution time of a synchronous function
   */
  const measure = useCallback(function measure<T>(name: string, callback: PerformanceCallback<T>): T {
    start(name);
    try {
      const result = callback();
      end(name);
      return result;
    } catch (error) {
      const duration = end(name);
      logger.error(`Error in measured operation "${name}" (${formatDuration(duration)})`, {
        details: { error }
      });
      throw error;
    }
  }, [start, end, logger, formatDuration]);
  
  /**
   * Measure the execution time of an asynchronous function
   */
  const measureAsync = useCallback(async function measureAsync<T>(
    name: string,
    callback: AsyncPerformanceCallback<T>
  ): Promise<T> {
    start(name);
    try {
      const result = await callback();
      end(name);
      return result;
    } catch (error) {
      const duration = end(name);
      logger.error(`Error in async measured operation "${name}" (${formatDuration(duration)})`, {
        details: { error }
      });
      throw error;
    }
  }, [start, end, logger, formatDuration]);
  
  return {
    start,
    end,
    measure,
    measureAsync
  };
}
