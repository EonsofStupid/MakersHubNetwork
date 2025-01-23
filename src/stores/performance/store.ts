import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createFrameSlice, FrameSlice } from './slices/frame.slice';
import { createStoreSlice, StoreSlice } from './slices/store.slice';
import { createMemorySlice, MemorySlice } from './slices/memory.slice';
import { createMonitoringSlice, MonitoringSlice } from './slices/monitoring.slice';
import { createPersistMiddleware } from './middleware/persist.middleware';
import { PerformanceStore } from './types';

const createStore = (): PerformanceStore => {
  return {
    ...createFrameSlice(set, get),
    ...createStoreSlice(set, get),
    ...createMemorySlice(set, get),
    ...createMonitoringSlice(set, get),
    resetMetrics: () => {
      get().resetFrameMetrics();
      get().resetStoreMetrics();
      get().resetMemoryMetrics();
    },
  };
};

export const usePerformanceStore = create<PerformanceStore>()(
  persist(
    createStore,
    createPersistMiddleware()
  )
);