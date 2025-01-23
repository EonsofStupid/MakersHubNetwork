// Base metrics interface
export interface BaseMetrics {
  lastTimestamp: number;
  averageTime: number;
}

// Frame metrics
export interface FrameMetrics extends BaseMetrics {
  drops: number;
  peaks: number[];
}

// Store metrics
export interface StoreMetrics extends BaseMetrics {
  updates: number;
  subscribers: Map<string, number>;
  computeTime: number;
  lastUpdateTimestamp: number;
}

// Memory metrics
export interface MemoryMetrics extends BaseMetrics {
  heapSize: number;
  instances: number;
  lastGC?: number;
}

// Performance thresholds
export interface PerformanceThresholds {
  frameDrop: number;
  storeUpdate: number;
  animationFrame: number;
  batchSize: number;
}

// Combined metrics interface
export interface PerformanceMetrics {
  frameMetrics: FrameMetrics;
  storeMetrics: StoreMetrics;
  memoryMetrics: MemoryMetrics;
}

// Performance state interface
export interface PerformanceState {
  metrics: PerformanceMetrics;
  thresholds: PerformanceThresholds;
  isMonitoring: boolean;
}

// Performance actions interface
export interface PerformanceActions {
  startMonitoring: () => void;
  stopMonitoring: () => void;
  updateThresholds: (thresholds: Partial<PerformanceThresholds>) => void;
  recordFrameMetric: (duration: number) => void;
  resetMetrics: () => void;
}

// Combined store type
export type PerformanceStore = PerformanceState & PerformanceActions;