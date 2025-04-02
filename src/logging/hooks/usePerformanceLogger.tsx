// src/logging/hooks/usePerformanceLogger.tsx
import { useCallback, useRef, useEffect } from 'react';
import { useLogger } from './useLogger';
import { LogCategory } from '../types';
import { createSimpleMeasurement } from '../utils/performance';

export function usePerformanceLogger(source: string = 'performance') {
  const { performance } = useLogger(source, LogCategory.PERFORMANCE);
  const simpleMeasurement = useRef(createSimpleMeasurement()).current;

  const start = useCallback((name: string) => {
    simpleMeasurement.start(name);
  }, []);

  const end = useCallback((name: string, description?: string) => {
    const duration = simpleMeasurement.end(name);
    if (duration === 0) return 0;

    performance(description || `Completed ${name}`, duration, {
      details: { name, duration }
    });

    return duration;
  }, []);

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
    const startTime = performance.now();
    return Promise.resolve()
      .then(() => fn())
      .then((result) => {
        const duration = performance.now() - startTime;
        performance(name, duration, {
          category: options?.category || LogCategory.PERFORMANCE,
          tags: options?.tags
        });
        return result;
      })
      .catch((error) => {
        const duration = performance.now() - startTime;
        performance(`${name} failed`, duration, {
          category: options?.category || LogCategory.PERFORMANCE,
          details: { error }
        });
        throw error;
      });
  }

  const measureRender = useCallback((componentName: string, renderTime: number) => {
    performance(`${componentName} render`, renderTime, { tags: ['render'] });
  }, [performance]);

  const measureEffect = useCallback((effectName: string, fn: () => void | (() => void)) => {
    const startTime = performance.now();
    const cleanup = fn();
    const duration = performance.now() - startTime;
    performance(`Effect: ${effectName}`, duration, { tags: ['effect'] });
    return cleanup;
  }, [performance]);

  return {
    start,
    end,
    measure,
    measureAsync,
    measureRender,
    measureEffect
  };
}
