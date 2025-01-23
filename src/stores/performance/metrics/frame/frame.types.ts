import { FrameMetrics } from '../types';

export interface FrameState {
  metrics: FrameMetrics;
}

export interface FrameActions {
  recordFrameMetric: (duration: number) => void;
  resetFrameMetrics: () => void;
}

export type FrameSlice = FrameState & FrameActions;