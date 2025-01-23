import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createFrameSlice } from './slices/frame.slice';
import { createStoreSlice } from './slices/store.slice';
import { createMemorySlice } from './slices/memory.slice';
import { createMonitoringSlice } from './slices/monitoring.slice';
import { createPersistMiddleware } from './middleware/persist.middleware';
import { PerformanceStore, PerformanceState } from './types';
import { StateCreator } from 'zustand';

type StoreWithPersist = StateCreator<
  PerformanceStore,
  [],
  [['zustand/persist', unknown]]
>;

const createStore = (): StoreWithPersist => (set, get) => {
  const frameSlice = createFrameSlice(set, get);
  const storeSlice = createStoreSlice(set, get);
  const memorySlice = createMemorySlice(set, get);
  const monitoringSlice = createMonitoringSlice(set, get);

  const initialState: PerformanceStore = {
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

  return initialState;
};

export const usePerformanceStore = create<PerformanceStore>()(
  persist(
    createStore(),
    createPersistMiddleware()
  )
);