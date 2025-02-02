import { PerformanceState } from '../types';

export const selectMemoryMetrics = (state: PerformanceState) => state.metrics.memoryMetrics;
export const selectHeapSize = (state: PerformanceState) => state.metrics.memoryMetrics.heapSize;
export const selectInstances = (state: PerformanceState) => state.metrics.memoryMetrics.instances;