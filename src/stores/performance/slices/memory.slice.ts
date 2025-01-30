import { PerformanceMetrics } from '../types';
import { getMemoryInfo } from '../utils';

export interface MemorySlice {
  memoryMetrics: PerformanceMetrics['memoryMetrics'];
  recordMemorySnapshot: () => void;
  resetMemoryMetrics: () => void;
}

export const createMemorySlice = (set: any, get: any): MemorySlice => ({
  memoryMetrics: {
    heapSize: 0,
    instances: 0,
  },

  recordMemorySnapshot: () => {
    const memoryInfo = getMemoryInfo();
    if (memoryInfo) {
      set((state: any) => ({
        memoryMetrics: memoryInfo,
      }));
    }
  },

  resetMemoryMetrics: () => set((state: any) => ({
    memoryMetrics: {
      heapSize: 0,
      instances: 0,
    },
  })),
});