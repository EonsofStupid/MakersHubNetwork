export * from './metrics';
export * from './thresholds';

import { FrameSlice } from '../slices/frame.slice';
import { StoreSlice } from '../slices/store.slice';
import { MemorySlice } from '../slices/memory.slice';
import { MonitoringSlice } from '../slices/monitoring.slice';

export type PerformanceState = FrameSlice & StoreSlice & MemorySlice & MonitoringSlice;

export type PerformanceActions = {
  resetMetrics: () => void;
};

export type PerformanceStore = PerformanceState & PerformanceActions;