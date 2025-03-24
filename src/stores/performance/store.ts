
/**
 * This is a stub file to fix TypeScript errors.
 * The actual implementation is in other files.
 */
import { create } from 'zustand';
import { PerformanceStore } from './types';

// Create a minimal implementation to fix type errors
export const usePerformanceStore = create<Partial<PerformanceStore>>(() => ({
  // Only include basic properties to avoid duplicates
  metrics: {
    frameMetrics: {
      lastTimestamp: 0,
      averageTime: 0,
      drops: 0,
      peaks: []
    },
    storeMetrics: {
      lastTimestamp: 0,
      averageTime: 0,
      updates: 0,
      subscribers: new Map(),
      computeTime: 0,
      lastUpdateTimestamp: 0
    },
    memoryMetrics: {
      lastTimestamp: 0,
      averageTime: 0,
      heapSize: 0,
      instances: 0
    }
  },
  // Implement required methods to avoid undefined invocations
  resetMetrics: () => {},
  startMonitoring: () => {},
  stopMonitoring: () => {},
  recordFrameTime: () => {},
  recordFrameDrop: () => {},
  recordStoreUpdate: () => {},
  checkMemoryUsage: () => {}
}));
