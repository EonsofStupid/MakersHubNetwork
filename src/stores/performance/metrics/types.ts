import { StateCreator } from 'zustand';
import { PerformanceStore } from '../store/types';

export interface BaseMetrics {
  lastTimestamp: number;
  averageTime: number;
}

export interface FrameMetrics extends BaseMetrics {
  drops: number;
  peaks: number[];
}

export interface MemoryMetrics extends BaseMetrics {
  heapSize: number;
  instances: number;
  lastGC?: number;
}

export interface StoreMetrics extends BaseMetrics {
  updates: number;
  subscribers: Map<string, number>;
  computeTime: number;
}

export type MetricsSlice<T> = StateCreator<PerformanceStore, [], [], T>;