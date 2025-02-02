import { PerformanceState } from '../types';

export const selectStoreMetrics = (state: PerformanceState) => state.metrics.storeMetrics;
export const selectStoreUpdates = (state: PerformanceState) => state.metrics.storeMetrics.updates;
export const selectComputeTime = (state: PerformanceState) => state.metrics.storeMetrics.computeTime;
export const selectSubscribers = (state: PerformanceState) => state.metrics.storeMetrics.subscribers;