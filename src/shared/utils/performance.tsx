
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

const logger = getLogger('PerformanceUtils');

/**
 * Measure execution time of a function
 */
export function measureExecution<T>(fn: () => T, label: string, warnThreshold = 100): T {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  
  if (duration > warnThreshold) {
    logger.warn(`Slow operation: ${label} took ${duration.toFixed(2)}ms`, {
      category: LogCategory.PERFORMANCE,
      details: { duration, threshold: warnThreshold }
    });
  } else {
    logger.performance(label, duration, {
      category: LogCategory.PERFORMANCE
    });
  }
  
  return result;
}

/**
 * Create a performance measurement that can be started and stopped
 */
export function createMeasurement(label: string, warnThreshold = 100) {
  let startTime = 0;
  
  return {
    start() {
      startTime = performance.now();
      return startTime;
    },
    
    stop() {
      const duration = performance.now() - startTime;
      
      if (duration > warnThreshold) {
        logger.warn(`Slow operation: ${label} took ${duration.toFixed(2)}ms`, {
          category: LogCategory.PERFORMANCE,
          details: { duration, threshold: warnThreshold }
        });
      } else {
        logger.performance(label, duration, {
          category: LogCategory.PERFORMANCE
        });
      }
      
      return duration;
    }
  };
}

/**
 * Create a simple one-time measurement
 */
export function createSimpleMeasurement(label: string) {
  const startTime = performance.now();
  
  return () => {
    const duration = performance.now() - startTime;
    logger.performance(label, duration, {
      category: LogCategory.PERFORMANCE
    });
    return duration;
  };
}

/**
 * Measure performance of any function, async or sync
 */
export async function measurePerformance<T>(
  fn: () => T | Promise<T>, 
  label: string, 
  warnThreshold = 100
): Promise<T> {
  const start = performance.now();
  
  try {
    const result = await fn();
    const duration = performance.now() - start;
    
    if (duration > warnThreshold) {
      logger.warn(`Slow operation: ${label} took ${duration.toFixed(2)}ms`, {
        category: LogCategory.PERFORMANCE,
        details: { duration, threshold: warnThreshold }
      });
    } else {
      logger.performance(label, duration, {
        category: LogCategory.PERFORMANCE
      });
    }
    
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    
    logger.error(`Error in ${label} after ${duration.toFixed(2)}ms`, {
      category: LogCategory.PERFORMANCE,
      details: {
        duration,
        error: error instanceof Error ? {
          message: error.message,
          name: error.name,
          stack: error.stack
        } : String(error)
      }
    });
    
    throw error;
  }
}
