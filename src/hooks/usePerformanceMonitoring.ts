import { useEffect } from 'react';
import { usePerformanceStore } from '@/stores/performance/store';
import { selectIsMonitoring } from '@/stores/performance/selectors';
import { PerformanceStore } from '@/stores/performance/types';

export const usePerformanceMonitoring = (componentName: string) => {
  const isMonitoring = usePerformanceStore(selectIsMonitoring);
  const recordStoreUpdate = usePerformanceStore((state: PerformanceStore) => state.recordStoreUpdate);

  useEffect(() => {
    if (!isMonitoring) return;

    const startTime = performance.now();

    return () => {
      const duration = performance.now() - startTime;
      recordStoreUpdate(componentName, duration);
    };
  }, [componentName, isMonitoring, recordStoreUpdate]);
};