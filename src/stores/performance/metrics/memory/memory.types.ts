import { MemoryMetrics } from '../../types/metrics';

export interface MemoryState {
  memoryMetrics: MemoryMetrics;
}

export interface MemoryActions {
  resetMemoryMetrics: () => void;
}

export type MemorySlice = MemoryState & MemoryActions;