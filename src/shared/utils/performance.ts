
import { LogLevel, LogCategory, MeasurementResult } from '@/logging/types';

/**
 * Simple function to measure performance of a synchronous operation
 */
export function measurePerformance<T>(name: string, fn: () => T, options?: {
  category?: LogCategory;
  warnThreshold?: number;
  onComplete?: (result: MeasurementResult) => void;
  tags?: string[];
  details?: Record<string, any>;
}): T {
  const startTime = performance.now();
  try {
    const result = fn();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Call onComplete callback with successful measurement
    if (options?.onComplete) {
      options.onComplete({
        name,
        duration,
        success: true,
        timestamp: Date.now()
      });
    }
    
    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Call onComplete callback with error information
    if (options?.onComplete) {
      options.onComplete({
        name,
        duration,
        success: false,
        timestamp: Date.now(),
        error: error as Error
      });
    }
    
    throw error;
  }
}

/**
 * Measure performance of an asynchronous operation
 */
export async function measureAsyncPerformance<T>(name: string, fn: () => Promise<T>, options?: {
  category?: LogCategory;
  warnThreshold?: number;
  onComplete?: (result: MeasurementResult) => void;
  tags?: string[];
  details?: Record<string, any>;
}): Promise<T> {
  const startTime = performance.now();
  try {
    const result = await fn();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Call onComplete callback with successful measurement
    if (options?.onComplete) {
      options.onComplete({
        name,
        duration,
        success: true,
        timestamp: Date.now()
      });
    }
    
    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Call onComplete callback with error information
    if (options?.onComplete) {
      options.onComplete({
        name,
        duration,
        success: false,
        timestamp: Date.now(),
        error: error as Error
      });
    }
    
    throw error;
  }
}

/**
 * Create a measurement handler for component performance
 */
export function createMeasurementHandler(
  logger: {
    debug: (message: string, options?: any) => void;
    warn: (message: string, options?: any) => void;
  },
  componentName: string,
  options?: {
    category?: LogCategory;
    warnThreshold?: number;
    tags?: string[];
    baseDetails?: Record<string, any>;
  }
) {
  return (result: MeasurementResult) => {
    const { name, duration, success } = result;
    const warnThreshold = options?.warnThreshold || 100; // Default warn threshold: 100ms
    
    const message = success
      ? `${componentName} » ${name}: ${duration.toFixed(2)}ms`
      : `${componentName} » ${name} failed: ${duration.toFixed(2)}ms`;
    
    const details = {
      ...(options?.baseDetails || {}),
      duration,
      success,
      component: componentName,
      ...(result.error ? { error: result.error.message } : {})
    };
    
    if (duration > warnThreshold) {
      logger.warn(message, {
        category: options?.category || LogCategory.PERFORMANCE,
        tags: [...(options?.tags || []), 'performance', 'slow'],
        details
      });
    } else {
      logger.debug(message, {
        category: options?.category || LogCategory.PERFORMANCE,
        tags: [...(options?.tags || []), 'performance'],
        details
      });
    }
  };
}
