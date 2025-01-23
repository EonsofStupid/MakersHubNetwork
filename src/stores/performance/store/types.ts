import { FrameSlice } from '../metrics/frame/frame.types';
import { MonitoringSlice } from '../monitoring/monitoring.types';
import { FrameMetrics, MemoryMetrics, StoreMetrics } from '../metrics/types';

export interface PerformanceState {
  metrics: {
    frameMetrics: FrameMetrics;
    storeMetrics: StoreMetrics;
    memoryMetrics: MemoryMetrics;
  };
  thresholds: MonitoringSlice['thresholds'];
  isMonitoring: boolean;
}

export interface PerformanceActions {
  resetMetrics: () => void;
}

export type PerformanceStore = PerformanceState & PerformanceActions & FrameSlice & MonitoringSlice;