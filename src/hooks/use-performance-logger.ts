
import { useCallback } from 'react';
import { usePerformanceLogger as useOriginalPerformanceLogger } from '@/logging/hooks/usePerformanceLogger';
import { LogCategory } from '@/logging/types';

// Interface definition - renamed to avoid conflict
export interface PerformanceLoggerHookOptions {
  category?: LogCategory;
  warnThreshold?: number;
  onComplete?: (result: { name: string; duration: number; success: boolean }) => void;
  source?: string;
  tags?: string[];
}

/**
 * Performance logger hook for measuring and logging operation durations
 * This is a simplified interface over the core performance logger
 */
export function usePerformanceLogger(component: string, options: Partial<PerformanceLoggerHookOptions> = {}) {
  const { measure: originalMeasure, measureAsync: originalMeasureAsync } = useOriginalPerformanceLogger(`Performance:${component}`);
  
  const defaultOptions: Partial<PerformanceLoggerHookOptions> = {
    category: LogCategory.PERFORMANCE,
    warnThreshold: 50,
    ...options
  };
  
  // Wrap the measure function to include default options
  const measure = useCallback(function measure<T>(
    operationName: string,
    operation: () => T
  ): T {
    return originalMeasure(operationName, operation);
  }, [originalMeasure]);
  
  // Wrap the measureAsync function to include default options
  const measureAsync = useCallback(async function measureAsync<T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> {
    return originalMeasureAsync(operationName, operation);
  }, [originalMeasureAsync]);
  
  return { 
    measure, 
    measureAsync 
  };
}

// No conflicting re-export
