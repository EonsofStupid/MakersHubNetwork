import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createFrameSlice } from '../metrics/frame/frame.slice';
import { createMonitoringSlice } from '../monitoring/monitoring.slice';
import { PerformanceStore } from '../types';
import { createPersistMiddleware } from './middleware';

const createStore = (set: any, get: any, store: any) => {
  const frameSlice = createFrameSlice(set, get, store);
  const monitoringSlice = createMonitoringSlice(set, get, store);

  return {
    metrics: {
      frameMetrics: frameSlice.frameMetrics,
      storeMetrics: {
        updates: 0,
        subscribers: new Map(),
        computeTime: 0,
        lastTimestamp: 0,
        lastUpdateTimestamp: 0,
        averageTime: 0
      },
      memoryMetrics: {
        heapSize: 0,
        instances: 0,
        lastGC: undefined,
        averageTime: 0,
        lastTimestamp: 0
      }
    },
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