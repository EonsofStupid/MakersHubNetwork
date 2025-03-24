
import { useEffect } from 'react';
import { usePerformanceStore } from '@/stores/performance/store';

export const useFrameMetrics = (componentName: string) => {
  const isMonitoring = usePerformanceStore((state) => state.isMonitoring);
  const recordFrameMetric = usePerformanceStore((state) => state.recordFrameMetric);

  useEffect(() => {
    if (!isMonitoring) return;

    const startTime = performance.now();
    return () => {
      const duration = performance.now() - startTime;
      // Add a null check before invoking the function
      if (recordFrameMetric) {
        recordFrameMetric(duration);
      }
    };
  }, [componentName, isMonitoring, recordFrameMetric]);
};
