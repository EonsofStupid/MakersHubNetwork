import { FrameSlice } from './metrics/frame/frame.types';
import { StoreSlice } from './metrics/store/store.types';
import { MemorySlice } from './metrics/memory/memory.types';
import { MonitoringSlice } from './monitoring/monitoring.types';

export interface BaseMetrics {
  lastTimestamp: number;
  averageTime: number;
}

export interface FrameMetrics extends BaseMetrics {
  drops: number;
  peaks: number[];
}

export interface StoreMetrics extends BaseMetrics {
  updates: number;
  subscribers: Map<string, number>;
  computeTime: number;
  lastUpdateTimestamp: number;
}

export interface MemoryMetrics extends BaseMetrics {
  heapSize: number;
  instances: number;
  lastGC?: number;
}

export interface PerformanceMetrics {
  frameMetrics: FrameMetrics;
  storeMetrics: StoreMetrics;
  memoryMetrics: MemoryMetrics;
}

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