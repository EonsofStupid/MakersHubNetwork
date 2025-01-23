import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createFrameSlice } from '../metrics/frame/frame.slice';
import { createMonitoringSlice } from '../monitoring/monitoring.slice';
import { PerformanceStore } from './types';
import { createPersistMiddleware } from './middleware';

const createStore = (set: any, get: any, store: any) => {
  const frameSlice = createFrameSlice(set, get, store);
  const monitoringSlice = createMonitoringSlice(set, get, store);

  return {
    ...frameSlice,
    ...monitoringSlice,
    resetMetrics: () => {
      frameSlice.resetFrameMetrics();
    }
  };
};

export const usePerformanceStore = create<PerformanceStore>()(
  persist(
    createStore,
    createPersistMiddleware()
  )
);