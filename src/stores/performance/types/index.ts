export * from './metrics';
export * from './thresholds';

import { FrameSlice } from '../metrics/frame/frame.types';
import { StoreSlice } from '../metrics/store/store.types';
import { MemorySlice } from '../metrics/memory/memory.types';
import { MonitoringSlice } from '../monitoring/monitoring.types';
import { PerformanceMetrics } from './metrics';

export interface PerformanceState {
  metrics: PerformanceMetrics;
  thresholds: MonitoringSlice['thresholds'];
  isMonitoring: boolean;
}

export interface PerformanceActions {
  resetMetrics: () => void;
}

export type PerformanceStore = PerformanceState & 
  PerformanceActions & 
  FrameSlice & 
  StoreSlice & 
  MemorySlice & 
  MonitoringSlice;