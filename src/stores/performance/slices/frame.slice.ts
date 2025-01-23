import { PerformanceMetrics } from '../types';
import { updateFrameMetrics } from '../utils';

export interface FrameSlice {
  frameMetrics: PerformanceMetrics['frameMetrics'];
  recordFrameMetric: (duration: number) => void;
  resetFrameMetrics: () => void;
}

export const createFrameSlice = (set: any, get: any): FrameSlice => ({
  frameMetrics: {
    drops: 0,
    averageTime: 0,
    peaks: [],
    lastFrameTimestamp: 0,
  },

  recordFrameMetric: (duration: number) => {
    set((state: any) => {
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

  resetFrameMetrics: () => set((state: any) => ({
    frameMetrics: {
      drops: 0,
      averageTime: 0,
      peaks: [],
      lastFrameTimestamp: 0,
    },
  })),
});