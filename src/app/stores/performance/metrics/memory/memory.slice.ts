import { StateCreator } from 'zustand';
import { MemorySlice } from './memory.types';
import { PerformanceStore } from '../../types';

export const createMemorySlice: StateCreator<
  PerformanceStore,
  [],
  [],
  MemorySlice
> = (set) => ({
  memoryMetrics: {
    heapSize: 0,
    instances: 0,
    lastGC: undefined,
    averageTime: 0,
    lastTimestamp: 0
  },
  resetMemoryMetrics: () => set(() => ({
    memoryMetrics: {
      heapSize: 0,
      instances: 0,
      lastGC: undefined,
      averageTime: 0,
      lastTimestamp: 0
    }
  }))
}); 