import { PerformanceStore } from '../types';
import { PersistOptions } from 'zustand/middleware';

export const createPersistMiddleware = (): PersistOptions<PerformanceStore, PerformanceStore> => ({
  name: 'performance-store',
  partialize: (state) => ({
    thresholds: state.thresholds,
    metrics: state.metrics,
    isMonitoring: state.isMonitoring
  }),
});