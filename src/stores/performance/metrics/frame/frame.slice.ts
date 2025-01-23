import { MetricsSlice } from '../types';
import { FrameSlice } from './frame.types';
import { updateFrameMetrics } from './frame.utils';

export const createFrameSlice: MetricsSlice<FrameSlice> = (set) => ({
  frameMetrics: {
    drops: 0,
    averageTime: 0,
    peaks: [],
    lastTimestamp: 0
  },

  recordFrameMetric: (duration: number) => {
    set((state) => ({
      frameMetrics: updateFrameMetrics(
        state.frameMetrics,
        duration,
        state.thresholds.frameDrop,
        state.thresholds.batchSize
      )
    }));
  },

  resetFrameMetrics: () => set(() => ({
    frameMetrics: {
      drops: 0,
      averageTime: 0,
      peaks: [],
      lastTimestamp: 0
    }
  }))
});