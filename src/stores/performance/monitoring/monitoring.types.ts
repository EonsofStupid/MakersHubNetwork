export interface PerformanceThresholds {
  frameDrop: number;
  storeUpdate: number;
  animationFrame: number;
  batchSize: number;
}

export interface MonitoringState {
  isMonitoring: boolean;
  thresholds: PerformanceThresholds;
}

export interface MonitoringActions {
  startMonitoring: () => void;
  stopMonitoring: () => void;
  updateThresholds: (thresholds: Partial<PerformanceThresholds>) => void;
}

export type MonitoringSlice = MonitoringState & MonitoringActions;