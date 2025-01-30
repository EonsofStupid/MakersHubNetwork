import { PerformanceMetrics, PerformanceSlice, FrameMetrics } from '../types';
import { updateFrameMetrics } from '../utils';

export interface FrameSlice {
  frameMetrics: FrameMetrics;
  recordFrameMetric: (duration: number) => void;
  resetFrameMetrics: () => void;
}

export const createFrameSlice: PerformanceSlice<FrameSlice> = (set, get) => ({
  frameMetrics: {
    drops: 0,
    averageTime: 0,
    peaks: [],
    lastFrameTimestamp: 0,
  },

  recordFrameMetric: (duration: number) => {
    set((state) => {
      const { frameMetrics } = state;
      const { batchSize, frameDrop } = state.thresholds;
      
      const updatedMetrics = updateFrameMetrics(
        frameMetrics,
        duration,
        frameDrop,
        batchSize
      );
      
      return {
        frameMetrics: {
          ...frameMetrics,
          ...updatedMetrics,
        },
      };
    });
  },

  resetFrameMetrics: () => set(() => ({
    frameMetrics: {
      drops: 0,
      averageTime: 0,
      peaks: [],
      lastFrameTimestamp: 0,
    },
  })),
});