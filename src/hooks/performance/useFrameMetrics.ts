import { useEffect } from 'react';
import { usePerformanceStore } from '@/stores/performance/store';

export const useFrameMetrics = (componentName: string) => {
  const isMonitoring = usePerformanceStore(state => state.isMonitoring);
  const recordFrameMetric = usePerformanceStore(state => state.recordFrameMetric);

  useEffect(() => {
    if (!isMonitoring) return;

    const startTime = performance.now();
    return () => {
      const duration = performance.now() - startTime;
      recordFrameMetric(duration);
    };
  }, [componentName, isMonitoring, recordFrameMetric]);
};