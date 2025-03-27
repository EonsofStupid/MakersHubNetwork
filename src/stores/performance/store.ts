
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
export const usePerformanceStore = create<PerformanceStore>((set, get) => {
  // Initial base state
  const baseState: PerformanceState = {
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
    thresholds: {
      frameDrop: 16.67,
      storeUpdate: 4,
      animationFrame: 8,
      batchSize: 50
    },
    isMonitoring: false,
  };
  
  // Core performance monitoring actions
  const actions = {
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
  };
  
  // Combine base state with slices and actions
  return {
    ...baseState,
    ...actions,
    ...createFrameSlice(set, get),
    ...createStoreSlice(set, get),
    ...createMemorySlice(set, get),
    ...createMonitoringSlice(set, get)
  };
});
