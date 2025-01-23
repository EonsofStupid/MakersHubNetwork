export interface PerformanceMetrics {
  frameMetrics: {
    drops: number;
    averageTime: number;
    peaks: number[];
    lastFrameTimestamp: number;
  };
  storeMetrics: {
    updates: number;
    subscribers: Map<string, number>;
    computeTime: number;
    lastUpdateTimestamp: number;
  };
  memoryMetrics: {
    heapSize: number;
    instances: number;
    lastGC?: number;
  };
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

export interface PerformanceActions {
  startMonitoring: () => void;
  stopMonitoring: () => void;
  recordFrameMetric: (duration: number) => void;
  recordStoreUpdate: (storeName: string, duration: number) => void;
  recordMemorySnapshot: () => void;
  resetMetrics: () => void;
  resetFrameMetrics: () => void;
  resetStoreMetrics: () => void;
  resetMemoryMetrics: () => void;
}

export type PerformanceStore = PerformanceState & PerformanceActions;