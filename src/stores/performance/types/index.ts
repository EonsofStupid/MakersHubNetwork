export * from './metrics';
export * from './thresholds';

export interface PerformanceState {
  metrics: PerformanceMetrics;
  thresholds: PerformanceThresholds;
  isMonitoring: boolean;
}