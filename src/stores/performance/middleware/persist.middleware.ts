import { PerformanceState } from '../types';
import { PersistOptions } from 'zustand/middleware';

export const createPersistMiddleware = (): PersistOptions<PerformanceState, PerformanceState> => ({
  name: 'performance-store',
  partialize: (state) => ({
    thresholds: state.thresholds,
    metrics: state.metrics,
    isMonitoring: state.isMonitoring
  }),
});