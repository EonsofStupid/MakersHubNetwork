
import { create } from 'zustand';
import { PerformanceStore, PerformanceState } from './types';
import { createFrameSlice } from './metrics/frame/frame.slice';
import { createMonitoringSlice } from './monitoring/monitoring.slice';
import { createStoreSlice } from './metrics/store/store.slice';
import { createMemorySlice } from './metrics/memory/memory.slice';
import { getMemoryInfo } from './utils/memory';
import { updateFrameMetrics } from './utils/frame';
import { measureStoreUpdate, updateStoreMetrics } from './utils/store';

// Create a full implementation of the performance store
export const usePerformanceStore = create<PerformanceStore>((set, get) => ({
  // Initial state
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
  
  // Core performance monitoring actions
  resetMetrics: () => {
    set({
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
      }
    });
  },
  
  // Record frame metrics
  recordFrameMetric: (duration: number) => {
    const now = performance.now();
    set((state) => {
      const { frameMetrics } = state.metrics;
      
      // Update frame metrics
      const updatedMetrics = updateFrameMetrics(
        frameMetrics,
        duration,
        state.thresholds.frameDrop,
        state.thresholds.batchSize
      );
      
      return {
        metrics: {
          ...state.metrics,
          frameMetrics: {
            ...updatedMetrics,
            lastTimestamp: now
          }
        }
      };
    });
  },
  
  recordFrameDrop: () => {
    set((state) => ({
      metrics: {
        ...state.metrics,
        frameMetrics: {
          ...state.metrics.frameMetrics,
          drops: state.metrics.frameMetrics.drops + 1
        }
      }
    }));
  },
  
  // Store update metrics
  recordStoreUpdate: (storeName: string, updateFn: () => void) => {
    const duration = measureStoreUpdate(updateFn);
    
    set((state) => {
      const { storeMetrics } = state.metrics;
      const subscribers = new Map(storeMetrics.subscribers);
      
      // Update subscriber count
      subscribers.set(
        storeName, 
        (subscribers.get(storeName) ?? 0) + 1
      );
      
      // Update metrics
      const updatedMetrics = updateStoreMetrics(
        {
          updates: storeMetrics.updates,
          computeTime: storeMetrics.computeTime
        },
        duration
      );
      
      return {
        metrics: {
          ...state.metrics,
          storeMetrics: {
            ...storeMetrics,
            ...updatedMetrics,
            subscribers
          }
        }
      };
    });
  },
  
  // Memory metrics
  checkMemoryUsage: () => {
    const memInfo = getMemoryInfo();
    if (!memInfo) return;
    
    set((state) => {
      const { heapSize, instances, lastGC } = memInfo;
      const { memoryMetrics } = state.metrics;
      
      // Calculate average with simple moving average
      const prev = memoryMetrics.heapSize;
      const avg = prev === 0 
        ? heapSize 
        : (prev * 0.7) + (heapSize * 0.3);
      
      return {
        metrics: {
          ...state.metrics,
          memoryMetrics: {
            ...memoryMetrics,
            heapSize,
            instances,
            lastGC,
            averageTime: avg,
            lastTimestamp: performance.now()
          }
        }
      };
    });
  },
  
  // Include the slices - this adds the remaining state and actions
  ...createFrameSlice(set, get),
  ...createStoreSlice(set, get),
  ...createMemorySlice(set, get),
  ...createMonitoringSlice(set, get)
}));
