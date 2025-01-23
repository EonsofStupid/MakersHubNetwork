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

export interface PerformanceThresholds {
  frameDrop: number;
  storeUpdate: number;
  animationFrame: number;
  batchSize: number;
}

export interface PerformanceState {
  metrics: {
    frameMetrics: FrameMetrics;
    storeMetrics: StoreMetrics;
    memoryMetrics: MemoryMetrics;
  };
  thresholds: PerformanceThresholds;
  isMonitoring: boolean;
}

export interface PerformanceActions {
  startMonitoring: () => void;
  stopMonitoring: () => void;
  updateThresholds: (thresholds: Partial<PerformanceThresholds>) => void;
  recordFrameMetric: (duration: number) => void;
  resetMetrics: () => void;
}

export type PerformanceStore = PerformanceState & PerformanceActions;