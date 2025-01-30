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