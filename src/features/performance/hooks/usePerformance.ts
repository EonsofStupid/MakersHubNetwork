import { useEffect } from 'react';
import { usePerformanceStore } from '@/app/stores/performance/store';
import { PerformanceStatus, PerformanceThresholds } from '../types';

export const usePerformance = () => {
  const {
    metrics,
    thresholds,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    resetMetrics,
    recordFrameMetric,
    resetFrameMetrics,
    resetStoreMetrics,
    resetMemoryMetrics,
    updateThresholds,
  } = usePerformanceStore();

  // Start monitoring when the hook is mounted
  useEffect(() => {
    if (!isMonitoring) {
      startMonitoring();
    }

    return () => {
      if (isMonitoring) {
        stopMonitoring();
      }
    };
  }, [isMonitoring, startMonitoring, stopMonitoring]);

  // Calculate performance status
  const getPerformanceStatus = (): PerformanceStatus => {
    const { frameMetrics, storeMetrics } = metrics;
    const { frameDrop, storeUpdate } = thresholds;

    return {
      hasFrameDrops: frameMetrics.drops > 0,
      isPerformant: frameMetrics.averageTime < frameDrop,
      storeHealth: storeMetrics.computeTime / storeMetrics.updates < storeUpdate,
    };
  };

  // Update performance thresholds
  const setThresholds = (newThresholds: Partial<PerformanceThresholds>) => {
    updateThresholds(newThresholds);
  };

  // Reset all metrics
  const reset = () => {
    resetFrameMetrics();
    resetStoreMetrics();
    resetMemoryMetrics();
    resetMetrics();
  };

  return {
    metrics,
    thresholds,
    isMonitoring,
    status: getPerformanceStatus(),
    startMonitoring,
    stopMonitoring,
    reset,
    setThresholds,
    recordFrameMetric,
  };
}; 