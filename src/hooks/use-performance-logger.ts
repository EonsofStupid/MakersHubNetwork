
import { useCallback, useMemo } from 'react';
import { useLogger } from './use-logger';
import { LogCategory, LogOptions } from '@/logging/types';

interface PerformanceOptions extends LogOptions {
  category?: LogCategory;
  component?: string;
}

// Performance utility functions
export function usePerformanceLogger(componentName: string, category: LogCategory = LogCategory.PERFORMANCE) {
  const logger = useLogger(`Performance:${componentName}`, category);

  // Custom performance interface with necessary methods
  const performanceAPI = useMemo(() => ({
    mark: (name: string): void => {
      if (typeof performance !== 'undefined') {
        try {
          performance.mark(name);
        } catch (e) {
          logger.warn(`Failed to create performance mark: ${name}`, {
            errorMessage: e instanceof Error ? e.message : String(e)
          });
        }
      }
    },
    
    measure: (name: string, startMark: string, endMark: string): void => {
      if (typeof performance !== 'undefined') {
        try {
          performance.measure(name, startMark, endMark);
        } catch (e) {
          logger.warn(`Failed to create performance measure: ${name}`, {
            errorMessage: e instanceof Error ? e.message : String(e),
            startMark,
            endMark
          });
        }
      }
    },
    
    getEntriesByName: (name: string, type?: string): PerformanceEntry[] => {
      if (typeof performance !== 'undefined') {
        return performance.getEntriesByName(name, type);
      }
      return [];
    },
    
    clearMarks: (name?: string): void => {
      if (typeof performance !== 'undefined') {
        performance.clearMarks(name);
      }
    },
    
    clearMeasures: (name?: string): void => {
      if (typeof performance !== 'undefined') {
        performance.clearMeasures(name);
      }
    }
  }), [logger]);

  // Log custom timing measurement
  const logCustomTiming = useCallback(
    (name: string, duration: number, options?: PerformanceOptions) => {
      logger.logCustomTiming(name, duration, {
        ...options,
        component: componentName,
      });
    },
    [logger, componentName]
  );

  return {
    performance: performanceAPI,
    logCustomTiming,
  };
}
