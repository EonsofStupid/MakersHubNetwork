export * from './metrics';
export * from './thresholds';

import { FrameSlice } from '../slices/frame.slice';
import { StoreSlice } from '../slices/store.slice';
import { MemorySlice } from '../slices/memory.slice';
import { MonitoringSlice } from '../slices/monitoring.slice';

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