
import { useCallback } from 'react';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

export interface PerformanceLoggerOptions {
  category?: string;
  tags?: string[];
}

export function usePerformanceLogger(source: string, options?: PerformanceLoggerOptions) {
  const logger = getLogger(source, { 
    category: options?.category || LogCategory.PERF as string,
    tags: options?.tags
  });
  
  const measure = useCallback(
    <T>(label: string, fn: () => T, details?: Record<string, unknown>): T => {
      try {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        const duration = end - start;
        
        logger.debug(`${label} completed in ${duration.toFixed(2)}ms`, {
          details: { 
            ...details,
            duration,
            label,
            timestamp: new Date().toISOString()
          }
        });
        
        return result;
      } catch (error) {
        logger.error(`Error in ${label}`, {
          details: {
            ...details,
            error: error instanceof Error ? error.message : String(error)
          }
        });
        throw error;
      }
    },
    [logger]
  );
  
  return { measure };
}
