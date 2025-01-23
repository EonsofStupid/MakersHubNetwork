import { FrameSlice } from '../metrics/frame/frame.types';
import { MonitoringSlice } from '../monitoring/monitoring.types';

export interface PerformanceStore extends 
  FrameSlice,
  MonitoringSlice {
  resetMetrics: () => void;
}