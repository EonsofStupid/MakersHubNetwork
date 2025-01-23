import { MetricsSlice } from '../types';
import { MemorySlice } from './memory.types';

export const createMemorySlice: MetricsSlice<MemorySlice> = (set) => ({
  memoryMetrics: {
    heapSize: 0,
    instances: 0,
    lastGC: undefined,
    averageTime: 0,
    lastTimestamp: 0
  },
  resetMemoryMetrics: () => set((state) => ({
    ...state,
    metrics: {
      ...state.metrics,
      memoryMetrics: {
        heapSize: 0,
        instances: 0,
        lastGC: undefined,
        averageTime: 0,
        lastTimestamp: 0
      }
    }
  }))
});