
import { StateCreator } from 'zustand';
import { FrameSlice } from './frame.types';
import { updateFrameMetrics } from '../../utils/frame';
import { PerformanceStore } from '../../types';

export const createFrameSlice: StateCreator<
  PerformanceStore,
  [],
  [],
  FrameSlice
> = (set, get, api) => ({
  frameMetrics: {
    drops: 0,
    averageTime: 0,
    peaks: [],
    lastTimestamp: 0
  },

  recordFrameMetric: (duration: number) => {
    set((state) => ({
      metrics: {
        ...state.metrics,
        frameMetrics: updateFrameMetrics(
          state.metrics.frameMetrics,
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
      frameMetrics: {
        drops: 0,
        averageTime: 0,
        peaks: [],
        lastTimestamp: 0
      }
    }
  }))
});
