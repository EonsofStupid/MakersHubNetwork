export interface FrameMetrics {
  drops: number;
  averageTime: number;
  peaks: number[];
  lastFrameTimestamp: number;
}

export interface StoreMetrics {
  updates: number;
  subscribers: Map<string, number>;
  computeTime: number;
  lastTimestamp: number;
  lastUpdateTimestamp: number;
  averageTime: number;
}

export interface MemoryMetrics {
  heapSize: number;
  instances: number;
  lastGC?: number;
}

export interface PerformanceMetrics {
  frameMetrics: FrameMetrics;
  storeMetrics: StoreMetrics;
  memoryMetrics: MemoryMetrics;
}