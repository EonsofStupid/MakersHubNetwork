
import { PerformanceState } from './types';

// Frame metrics selectors
export const selectFrameMetrics = (state: PerformanceState) => state.metrics.frameMetrics;
export const selectFrameDrops = (state: PerformanceState) => state.metrics.frameMetrics.drops;
export const selectAverageFrameTime = (state: PerformanceState) => state.metrics.frameMetrics.averageTime;
export const selectFramePeaks = (state: PerformanceState) => state.metrics.frameMetrics.peaks;

// Store metrics selectors
export const selectStoreMetrics = (state: PerformanceState) => state.metrics.storeMetrics;
export const selectStoreUpdates = (state: PerformanceState) => state.metrics.storeMetrics.updates;
export const selectComputeTime = (state: PerformanceState) => state.metrics.storeMetrics.computeTime;
export const selectSubscribers = (state: PerformanceState) => state.metrics.storeMetrics.subscribers;

// Memory metrics selectors
export const selectMemoryMetrics = (state: PerformanceState) => state.metrics.memoryMetrics;
export const selectHeapSize = (state: PerformanceState) => state.metrics.memoryMetrics.heapSize;
export const selectInstances = (state: PerformanceState) => state.metrics.memoryMetrics.instances;

// Configuration selectors
export const selectThresholds = (state: PerformanceState) => state.thresholds;
export const selectIsMonitoring = (state: PerformanceState) => state.isMonitoring;

// Derived selectors
export const selectPerformanceStatus = (state: PerformanceState) => {
  const { frameMetrics, storeMetrics } = state.metrics;
  const { frameDrop, storeUpdate } = state.thresholds;

  return {
    hasFrameDrops: frameMetrics.drops > 0,
    isPerformant: frameMetrics.averageTime < frameDrop,
    storeHealth: storeMetrics.computeTime / (storeMetrics.updates || 1) < storeUpdate,
  };
};
