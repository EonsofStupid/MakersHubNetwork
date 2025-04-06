import { useEffect, useRef } from 'react';
import { useLogger } from './use-logger';
import { LogCategory } from '@/logging';

// Extended performance interface with the 'now' method
interface ExtendedPerformance {
  mark: (name: string) => void;
  measure: (name: string, startMark: string, endMark: string) => void;
  getEntriesByName: (name: string, type?: string) => PerformanceEntry[];
  clearMarks: (name?: string) => void;
  clearMeasures: (name?: string) => void;
  now: () => number;
}

// Safe access to performance API
const getPerformance = (): ExtendedPerformance | null => {
  if (typeof window !== 'undefined' && window.performance) {
    // Add the 'now' method if it doesn't exist (for type safety)
    if (!window.performance.now) {
      const originalPerformance = window.performance;
      return {
        ...originalPerformance,
        now: () => Date.now()
      } as ExtendedPerformance;
    }
    return window.performance as ExtendedPerformance;
  }
  return null;
};

interface ComponentPerformanceProps {
  componentName: string;
  enabled?: boolean;
}

export function useComponentPerformance({ componentName, enabled = true }: ComponentPerformanceProps) {
  const logger = useLogger('ComponentPerformance', LogCategory.PERFORMANCE);
  const performance = useRef(getPerformance());
  const mountTime = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || !performance.current) {
      return;
    }

    const now = performance.current.now;

    // Mark mount start
    const mountStartMark = `${componentName}-mount-start`;
    performance.current.mark(mountStartMark);
    mountTime.current = now();

    return () => {
      // Component unmounted
      const unmountMark = `${componentName}-unmount`;
      performance.current?.mark(unmountMark);

      // Measure the time the component was mounted
      const mountDurationMeasure = `${componentName}-mount-duration`;
      performance.current?.measure(mountDurationMeasure, mountStartMark, unmountMark);

      // Log the duration
      const entries = performance.current?.getEntriesByName(mountDurationMeasure);
      if (entries && entries.length > 0) {
        const duration = entries[0].duration;
        logger.debug(`${componentName} mounted for ${duration.toFixed(2)}ms`);
      }

      // Clear marks and measures
      performance.current?.clearMarks(mountStartMark);
      performance.current?.clearMarks(unmountMark);
      performance.current?.clearMeasures(mountDurationMeasure);
    };
  }, [componentName, enabled, logger]);

  useEffect(() => {
    if (!enabled || !performance.current) {
      return;
    }

    // Mark first render after mount
    const firstRenderMark = `${componentName}-first-render`;
    performance.current.mark(firstRenderMark);

    if (mountTime.current) {
      // Measure time to first render
      const timeToFirstRenderMeasure = `${componentName}-time-to-first-render`;
      performance.current.measure(timeToFirstRenderMeasure, `${componentName}-mount-start`, firstRenderMark);

      // Log the duration
      const entries = performance.current.getEntriesByName(timeToFirstRenderMeasure);
      if (entries && entries.length > 0) {
        const duration = entries[0].duration;
        logger.debug(`${componentName} time to first render: ${duration.toFixed(2)}ms`);
      }

      // Clear marks and measures
      performance.current.clearMarks(`${componentName}-mount-start`);
      performance.current.clearMarks(firstRenderMark);
      performance.current.clearMeasures(timeToFirstRenderMeasure);
    }
  }, [componentName, enabled, logger]);
}
