import { BaseMetrics } from '../../types';

export interface MemoryMetrics extends BaseMetrics {
  heapSize: number;
  instances: number;
  lastGC?: number;
}

export interface MemoryState {
  memoryMetrics: MemoryMetrics;
}

export interface MemoryActions {
  resetMemoryMetrics: () => void;
}

export type MemorySlice = MemoryState & MemoryActions;