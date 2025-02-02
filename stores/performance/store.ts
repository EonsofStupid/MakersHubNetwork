import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createFrameSlice } from './metrics/frame/frame.slice';
import { createStoreSlice } from './metrics/store/store.slice';
import { createMemorySlice } from './metrics/memory/memory.slice';
import { createMonitoringSlice } from './monitoring/monitoring.slice';
import { PerformanceStore } from './types';
import { StateCreator } from 'zustand';

const createStore: StateCreator<
  PerformanceStore,
  [],
  [['zustand/persist', unknown]]
> = (set, get, store) => {
  const frameSlice = createFrameSlice(set, get, store);
  const storeSlice = createStoreSlice(set, get, store);
  const memorySlice = createMemorySlice(set, get, store);
  const monitoringSlice = createMonitoringSlice(set, get, store);

  return {
    metrics: {
      frameMetrics: frameSlice.frameMetrics,
      storeMetrics: storeSlice.storeMetrics,
      memoryMetrics: memorySlice.memoryMetrics,
    },
    thresholds: monitoringSlice.thresholds,
    isMonitoring: monitoringSlice.isMonitoring,
    ...frameSlice,
    ...storeSlice,
    ...memorySlice,
    ...monitoringSlice,
    resetMetrics: () => {
      frameSlice.resetFrameMetrics();
      storeSlice.resetStoreMetrics();
      memorySlice.resetMemoryMetrics();
    }
  };
};

export const usePerformanceStore = create<PerformanceStore>()(
  persist(
    createStore,
    {
      name: 'performance-store',
      partialize: (state) => state
    }
  )
);