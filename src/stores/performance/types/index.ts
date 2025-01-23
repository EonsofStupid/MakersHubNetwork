export * from './metrics';
export * from './thresholds';

import { PerformanceMetrics } from './metrics';
import { PerformanceThresholds } from './thresholds';

export interface PerformanceState {
  metrics: PerformanceMetrics;
  thresholds: PerformanceThresholds;
  isMonitoring: boolean;
}

export interface PerformanceActions {
  startMonitoring: () => void;
  stopMonitoring: () => void;
  recordFrameMetric: (duration: number) => void;
  recordStoreUpdate: (storeName: string, duration: number) => void;
  recordMemorySnapshot: () => void;
  resetMetrics: () => void;
}

export type PerformanceStore = PerformanceState & PerformanceActions;