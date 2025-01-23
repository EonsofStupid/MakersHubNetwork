export * from './metrics';
export * from './thresholds';

import { FrameSlice } from '../metrics/frame/frame.types';
import { StoreSlice } from '../metrics/store/store.types';
import { MemorySlice } from '../metrics/memory/memory.types';
import { MonitoringSlice } from '../monitoring/monitoring.types';

export type PerformanceState = {
  metrics: {
    frameMetrics: FrameSlice['frameMetrics'];
    storeMetrics: StoreSlice['storeMetrics'];
    memoryMetrics: MemorySlice['memoryMetrics'];
  };
  thresholds: MonitoringSlice['thresholds'];
  isMonitoring: boolean;
};

export type PerformanceActions = {
  resetMetrics: () => void;
} & FrameSlice & StoreSlice & MemorySlice & MonitoringSlice;

export type PerformanceStore = PerformanceState & PerformanceActions;