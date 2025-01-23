import { PerformanceMetrics, PerformanceSlice } from '../types';
import { getMemoryInfo } from '../utils';

export interface MemorySlice {
  memoryMetrics: PerformanceMetrics['memoryMetrics'];
  recordMemorySnapshot: () => void;
  resetMemoryMetrics: () => void;
}

export const createMemorySlice: PerformanceSlice<MemorySlice> = (set, get, store) => ({
  memoryMetrics: {
    heapSize: 0,
    instances: 0,
  },

  recordMemorySnapshot: () => {
    const memoryInfo = getMemoryInfo();
    if (memoryInfo) {
      set((state) => ({
        metrics: {
          ...state.metrics,
          memoryMetrics: memoryInfo,
        },
      }));
    }
  },

  resetMemoryMetrics: () => set((state) => ({
    metrics: {
      ...state.metrics,
      memoryMetrics: {
        heapSize: 0,
        instances: 0,
      },
    },
  })),
});