import { MetricsSlice } from '../types';
import { FrameSlice } from './frame.types';
import { updateFrameMetrics } from './frame.utils';

export const createFrameSlice: MetricsSlice<FrameSlice> = (set) => ({
  metrics: {
    drops: 0,
    averageTime: 0,
    peaks: [],
    lastTimestamp: 0
  },

  recordFrameMetric: (duration: number) => {
    set((state) => ({
      metrics: {
        ...state.metrics,
        frame: updateFrameMetrics(
          state.metrics.frame,
          duration,
          state.thresholds.frameDrop,
          state.thresholds.batchSize
        )
      }
    }));
  },

  resetFrameMetrics: () => set((state) => ({
    metrics: {
      ...state.metrics,
      frame: {
        drops: 0,
        averageTime: 0,
        peaks: [],
        lastTimestamp: 0
      }
    }
  }))
});