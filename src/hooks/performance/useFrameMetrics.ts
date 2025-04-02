
import { useEffect } from 'react';
import { usePerformanceStore } from '@/stores/performance/store';

/**
 * Hook to monitor component render performance
 * Records frame metrics when the component unmounts
 */
export const useFrameMetrics = (componentName: string) => {
  const isMonitoring = usePerformanceStore((state) => state.isMonitoring);
  const recordFrameMetric = usePerformanceStore((state) => state.recordFrameMetric);

  useEffect(() => {
    if (!isMonitoring) return;

    const startTime = performance.now();
    return () => {
      const duration = performance.now() - startTime;
      recordFrameMetric(duration);
    };
  }, [componentName, isMonitoring, recordFrameMetric]);
};
