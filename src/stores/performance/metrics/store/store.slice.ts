
import { StateCreator } from 'zustand';
import { StoreSlice } from './store.types';
import { PerformanceStore } from '../../types';

export const createStoreSlice: StateCreator<
  PerformanceStore,
  [],
  [],
  StoreSlice
> = (set, get) => ({
  storeMetrics: {
    updates: 0,
    subscribers: new Map(),
    computeTime: 0,
    lastTimestamp: 0,
    lastUpdateTimestamp: 0,
    averageTime: 0
  },
  resetStoreMetrics: () => set((state) => ({
    metrics: {
      ...state.metrics,
      storeMetrics: {
        updates: 0,
        subscribers: new Map(),
        computeTime: 0,
        lastTimestamp: 0,
        lastUpdateTimestamp: 0,
        averageTime: 0
      }
    }
  }))
});
