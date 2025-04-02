
import { useCallback, useRef, useEffect } from 'react';
import { useLogger } from './useLogger';
import { LogCategory, PerformanceMeasurementOptions } from '../types';
import { createSimpleMeasurement } from '../utils/performance';

export function usePerformanceLogger(source: string = 'performance') {
  const { performance: logPerformance } = useLogger(source, LogCategory.PERFORMANCE);
  const simpleMeasurement = useRef(createSimpleMeasurement()).current;

  const start = useCallback((name: string) => {
    simpleMeasurement.start(name);
  }, []);

  const end = useCallback((name: string, description?: string) => {
    const duration = simpleMeasurement.end(name);
    if (duration === 0) return 0;

    logPerformance(description || `Completed ${name}`, duration, {
      details: { name, duration }
    });

    return duration;
  }, [logPerformance]);

  function measure<T>(
    name: string,
    operation: () => T | Promise<T>,
    description?: string
  ): Promise<T> | T {
    try {
      start(name);
      const result = operation();
      if (result instanceof Promise) {
        return result.then((r) => {
          end(name, description);
          return r;
        }).catch((e) => {
          end(name, `Failed: ${name}`);
          throw e;
        });
      } else {
        end(name, description);
        return result;
      }
    } catch (error) {
      end(name, `Failed: ${name}`);
      throw error;
    }
  }

  function measureAsync<T>(
    name: string,
    fn: () => Promise<T> | T,
    options?: {
      category?: LogCategory;
      tags?: string[];
    }
  ): Promise<T> {
    const startTime = window.performance.now();
    return Promise.resolve()
      .then(() => fn())
      .then((result) => {
        const duration = window.performance.now() - startTime;
        logPerformance(name, duration, {
          category: options?.category || LogCategory.PERFORMANCE,
          tags: options?.tags
        });
        return result;
      })
      .catch((error) => {
        const duration = window.performance.now() - startTime;
        logPerformance(`${name} failed`, duration, {
          category: options?.category || LogCategory.PERFORMANCE,
          details: { error }
        });
        throw error;
      });
  }

  const measureRender = useCallback((componentName: string, renderTime: number) => {
    logPerformance(`${componentName} render`, renderTime, { tags: ['render'] });
  }, [logPerformance]);

  const measureEffect = useCallback((effectName: string, fn: () => void | (() => void)) => {
    const startTime = window.performance.now();
    const cleanup = fn();
    const duration = window.performance.now() - startTime;
    logPerformance(`Effect: ${effectName}`, duration, { tags: ['effect'] });
    return cleanup;
  }, [logPerformance]);

  return {
    start,
    end,
    measure,
    measureAsync,
    measureRender,
    measureEffect
  };
}

export function useComponentPerformance(componentName: string) {
  const { measureRender } = usePerformanceLogger(`component:${componentName}`);
  
  useEffect(() => {
    const startTime = window.performance.now();
    return () => {
      const renderTime = window.performance.now() - startTime;
      measureRender(componentName, renderTime);
    };
  }, [componentName, measureRender]);
  
  return { name: componentName };
}
