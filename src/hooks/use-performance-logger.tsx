
import { useCallback } from 'react';
import { getLogger } from '@/logging';

/**
 * Type definitions for the performance logger options
 */
export interface PerformanceLoggerOptions {
  minimumDuration?: number;  // Only log operations that take longer than this (in ms)
  logLevel?: 'debug' | 'info' | 'warn' | 'error';  // Log level to use
  includeTimestamp?: boolean; // Whether to include timestamp in logs
}

/**
 * Performance logger hook for measuring and logging operation durations
 */
export function usePerformanceLogger(component: string, options: PerformanceLoggerOptions = {}) {
  const logger = getLogger(`Performance:${component}`);
  
  const defaultOptions: PerformanceLoggerOptions = {
    minimumDuration: 50, // ms
    logLevel: 'debug',
    includeTimestamp: true,
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  /**
   * Measure the execution time of a function and log it
   * @param operationName - Name of the operation being measured
   * @param operation - Function to measure
   * @returns The result of the operation
   */
  const measure = useCallback(<T extends any>(
    operationName: string,
    operation: () => T
  ): T => {
    const start = performance.now();
    let result: T;
    
    try {
      result = operation();
      const duration = performance.now() - start;
      
      // Only log if operation took longer than minimumDuration
      if (duration >= (mergedOptions.minimumDuration || 0)) {
        const message = `${operationName} completed in ${duration.toFixed(2)}ms`;
        
        switch (mergedOptions.logLevel) {
          case 'debug':
            logger.debug(message);
            break;
          case 'info':
            logger.info(message);
            break;
          case 'warn':
            logger.warn(message);
            break;
          case 'error':
            logger.error(message);
            break;
          default:
            logger.debug(message);
        }
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      logger.error(`${operationName} failed after ${duration.toFixed(2)}ms`, { 
        details: { error }
      });
      throw error;
    }
  }, [logger, mergedOptions]);

  /**
   * Measure an async operation and log its duration
   * @param operationName - Name of the operation being measured
   * @param operation - Async function to measure
   * @returns Promise that resolves to the result of the operation
   */
  const measureAsync = useCallback(async <T extends any>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> => {
    const start = performance.now();
    
    try {
      const result = await operation();
      const duration = performance.now() - start;
      
      // Only log if operation took longer than minimumDuration
      if (duration >= (mergedOptions.minimumDuration || 0)) {
        const message = `${operationName} completed in ${duration.toFixed(2)}ms`;
        
        switch (mergedOptions.logLevel) {
          case 'debug':
            logger.debug(message);
            break;
          case 'info':
            logger.info(message);
            break;
          case 'warn':
            logger.warn(message);
            break;
          case 'error':
            logger.error(message);
            break;
          default:
            logger.debug(message);
        }
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      logger.error(`${operationName} failed after ${duration.toFixed(2)}ms`, { 
        details: { error }
      });
      throw error;
    }
  }, [logger, mergedOptions]);

  return { measure, measureAsync };
}
