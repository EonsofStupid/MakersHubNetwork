import { PerformanceState } from '../types';
import { PersistOptions } from 'zustand/middleware';

export const createPersistMiddleware = (): PersistOptions<PerformanceState> => ({
  name: 'performance-store',
  partialize: (state: PerformanceState) => ({
    thresholds: state.thresholds,
  }),
});