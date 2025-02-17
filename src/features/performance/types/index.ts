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

export interface PerformanceThresholds {
  frameDrop: number;
  storeUpdate: number;
  animationFrame: number;
  batchSize: number;
}

export interface PerformanceState {
  metrics: PerformanceMetrics;
  thresholds: PerformanceThresholds;
  isMonitoring: boolean;
}

export interface PerformanceContextValue extends PerformanceState {
  startMonitoring: () => void;
  stopMonitoring: () => void;
  resetMetrics: () => void;
  updateThresholds: (thresholds: Partial<PerformanceThresholds>) => void;
}

export type PerformanceStatus = {
  hasFrameDrops: boolean;
  isPerformant: boolean;
  storeHealth: boolean;
}; 