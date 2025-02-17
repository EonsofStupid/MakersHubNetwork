import { BaseMetrics } from '../../types';

export interface FrameMetrics extends BaseMetrics {
  drops: number;
  peaks: number[];
}

export interface FrameState {
  frameMetrics: FrameMetrics;
}

export interface FrameActions {
  recordFrameMetric: (duration: number) => void;
  resetFrameMetrics: () => void;
}

export type FrameSlice = FrameState & FrameActions; 