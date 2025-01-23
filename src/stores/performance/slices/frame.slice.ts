import { PerformanceMetrics, PerformanceSlice, FrameMetrics } from '../types';
import { updateFrameMetrics } from '../utils';

export interface FrameSlice {
  frameMetrics: FrameMetrics;
  recordFrameMetric: (duration: number) => void;
  resetFrameMetrics: () => void;
}

export const createFrameSlice: PerformanceSlice<FrameSlice> = (set, get, store) => ({
  frameMetrics: {
    drops: 0,
    averageTime: 0,
    peaks: [],
    lastFrameTimestamp: 0,
  },

  recordFrameMetric: (duration: number) => {
    set((state) => ({
      metrics: {
        ...state.metrics,
        frameMetrics: {
          ...state.metrics.frameMetrics,
          ...updateFrameMetrics(
            state.metrics.frameMetrics,
            duration,
            state.thresholds.frameDrop,
            state.thresholds.batchSize
          ),
        },
      },
    }));
  },

  resetFrameMetrics: () => set((state) => ({
    metrics: {
      ...state.metrics,
      frameMetrics: {
        drops: 0,
        averageTime: 0,
        peaks: [],
        lastFrameTimestamp: 0,
      },
    },
  })),
});