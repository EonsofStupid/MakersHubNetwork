import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createFrameSlice } from './metrics/frame/frame.slice';
import { createStoreSlice } from './metrics/store/store.slice';
import { createMemorySlice } from './metrics/memory/memory.slice';
import { createMonitoringSlice } from './monitoring/monitoring.slice';
import { PerformanceStore } from './types';
import { StateCreator } from 'zustand';

interface PerformanceMetrics {
  fps: number;
  memory: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
  timing: {
    navigationStart: number;
    loadEventEnd: number;
    domComplete: number;
    firstContentfulPaint: number;
  };
  resourceMetrics: {
    name: string;
    duration: number;
    transferSize: number;
    type: string;
  }[];
}

interface PerformanceState {
  metrics: PerformanceMetrics;
  isRecording: boolean;
  recordingStartTime: number | null;
  recordingDuration: number;
  samples: PerformanceMetrics[];
  
  startRecording: () => void;
  stopRecording: () => void;
  updateMetrics: (metrics: Partial<PerformanceMetrics>) => void;
  clearMetrics: () => void;
  addSample: (metrics: PerformanceMetrics) => void;
}

const initialMetrics: PerformanceMetrics = {
  fps: 0,
  memory: {
    usedJSHeapSize: 0,
    totalJSHeapSize: 0,
    jsHeapSizeLimit: 0,
  },
  timing: {
    navigationStart: 0,
    loadEventEnd: 0,
    domComplete: 0,
    firstContentfulPaint: 0,
  },
  resourceMetrics: [],
};

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

export const usePerformanceStore = create<PerformanceState>()((set, get) => ({
  metrics: initialMetrics,
  isRecording: false,
  recordingStartTime: null,
  recordingDuration: 0,
  samples: [],

  startRecording: () => {
    set({
      isRecording: true,
      recordingStartTime: Date.now(),
      samples: [],
    });
  },

  stopRecording: () => {
    const { recordingStartTime } = get();
    set({
      isRecording: false,
      recordingDuration: recordingStartTime ? Date.now() - recordingStartTime : 0,
    });
  },

  updateMetrics: (newMetrics: Partial<PerformanceMetrics>) => {
    set((state) => ({
      metrics: {
        ...state.metrics,
        ...newMetrics,
      },
    }));
  },

  clearMetrics: () => {
    set({
      metrics: initialMetrics,
      samples: [],
      isRecording: false,
      recordingStartTime: null,
      recordingDuration: 0,
    });
  },

  addSample: (metrics: PerformanceMetrics) => {
    set((state) => ({
      samples: [...state.samples, metrics],
    }));
  },
})); 