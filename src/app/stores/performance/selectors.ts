import { PerformanceState } from './types';

export const selectFrameMetrics = (state: PerformanceState) => state.metrics.frameMetrics;
export const selectStoreMetrics = (state: PerformanceState) => state.metrics.storeMetrics;
export const selectMemoryMetrics = (state: PerformanceState) => state.metrics.memoryMetrics;
export const selectThresholds = (state: PerformanceState) => state.thresholds;
export const selectIsMonitoring = (state: PerformanceState) => state.isMonitoring;

export const selectPerformanceStatus = (state: PerformanceState) => {
  const { frameMetrics, storeMetrics } = state.metrics;
  const { frameDrop, storeUpdate } = state.thresholds;

  return {
    hasFrameDrops: frameMetrics.drops > 0,
    isPerformant: frameMetrics.averageTime < frameDrop,
    storeHealth: storeMetrics.computeTime / storeMetrics.updates < storeUpdate,
  };
}; 